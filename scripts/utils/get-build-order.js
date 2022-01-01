import * as fs from 'fs';
import { getPackageDirectories } from './path-helper.js';

let buildOrder;

export default function getBuildOrder() {
  buildOrder = [];
  const packageDirs = getPackageDirectories();
  for (const packageDir of packageDirs) {
    const packages = fs
      .readdirSync(packageDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);

    for (const pkg of packages) {
      buildDependencyTree(pkg, packageDir);
    }
  }
  return buildOrder;
};

function buildDependencyTree(pkg, packageDir) {
  if (buildOrder.filter((o) => o === pkg).length > 0) {
    return;
  }

  if (fs.existsSync(`${packageDir}/${pkg}/package.json`)) {
    const filePath = `${packageDir}/${pkg}/package.json`;
    const packageJson = JSON.parse(fs.readFileSync(filePath));
    const dependencies = packageJson.dependencies ?? {};
    const etimoDependencies = Object.keys(dependencies).filter((d) => d.startsWith('@etimo-achievements')) || {};
    for (const dependency of etimoDependencies) {
      const dependencyName = dependency.replace('@etimo-achievements/', '');
      buildDependencyTree(dependencyName, packageDir);
    }
    buildOrder.push(pkg);
  }
}
