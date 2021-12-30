const fs = require('fs');
const { getBuildDateFile } = require('./path-helper');

const noBuildDate = new Date(1970, 0, 1);

const getBuildDate = (package) => {
  const buildDateFile = getBuildDateFile(package);
  if (fs.existsSync(buildDateFile)) {
    const content = fs.readFileSync(buildDateFile, 'utf8');
    const buildDate = new Date(JSON.parse(content));
    return buildDate ?? noBuildDate;
  }

  return noBuildDate;
};

module.exports = {
  getBuildDate,
};
