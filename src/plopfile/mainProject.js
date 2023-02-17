const path = require('path');
const runPlop = require('../tools/runPlop.js');
const {
    confirmSystem: {
        isWindows
    },
    store,
} = require('../tools/index');
const pubPath = process.cwd();
const validateEmpty = (value) => {
    return value.length > 0;
}
const commandList = ['yarn', 'cnpm', 'npm'];
const tempMainPath = 'template/mainProject/'
const joinTempPath = (name) => {
    return `${tempMainPath}${name}.hbs`
}
module.exports = function (plop) {
    plop.setActionType('install', async function (answers, config, plop) {
        // 返回执行命令的目录
        // process.cwd()
        function install(command = commandList[0]) {
            return new Promise((resolve) => {
                const child_process = require('child_process')
                const args = ['install']
                const cwd = path.join(process.cwd(), answers.name)
                const getRelCommand = (command) => {
                    return `${command}${isWindows()? '.cmd':''}`
                }
                const task = child_process.spawn(getRelCommand(command), args, {
                    cwd
                });
                task.on('close', () => {
                    console.log('依赖安装完成');
                    console.log(`执行: cd ${answers.name}，进入目录`);
                    resolve();
                    // console.log(`进入目录后，执行 yarn dev，启动项目`);
                });
                task.stdout.on('data', data => {
                    console.log(`${data}`);
                });
                task.on('error', (data) => {
                    console.log('' + data)
                    console.log(`未找到command: ${command}`)
                    const nextIndex = commandList.findIndex(item => item === command) + 1;
                    if (!commandList[nextIndex]) {
                        // console.log(`依赖下载失败，执行: cd ${answers.name}，进入目录后手动安装依赖`);
                        throw `依赖下载失败，执行: cd ${answers.name}，进入目录后手动安装依赖`;
                    }
                    install(commandList[nextIndex]);
                });
            })
        }
        await install()
    });
    plop.setActionType('done', function (answers, config, plop) {
        setTimeout(() => {
            console.log('新建子项目');
        }, 0);
        runPlop('innerProject');
    });

    plop.setGenerator('mainProject', {
        description: '新建项目',
        prompts: [{
                type: 'input',
                name: 'name',
                message: '请输入项目名称',
                validate: validateEmpty
            },
            {
                type: 'input',
                name: 'description',
                default: '',
                message: '请输入组件描述（可选）'
            },
            {
                type: 'input',
                name: 'version',
                default: '1.0.0',
                message: '请输入组件版本号'
            },
            {
                type: 'input',
                name: 'author',
                message: '请输入开发者姓名',
            },
            {
                type: 'input',
                name: 'workspaces',
                default: "packages",
                message: '请输入工作区名称',
            },
        ],
        actions: ({
            workspaces,
            name,
        }) => {
            store.setData({
                workspaces,
                name
            })
            const actions = [];
            // 添加package.json
            actions.push({
                type: 'add',
                path: `${pubPath}/{{name}}/package.json`,
                templateFile: joinTempPath('package.json')
            })

            actions.push({
                type: 'install',
            })
            actions.push({
                type: 'done',
            })
            return actions;
        }
    });


    // console.log(plop, res)
};