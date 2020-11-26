const inquirer = require('inquirer')
const exec = require('child_process').execSync

inquirer
  .prompt([
    {
      type: 'list',
      message: '请选执行的命令:',
      name: 'type',
      choices: [
        '1.部署外网生产包 (npm run out)',
        '2.上传内网生产包 (npm run in)',
      ],
    },
  ])
  .then((answers) => {
    const cmd = answers.type.match(/\(.*\)/)[0].replace(/[()]/g, '')
    exec(cmd, { stdio: 'inherit' })
  })
