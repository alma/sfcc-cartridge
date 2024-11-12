import { getFeePlansFromAPI } from './api.js';
import { readFile, writeFile, createDir } from './fs.js';
import {
  xmlToJson,
  jsonToXML,
  addCustomAttrFromPlan,
  addCustomGroupFromPlan,
  addFeePlans,
  addAPIInfo,
  addRefundCustomAttributes,
  addRefundCustomAttributesGroup
} from './customSitePrefBuilder.js';
import path from 'path';
import { writeJobsFile } from './jobs.js';
import { config } from 'dotenv';

config({
  path: path.resolve(new URL('.', import.meta.url).pathname, '../.env')
});

const LIVE_MODE = {
  url: 'https://api.getalma.eu/',
  apiKey: process.env.ALMA_LIVE_API_KEY
};
const TEST_MODE = {
  url: 'https://api.sandbox.getalma.eu/',
  apiKey: process.env.ALMA_TEST_API_KEY
};

const METADIR = './metadata/site_template/meta/';
const INPUT_FILE = './site_preference_builder/ref/system-objecttype-extensions.xml';
const OUTPUT_FILE = './metadata/site_template/meta/system-objecttype-extensions.xml';

const REFUND_IS_DISABLED = 'off';

/**
 * Return the merchantId from fee plans
 * @param {Object} feePlans returned from Alma API
 * @returns {string} merchantId
 */
function getMerchantIdFromFeePlans(feePlans) {
  return feePlans[0].merchant;
}

/**
 * Script entry point
 */
async function main() {
  createDir(METADIR);

  const fileContent = readFile(INPUT_FILE);

  const sitePref = await xmlToJson(fileContent);

  const { url, apiKey } = process.env.ALMA_API_MODE === 'live' ? LIVE_MODE : TEST_MODE;
  const plans = await getFeePlansFromAPI(url, apiKey);
  const merchantId = getMerchantIdFromFeePlans(plans);

  let updatedSitePref = addCustomAttrFromPlan(sitePref, plans);
  updatedSitePref = addCustomGroupFromPlan(updatedSitePref, plans);
  updatedSitePref = addFeePlans(updatedSitePref, plans);
  updatedSitePref = addAPIInfo(updatedSitePref, url, merchantId);

  if (process.env.TOGGLE_REFUND !== REFUND_IS_DISABLED) {
    updatedSitePref = addRefundCustomAttributes(updatedSitePref);
    updatedSitePref = addRefundCustomAttributesGroup(updatedSitePref);
  }

  await writeJobsFile(process.env.TOGGLE_REFUND, plans, process.env.SFCC_SITE_NAME);
  writeFile(OUTPUT_FILE, jsonToXML(updatedSitePref));
}

/* eslint-disable no-console */
main().catch((e) => console.log(e));
