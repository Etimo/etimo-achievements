const fs = require('fs');

const getModifiedDate = (path) => {
  stat = fs.statSync(path);
  return new Date(stat.mtime);
}

module.exports = {
  getModifiedDate,
};
