import * as fs from 'fs';
import { getBuildDateFile } from './path-helper.js';

const noBuildDate = new Date(1970, 0, 1);

export default function getBuildDate(packageName) {
  const buildDateFile = getBuildDateFile(packageName);
  if (fs.existsSync(buildDateFile)) {
    const content = fs.readFileSync(buildDateFile, 'utf8');
    const buildDate = new Date(JSON.parse(content));
    return buildDate ?? noBuildDate;
  }

  return noBuildDate;
};
