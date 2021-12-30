const fs = require('fs');
const { getBuildDateFile } = require('./path-helper');

const setBuildDate = (package, date) => {
  const buildDateFile = getBuildDateFile(package);
  fs.writeFileSync(buildDateFile, JSON.stringify(date ?? new Date()));
};

module.exports = {
  setBuildDate,
};
