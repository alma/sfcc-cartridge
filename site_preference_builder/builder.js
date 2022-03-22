/* eslint-disable max-len */

const xml2js = require('xml2js');
const {
  ConfigException
} = require('./error');

let localisationFile = './messages';
const locale = 'en_GB';
if (locale !== 'en_GB') {
  localisationFile += `-${locale}`;
}
const {
  messages
} = require(localisationFile);

// we also remove 1x that isn't deferred, as the api will provide it but we don't want to display it
const filterAllowedPlan = (plan) => {
  return plan.allowed && !(plan.installments_count === 1 && plan.deferred_days === 0);
};

const getMessageKey = (installments, deferredDays) => {
  if (installments > 1 && deferredDays > 0) {
    return 'x_times_deferred_payment';
  }
  if (deferredDays > 0) {
    return 'deferred_payment';
  }
  if (installments > 1) {
    return 'x_times_payment';
  }
  throw new ConfigException('could not find this type of payment');
};

const getSitePrefDisplayInfos = (plan) => {
  const installments = plan.installments_count;
  const deferredDays = plan.deferred_days;
  const minAmount = plan.min_purchase_amount / 100;
  const maxAmount = plan.max_purchase_amount / 100;

  const message = messages[getMessageKey(installments, deferredDays)];
  // use of another variable to avoid side effects
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
    min_disclamer: currentMessage.min_disclamer.replace('[[amount]]', minAmount),
    max: currentMessage.max,
    max_disclamer: currentMessage.max_disclamer.replace('[[amount]]', maxAmount),
    group: currentMessage.group,
    group_id: `ALMA_${installments}_${deferredDays}`
  };
};

/**
 *
 * @param {Object} sitePref should have the following attributes: id, name, type.
 * mandatory, externallyManaged, description and defaultValue are optionals
 * @returns {Object} the created custom site preference
 */
const buildCustomSitePrefObject = (sitePref) => {
  /*  Site pref attributes need to be inputed in a specific order
   ** and js is not very good with that
   */
  const customSitePref = {
    $: {
      'attribute-id': sitePref.id
    },
    'display-name': [{
      _: sitePref.name,
      $: {
        'xml:lang': 'x-default'
      }
    }]
  };

  if (sitePref.description) {
    customSitePref.description = [{
      _: sitePref.description,
      $: {
        'xml:lang': 'x-default'
      }
    }];
  }
  customSitePref.type = [sitePref.type];
  customSitePref['mandatory-flag'] = ['false'];
  if (sitePref.mandatory) {
    customSitePref['mandatory-flag'] = [String(sitePref.mandatory)];
  }
  customSitePref['externally-managed-flag'] = ['false'];
  if (sitePref.externallyManaged) {
    customSitePref['externally-managed-flag'] = [String(sitePref.externallyManaged)];
  }
  if (sitePref.defaultValue) {
    customSitePref['default-value'] = [sitePref.defaultValue];
  }
  return customSitePref;
};

/**
 *
 * @param {string} id group id
 * @param {string} name group name
 * @param {string[]} attributes to attach to the group
 * @returns {Object} created group
 */
const buildCustomGroupObject = (id, name, attributes) => {
  const group = {
    $: {
      'group-id': id
    },
    'display-name': [{
      _: name,
      $: {
        'xml:lang': 'x-default'
      }
    }],
    attribute: []
  };

  attributes.forEach((attr) => {
    group.attribute.push({
      $: {
        'attribute-id': attr
      }
    });
  });
  return group;
};

exports.xmlToJson = async (fileContent) => xml2js.parseStringPromise(fileContent);

exports.jsonToXML = (jsonSitePref) => {
  var builder = new xml2js.Builder();
  return builder.buildObject(jsonSitePref);
};

