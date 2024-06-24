#!/usr/bin/env bash

###############################################################################
# README
###############################################################################
# Description :
#     Script to be used in the release process to update the version
#     number in the files
# Usage :
#     ./scripts/update-files-with-release-version.sh <version>
#     (Example: ./scripts/update-files-with-release-version.sh 1.2.3)
###############################################################################

if [ $# -lt 1 ]; then
  echo 1>&2 "$0: Missing argument. Please specify a version number."
  exit 2
fi

####################
# Sanitize version (remove the 'v' prefix if present)
####################
version=`echo ${1#v}`


####################
# Update file cartridges/int_alma/package.json
####################
filepath="cartridges/int_alma/package.json"
# Update version field
sed -i -E "s/\"version\": \"[0-9\.]+\",/\"version\": \"$version\",/g" $filepath

####################
# Update file package.json
####################
filepath="package.json"
# Update version field
sed -i -E "s/\"version\": \"[0-9\.]+\",/\"version\": \"$version\",/g" $filepath

####################
# Update file test/mocks/helpers/almaPaymentHelpers.js
####################
filepath="test/mocks/helpers/almaPaymentHelpers.js"
# Update alma_plugin_version field
sed -i -E "s/alma_plugin_version: '[0-9\.]+'/alma_plugin_version: '$version'/g" $filepath
