const {
  getFeePlansFromAPI
} = require('./api.js');
const {
  readFile,
  writeFile,
  createDir
} = require('./fs.js');
const {
  xmlToJson,
  jsonToXML,
  addCustomAttrFromPlan,
  addCustomGroupFromPlan,
  addFeePlans,
  addAPIInfo,
  addOnShipingOption
} = require('./builder.js');

const { writeJobFile } = require('./onShipment.js');

const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
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
const INPUT_FILE = './site_preference_builder/reference.xml';
const OUTPUT_FILE = './metadata/site_template/meta/system-objecttype-extensions.xml';

/**
 * return the merchantId from feeplans
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

  const {
    url,
    apiKey
  } = process.env.ALMA_API_MODE === 'live' ? LIVE_MODE : TEST_MODE;
  const plans = await getFeePlansFromAPI(url, apiKey);
  const merchantId = getMerchantIdFromFeePlans(plans);

  let updatedSitePref = addCustomAttrFromPlan(sitePref, plans);
  updatedSitePref = addCustomGroupFromPlan(updatedSitePref, plans);
  updatedSitePref = addFeePlans(updatedSitePref, plans);
  updatedSitePref = addAPIInfo(updatedSitePref, url, apiKey, merchantId);
  updatedSitePref = addOnShipingOption(updatedSitePref, plans);

  writeFile(OUTPUT_FILE, jsonToXML(updatedSitePref));

  writeJobFile(plans, process.env.SFCC_SITE_NAME);
}

/* eslint-disable no-console */
main().then().catch((e) => console.log(e));
