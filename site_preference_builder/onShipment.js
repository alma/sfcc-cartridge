const { readFileSync, writeFileSync } = require('fs');

const INPUT_JOB_FILE = './site_preference_builder/ref/jobs.xml';
const OUTPUT_JOB_FILE = './metadata/site_template/jobs.xml';

const merchantHasOnShipment = (plans) => {
  return plans.some((plan) => plan.deferred_trigger_limit_days !== null);
};
exports.merchantHasOnShipment = merchantHasOnShipment;

exports.writeJobFile = (plans, siteName) => {
  if (!merchantHasOnShipment(plans)) {
    return;
  }
  const content = readFileSync(INPUT_JOB_FILE).toString();
  writeFileSync(OUTPUT_JOB_FILE, content.replace('[[SITENAME]]', siteName));
};

