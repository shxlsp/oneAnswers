const path = require('path');
const {
    confirmSystem: {
        isWindows
    },
    store,
    getPackageJSON
} = require('../tools/index');
let pubPath = process.cwd();
const validateEmpty = (value) => {
    return value.length > 0;
}
const commandList = ['yarn', 'cnpm', 'npm'];
const tempMainPath = 'template/innerProject/'
const joinTempPath = (name) => {
    return `${tempMainPath}${name}.hbs`
}


const prompts = [{
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
    type: 'confirm',
    name: 'hasLess',
    default: true,
    message: '是否创建less文件?'
},
]

module.exports = function (plop) {
    plop.setActionType('install', function (answers, config, plop) {
        // 返回执行命令的目录
        // process.cwd()
        function install(command = commandList[0]) {
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
                console.log(`进入目录后，执行 yarn dev，启动项目`);
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
        }
        install()
    });
    
    const storeData = store.getData();
    let workspaces;
    try {
        workspaces = getPackageJSON().workspaces;
    } catch (error) {
        if(!storeData.name || !storeData.workspaces){
            throw error;
        }
    } 

    if(workspaces?.length > 1){
        prompts.unshift({
            type: "list",
            name: "workspacesName",
            message: '选择你的工作区',
            choices: workspaces.map(function (name) {
              return {
                name,
                // TODO 后期可能需要额外处理
                value: name.split('/')[0],
              };
            }),
          })
    }
    plop.setGenerator('innerProject', {
        description: '新建子应用',
        prompts,
        actions: ({
            hasLess,
            workspacesName
        }) => {
            // 如果从main中联动创建的，就会有store
            const {
                name,
                workspaces
            } = storeData || {};
            if (workspaces && name) {
                pubPath = path.join(pubPath, name, workspaces)
            } else {
                // 如果有输入workspaces
                pubPath = path.join(pubPath, workspacesName || workspaces?.[0])
            }
            const actions = [];
            // 添加package.json
            actions.push({
                type: 'add',
                path: `${pubPath}/{{name}}/package.json`,
                templateFile: joinTempPath('package.json')
            })

            // gitignore
            actions.push({
                type: 'add',
                path: `${pubPath}/{{name}}/.gitignore`,
                templateFile: joinTempPath('.gitignore')
            })

            // tsconfig.json
            actions.push({
                type: 'add',
                path: `${pubPath}/{{name}}/tsconfig.json`,
                templateFile: joinTempPath('tsconfig.json')
            })
            // webpack.config
            actions.push({
                type: 'add',
                path: `${pubPath}/{{name}}/webpack.config.js`,
                templateFile: joinTempPath('webpack.config.js')
            })

            // index.html
            actions.push({
                type: 'add',
                path: `${pubPath}/{{name}}/src/index.html`,
                templateFile: joinTempPath('src/index.html')
            })

            // index.tsx
            actions.push({
                type: 'add',
                path: `${pubPath}/{{name}}/src/index.tsx`,
                templateFile: joinTempPath('src/index.tsx')
            })

            if (hasLess) {
                // index.less
                actions.push({
                    type: 'add',
                    path: `${pubPath}/{{name}}/src/index.less`,
                    templateFile: joinTempPath('src/index.less')
                })
            }

            actions.push({
                type: 'install',
            })

            return actions;
        }
    });

    // console.log(plop, res)
};