exports.addFeePlans = (file, plans) => {
  // only keep needed fields
  const plansToSerialize = plans.map((plan) => {
    return {
      allowed: plan.allowed,
      deferred_days: plan.deferred_days,
      deferred_trigger_limit_days: plan.deferred_trigger_limit_days,
      installments_count: plan.installments_count,
      max_purchase_amount: plan.max_purchase_amount,
      min_purchase_amount: plan.min_purchase_amount
    };
  });

  file.metadata['type-extension'][2]['custom-attribute-definitions'][0]['attribute-definition'].push(
    buildCustomSitePrefObject({
      id: 'ALMA_FEEPLANS',
      name: 'ALMA_FEEPLANS',
      type: 'string',
      mandatory: false,
      externallyManaged: true,
      defaultValue: JSON.stringify(plansToSerialize)
    })
  );

  return file;
};

exports.addAPIInfo = (file, url, key, merchantId) => {
  // add ALMA_APIKey as a custom site pref
  file.metadata['type-extension'][2]['custom-attribute-definitions'][0]['attribute-definition'].push(
    buildCustomSitePrefObject({
      id: 'ALMA_APIKey',
      name: 'Your Alma API key',
      type: 'string',
      mandatory: false,
      externallyManaged: true,
      defaultValue: key
    })
  );

  // add ALMA_Merchant_Id as a custom site pref
  file.metadata['type-extension'][2]['custom-attribute-definitions'][0]['attribute-definition'].push(
    buildCustomSitePrefObject({
      id: 'ALMA_Merchant_Id',
      name: 'Your Alma Merchant Id',
      type: 'string',
      mandatory: false,
      externallyManaged: true,
      defaultValue: merchantId
    })
  );

  // add ALMA_APIUrl as a custom site pref
  file.metadata['type-extension'][2]['custom-attribute-definitions'][0]['attribute-definition'].push(
    buildCustomSitePrefObject({
      id: 'ALMA_APIUrl',
      name: 'Alma API Url',
      type: 'string',
      mandatory: false,
      externallyManaged: true,
      defaultValue: url
    })
  );

  return file;
};

exports.addOnShipingOption = (file, plans) => {
  const { merchantHasOnShipment } = require('./onShipment.js');

  if (merchantHasOnShipment(plans)) {
    file.metadata['type-extension'][2]['custom-attribute-definitions'][0]['attribute-definition'].push(
      buildCustomSitePrefObject({
        id: 'ALMA_On_Shipment_Payment',
        name: 'Pay on shipping',
        type: 'boolean',
        mandatory: false,
        externallyManaged: false
      })
    );
  }
  return file;
};

exports.addCustomAttrFromPlan = (file, plans) => {
  plans
    .filter(filterAllowedPlan)
    .forEach((plan) => {
      const {
        id,
        text,
        min,
        max,
        min_disclamer,
        max_disclamer
      } = getSitePrefDisplayInfos(plan);

      file.metadata['type-extension'][2]['custom-attribute-definitions'][0]['attribute-definition'].push(
        buildCustomSitePrefObject({
          id: id,
          name: text,
          type: 'boolean'
        })
      );
      file.metadata['type-extension'][2]['custom-attribute-definitions'][0]['attribute-definition'].push(
        buildCustomSitePrefObject({
          id: `${id}_min`,
          name: min,
          type: 'double',
          description: min_disclamer
        })
      );
      file.metadata['type-extension'][2]['custom-attribute-definitions'][0]['attribute-definition'].push(
        buildCustomSitePrefObject({
          id: `${id}_max`,
          name: max,
          type: 'double',
          description: max_disclamer
        })
      );
    });

  return file;
};

exports.addCustomGroupFromPlan = (file, plans) => {
  plans
    .filter(filterAllowedPlan)
    .forEach((plan) => {
      const {
        id,
        group,
        group_id
      } = getSitePrefDisplayInfos(plan);

      file.metadata['type-extension'][2]['group-definitions'][0]['attribute-group'].push(
        buildCustomGroupObject(group_id, group, [`${id}`, `${id}_min`, `${id}_max`])
      );
    });

  return file;
};
