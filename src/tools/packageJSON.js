const fs = require('fs');
const path = require('path');

const getPackageJSONPath = (pathName) => {
  return path.join(pathName || process.cwd(), 'package.json')
}
const getPackageJSON = (pathName) => {
  try {
      const pkg = fs.readFileSync( getPackageJSONPath(pathName),'utf-8')
      return JSON.parse(pkg)
  } catch (error) {
      throw error;
  }
}

const setPackageJSON = (pkg, pathName) => {
  fs.writeFileSync(getPackageJSONPath(pathName), typeof pkg === 'string'? pkg: JSON.stringify(pkg), 'utf-8')
}

module.exports = {
    getPackageJSON,
    setPackageJSON,
    getPackageJSONPath,
}