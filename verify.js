const { err, deployment } = require('./props')

const config = {
  projectName: 'string',
  distPath: 'string',
  outConfig: 'object',
  inConfig: 'object',
}
for (const key in config) {
  if (!deployment[key]) return err('错误', `未配置deployment.js中的${key}`)
  if (typeof deployment[key] !== config[key])
    return err('错误', `deployment.js中的${key}类型有误`)
  if (['outConfig', 'inConfig'].includes(key)) {
    const obj =
      key === 'outConfig'
        ? {
            host: 'string',
            port: 'number',
            username: 'string',
            password: 'string',
            remotePath: 'string',
          }
        : {
            username: 'string',
            password: 'string',
          }
    for (const child in obj) {
      if (!deployment[key][child])
        return err('错误', `未配置deployment.js中的${key}.${child}`)
      if (typeof deployment[key][child] !== obj[child])
        return err('错误', `deployment.js中的${key}.${child}类型有误`)
    }
  }
}
require('./compression.js')()
