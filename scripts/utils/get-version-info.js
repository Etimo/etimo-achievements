import fetch from 'node-fetch';

export default async function getVersionInfo(url) {
  try {
    const response = await fetch(`${url}/version`);
    const body = await response.json();
    const commit = body.commit;
    const date = body.date;
    return [commit, date];
  } catch (err) {
    console.log(`Something went wrong: ${err.message}`);
  }
  return [null, null];
}
