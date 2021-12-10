const fs = require('fs');
const { exec } = require('child_process');

const rootPackageJson = require(__dirname + '/../package.json');
const packageDirs = rootPackageJson.workspaces.map((w) => __dirname + '/../' + w.replace('/*', '')) ?? [];

const buildOrder = [];
for (const packageDir of packageDirs) {
  const packages = fs
    .readdirSync(packageDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  for (const package of packages) {
    getBuildOrder(package, packageDir);
  }

  console.log(buildOrder.join(' '));
}

function getBuildOrder(package, packageDir) {
  if (buildOrder.filter((o) => o === package).length > 0) {
    return;
  }

  if (fs.existsSync(`${packageDir}/${package}/package.json`)) {
    const packageJson = require(`${packageDir}/${package}/package.json`);
    const dependencies = packageJson.dependencies ?? {};
    const etimoDependencies = Object.keys(dependencies).filter((d) => d.startsWith('@etimo-achievements')) || {};
    for (const dependency of etimoDependencies) {
      const dependencyName = dependency.replace('@etimo-achievements/', '');
      getBuildOrder(dependencyName, packageDir);
    }
    console.log('npm run build:', package);
    exec('npm run build', { cwd: `${packageDir}/${package}` }, (error, stdout, stderr) => {
      console.log(stdout);
    });
    buildOrder.push(package);
  }
}
