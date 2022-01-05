import * as fs from 'fs';
import { getBuildDateFile } from './path-helper.js';

export default function setBuildDate(date) {
  const buildDateFile = getBuildDateFile();
  fs.writeFileSync(buildDateFile, JSON.stringify(date ?? new Date()));
};
