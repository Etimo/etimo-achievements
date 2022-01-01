import * as fs from 'fs';

export default function getModifiedDate(path) {
  const stat = fs.statSync(path);
  return new Date(stat.mtime);
}
