import * as fs from 'fs';
import { getBuildDateFile } from './path-helper.js';

const setBuildDate = (package, date) => {
  const buildDateFile = getBuildDateFile(package);
  fs.writeFileSync(buildDateFile, JSON.stringify(date ?? new Date()));
};

module.exports = {
  setBuildDate,
};
