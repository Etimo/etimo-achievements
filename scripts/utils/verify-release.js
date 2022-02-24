import getVersionInfo from './get-version-info.js';
import sleep from './sleep.js';

export default async function verifyRelease(expectedCommit, urls, timeout = 900) {
  let secondsWaited = 0;
  const commits = new Map();
  let remainingUrls = urls.filter((u) => commits.get(u) !== expectedCommit);

  while (secondsWaited < timeout) {
    for (const url of remainingUrls) {
      let message = `Fetching version from ${url}... `;
      const [commit] = await getVersionInfo(url);
      message += commit.substring(0, 7);
      if (commit === expectedCommit) {
        message += ' [OK]';
      }
      console.log(message);
      commits.set(url, commit);
    }

    remainingUrls = urls.filter((u) => commits.get(u) !== expectedCommit);
    if (!remainingUrls.length) {
      console.log('Deployment successful!');
      return;
    }

    secondsWaited += await sleepSeconds(2);
  }

  console.log('Deployment failed.');
}

async function sleepSeconds(seconds) {
  await sleep(seconds * 1000);
  return seconds;
}
