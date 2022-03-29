/* eslint-disable no-console */
const gulp = require('gulp');
const zip = require('gulp-zip');
const del = require('del');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

const { createDir } = require('./fs');

/**
 * Create payment processor and payment methods files
 */
function createPaymentRefFiles() {
  const siteDir = `./metadata/site_template/sites/${process.env.SFCC_SITE_NAME}/`;
  createDir(siteDir);

  console.log('Copying ref. files');
  const paymentRefFiles = './site_preference_builder/payment/*.xml';
  gulp.src(paymentRefFiles)
   .pipe(gulp.dest(siteDir))
  ;
}

/**
 * Create services file
 */
function copyServiceFile() {
  console.log('Copying service file');
  gulp.src('./site_preference_builder/services.xml')
   .pipe(gulp.dest('./metadata/site_template/'))
  ;
}

/**
 * Create Archive
 */
function createZipFile() {
  console.log('Creating archive');
  del(['./site_template.zip']);
  gulp.src('./metadata/**')
    .pipe(zip('site_template.zip'))
    .pipe(gulp.dest('./'));
}

/**
 * entry point
 * @returns {number} 0|1 0 is success, 1 is an error
 */
function main() {
  if (!process.env.SFCC_SITE_NAME) {
    console.error('Undefined env variable SFCC_SITE_NAME.' +
      'Please go to your .env file to configure it');
    return 1;
  }
  console.log(`Your SFCC site name : ${process.env.SFCC_SITE_NAME}`);

  createPaymentRefFiles();
  copyServiceFile();
  createZipFile();

  console.log('Done');

  return 0;
}

main();
