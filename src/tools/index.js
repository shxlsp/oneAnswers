
const terminalIO = require('./terminalIO');
const runCli = require('./runCli');
const runPlop = require('./runPlop.js');
const confirmSystem = require('./confirmSystem');
const workspace = require('./workspace');
const packageJSON = require('./packageJSON');


const createConfigName = {
    main: 'mainProject',
    inner: 'innerProject'
}

class Store {
    constructor(initData = {}) {
        this.data = initData;
    }

    setData(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }
}

module.exports = {
    terminalIO,
    runCli,
    runPlop,
    confirmSystem,
    createConfigName,
    store: new Store({}),
    ...packageJSON,
    ...workspace,
}