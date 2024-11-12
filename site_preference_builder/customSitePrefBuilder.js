/* eslint-disable max-len */
import fs from 'fs';
import xml2js from 'xml2js';
import path from 'path';
import { ConfigException } from './error.js';
import { config } from 'dotenv';

config({
    path: path.resolve(new URL('.', import.meta.url).pathname, '../.env')
});

// let localisationFile = './messages.json';
//
// const locale = process.env.LOCALE;
// if (locale !== 'en_GB' && fs.existsSync(new URL(`./messages-${locale}.json`, import.meta.url))) {
//     localisationFile = `./messages-${locale}.json`;
// }

import messages from './messages.json' with { type: 'json' };
// Filter out plans that aren't allowed
const filterAllowedPlan = (plan) => plan.allowed;

const getMessageKey = (installments, deferredDays) => {
    if (installments > 1 && deferredDays > 0) {
        return 'x_times_deferred_payment';
    }
    if (deferredDays > 0) {
        return 'deferred_payment';
    }
    if (installments >= 1) {
        return 'x_times_payment';
    }
    throw new ConfigException('Could not find this type of payment');
};

const getSitePrefDisplayInfos = (plan) => {
    const installments = plan.installments_count;
    const deferredDays = plan.deferred_days;
    const minAmount = plan.min_purchase_amount / 100;
    const maxAmount = plan.max_purchase_amount / 100;

    const message = messages[getMessageKey(installments, deferredDays)];
    const currentMessage = {};
    for (let messageKey of Object.keys(message)) {
        currentMessage[messageKey] = message[messageKey]
            .replace('[[installments]]', installments)
            .replace('[[deferredDays]]', deferredDays);
    }

    return {
        id: `ALMA_general_${installments}_${deferredDays}`,
        lang: 'x-default',
        text: currentMessage.title,
        min: currentMessage.min,
        min_disclaimer: currentMessage.min_disclaimer.replace('[[amount]]', minAmount),
        max: currentMessage.max,
        max_disclaimer: currentMessage.max_disclaimer.replace('[[amount]]', maxAmount),
        group: currentMessage.group,
        group_id: `ALMA_${installments}_${deferredDays}`
    };
};

const buildCustomSitePrefObject = (sitePref) => {
    const customSitePref = {
        $: { 'attribute-id': sitePref.id },
        'display-name': [{
            _: sitePref.name,
            $: { 'xml:lang': 'x-default' }
        }]
    };

    if (sitePref.description) {
        customSitePref.description = [{
            _: sitePref.description,
            $: { 'xml:lang': 'x-default' }
        }];
    }
    customSitePref.type = [sitePref.type];
    customSitePref['mandatory-flag'] = [String(!!sitePref.mandatory)];
    customSitePref['externally-managed-flag'] = [String(!!sitePref.externallyManaged)];

    if (sitePref.defaultValue) {
        customSitePref['default-value'] = [sitePref.defaultValue];
    }

    if (sitePref.valueDefinitions) {
        customSitePref['value-definitions'] = { 'value-definition': sitePref.valueDefinitions.map(value => ({ value })) };
    }

    return customSitePref;
};

const buildCustomGroupObject = (id, name, attributes) => ({
    $: { 'group-id': id },
    'display-name': [{ _: name, $: { 'xml:lang': 'x-default' } }],
    attribute: attributes.map(attr => ({ $: { 'attribute-id': attr } }))
});

export const xmlToJson = async (fileContent) => xml2js.parseStringPromise(fileContent);

export const jsonToXML = (jsonSitePref) => {
    const builder = new xml2js.Builder();
    return builder.buildObject(jsonSitePref);
};

export const addFeePlans = (file, plans) => {
    const plansToSerialize = plans.map(plan => ({
        allowed: plan.allowed,
        deferred_days: plan.deferred_days,
        deferred_trigger_limit_days: plan.deferred_trigger_limit_days,
        installments_count: plan.installments_count,
        max_purchase_amount: plan.max_purchase_amount,
        min_purchase_amount: plan.min_purchase_amount
    }));

    file.metadata['type-extension'][2]['custom-attribute-definitions'][0]['attribute-definition'].push(
        buildCustomSitePrefObject({
            id: 'ALMA_FEE_PLANS',
            name: 'Advanced Alma plan management',
            type: 'string',
            description: 'Can be used to update your Alma plans',
            defaultValue: JSON.stringify(plansToSerialize)
        })
    );

    return file;
};

export const addAPIInfo = (file, url, merchantId) => {
    file.metadata['type-extension'][2]['custom-attribute-definitions'][0]['attribute-definition'].push(
        buildCustomSitePrefObject({ id: 'ALMA_APIKey', name: 'Your Alma API key', type: 'password' }),
        buildCustomSitePrefObject({ id: 'ALMA_Merchant_Id', name: 'Your Alma Merchant Id', type: 'string', defaultValue: merchantId }),
        buildCustomSitePrefObject({ id: 'ALMA_APIUrl', name: 'Alma API Url', type: 'string', defaultValue: url })
    );

    return file;
};

export const addCustomAttrFromPlan = (file, plans) => {
    plans.filter(filterAllowedPlan).forEach(plan => {
        const { id, text, min, max, min_disclaimer, max_disclaimer } = getSitePrefDisplayInfos(plan);
        file.metadata['type-extension'][2]['custom-attribute-definitions'][0]['attribute-definition'].push(
            buildCustomSitePrefObject({ id, name: text, type: 'boolean' }),
            buildCustomSitePrefObject({ id: `${id}_min`, name: min, type: 'double', description: min_disclaimer }),
            buildCustomSitePrefObject({ id: `${id}_max`, name: max, type: 'double', description: max_disclaimer })
        );
    });

    return file;
};

export const addCustomGroupFromPlan = (file, plans) => {
    plans.filter(filterAllowedPlan).forEach(plan => {
        const { id, group, group_id } = getSitePrefDisplayInfos(plan);
        file.metadata['type-extension'][2]['group-definitions'][0]['attribute-group'].push(
            buildCustomGroupObject(group_id, group, [`${id}`, `${id}_min`, `${id}_max`])
        );
    });

    return file;
};

export const addRefundCustomAttributes = (file) => {
    file.metadata['type-extension'][0]['custom-attribute-definitions'][0]['attribute-definition'].push(
        buildCustomSitePrefObject({ id: 'almaRefundedAmount', name: messages.almaRefundedAmount.name, type: 'double', externallyManaged: true }),
        buildCustomSitePrefObject({ id: 'almaWantedRefundAmount', name: messages.almaWantedRefundAmount.name, type: 'double' }),
        buildCustomSitePrefObject({
            id: 'almaRefundType',
            name: messages.almaRefundType.name,
            description: messages.almaRefundType.description,
            type: 'enum-of-string',
            valueDefinitions: [messages.almaRefundType.valueDefinitions.total, messages.almaRefundType.valueDefinitions.partial]
        })
    );

    return file;
};

export const addRefundCustomAttributesGroup = (file) => {
    file.metadata['type-extension'][0]['group-definitions'][0]['attribute-group'].push(
        buildCustomGroupObject('AlmaRefund', messages.AlmaRefund.name, ['almaRefundedAmount', 'almaRefundType', 'almaWantedRefundAmount'])
    );

    return file;
};
