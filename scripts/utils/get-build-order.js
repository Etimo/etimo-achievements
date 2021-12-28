const fs = require('fs');
const { getPackageDirectories } = require('./path-helper');

let buildOrder;

const getBuildOrder = () => {
  buildOrder = [];
  const packageDirs = getPackageDirectories();
  for (const packageDir of packageDirs) {
    const packages = fs
      .readdirSync(packageDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);

    for (const package of packages) {
      buildDependencyTree(package, packageDir);
    }
  }
  return buildOrder;
};

function buildDependencyTree(package, packageDir) {
  if (buildOrder.filter((o) => o === package).length > 0) {
    return;
  }

  if (fs.existsSync(`${packageDir}/${package}/package.json`)) {
    const packageJson = require(`${packageDir}/${package}/package.json`);
    const dependencies = packageJson.dependencies ?? {};
    const etimoDependencies = Object.keys(dependencies).filter((d) => d.startsWith('@etimo-achievements')) || {};
    for (const dependency of etimoDependencies) {
      const dependencyName = dependency.replace('@etimo-achievements/', '');
      buildDependencyTree(dependencyName, packageDir);
    }
    buildOrder.push(package);
  }
}

module.exports = {
  getBuildOrder,
};
