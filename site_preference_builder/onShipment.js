const { readFileSync, writeFileSync } = require('fs');
const { xmlToJson, jsonToXML } = require('./builder.js');

const INPUT_JOB_SHIPMENT_FILE = './site_preference_builder/ref/jobShipment.xml';
const INPUT_JOBS_FILE = './site_preference_builder/ref/jobs.xml';
const OUTPUT_JOB_SHIPMENT_FILE = './metadata/site_template/jobs.xml';

const merchantHasOnShipment = (plans) => {
  return plans.some((plan) => plan.deferred_trigger_limit_days !== null);
};
exports.merchantHasOnShipment = merchantHasOnShipment;

exports.writeJobShipmentFile = async (plans, siteName) => {
  // if (!merchantHasOnShipment(plans)) {
  //   return;
  // }
  const jobShipment = readFileSync(INPUT_JOB_SHIPMENT_FILE).toString();
  const jobs = readFileSync(INPUT_JOBS_FILE);

  const jobsContent = await xmlToJson(jobs);

  const onShipmentJob = await xmlToJson(jobShipment.replace('[[SITENAME]]', siteName));

  const allJobs = {
    job: [
      onShipmentJob.job,
      onShipmentJob.job // add the second job here
    ]
  };

  jobsContent.jobs = Object.assign(jobsContent.jobs, allJobs);
  writeFileSync(OUTPUT_JOB_SHIPMENT_FILE, jsonToXML(jobsContent));
};

