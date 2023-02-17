const {
  getPackageJSON,
  setPackageJSON,
} = require('./packageJSON');

const addWorkspace = (name) => {
  if (!name) {
    throw new Error('需要填写workspace name')
  }
  const pkg = getPackageJSON();
  const {
    workspaces
  } = pkg;
  workspaces.forEach(item => {
    if (item.includes(name)) {
      throw new Error(`已经有${name}工作区`)
    }
  });
  workspaces.push(name)
  setPackageJSON(pkg)
}

module.exports = {
  addWorkspace
}