const compressing = require('compressing')
const { success, info, err, rootPath, deployment } = require('./props')
const { projectName, distPath } = deployment

function getArgs() {
  const params = {}
  process.argv.slice(2, process.argv.length).forEach((arg) => {
    if (arg.slice(0, 2) === '--') {
      const longArg = arg.split('=')
      ;[, params[longArg[0].slice(2, longArg[0].length)]] = longArg
    } else if (arg[0] === '-') {
      const flag = arg.slice(1, arg.length)
      params.serverType = flag
    }
  })
  return params
}

module.exports = () => {
  require('./optimize')()

  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const d = now.getDate()
  const h = now.getHours()
  const min = now.getMinutes()
  const s = now.getSeconds()
  const args = getArgs()
  const outputDir = projectName
  const zipName = (() =>
    `${outputDir}${args.prefix} ${y}-${m + 1 < 10 ? `0${m + 1}` : m + 1}-${
      d < 10 ? `0${d}` : d
    } ${h < 10 ? `0${h}` : h}时${min < 10 ? `0${min}` : min}分${
      s < 10 ? `0${s}` : s
    }秒.zip`)()

  if (args.prefix === '内网') {
    console.clear()
    const path = rootPath + zipName
    info('正在压缩', '请稍后')
    compressing.zip
      .compressDir(rootPath + distPath, path)
      .then(() => {
        success('打包成功', `已经压缩到文件：${path}`)
        require('./uploadCloud')(zipName, path)
      })
      .catch((e) => {
        err('打包失败', e)
      })
  } else {
    require('./upload')()
  }
}
