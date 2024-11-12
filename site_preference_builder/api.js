import fetch from "node-fetch";

const API_VERSION = 'v1';

export async function getFeePlansFromAPI (baseurl, key) {
  const url = `${baseurl}/${API_VERSION}/me/fee-plans?kind=general&only=all&deferred=true`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Alma-Auth ${key}`
      }
    });
    return response.json();
  } catch (e) {
    /* eslint-disable no-console */
    console.error(`Could not reach API : "${url}", please check your .env`);
  }
  return {};
}
