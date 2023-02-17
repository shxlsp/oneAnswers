#!/usr/bin/env node --experimental-top-level-await

const {
    argv
} = require('process');
const {
    runCli,
    runPlop,
    createConfigName,
    addWorkspace
} = require('../src/tools/index');
const paramArr = argv.slice(2);
console.log(paramArr);
switch (paramArr[0]) {
    case 'init':
        argv.splice(2, 1);
        // 返回执行命令的目录
        // process.cwd()
        console.log('新建工程')
        runPlop(createConfigName.main);
        break;
    case 'new':
        argv.splice(2, 1);
        // 返回执行命令的目录
        // process.cwd()
        console.log('新建子项目')
        runPlop(createConfigName.inner);
        break;
    case 'dev':
        runCli();
        break;
    case 'workspace':
        addWorkspace(paramArr[1])
        break;
    case 'build':

        break;
    default:
        console.log('请输入正确的指令，例create，dev，build')
        break;
}