'use strict';

const fs = require('fs');

exports.readFile = function (filename) {
  try {
    return fs.readFileSync(filename, 'utf8');
  } catch (err) {
    /* eslint-disable no-console */
    console.error(err);
  }
  return '';
};

exports.writeFile = function (filename, fileContent) {
  try {
    fs.writeFileSync(filename, fileContent, { flag: 'w+' });
  } catch (err) {
    /* eslint-disable no-console */
    console.error(err);
  }
};

/**
 * create a directory and all its parents if needed
 * @param {string} dir the directory
 */
exports.createDir = function (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Creating directory : ${dir}`);
    return;
  }
  console.log(`Directory ${dir} already exist, skipping`);
};
