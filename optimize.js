const recursive = require('recursive-readdir')
const { success, info, err, rootPath, deployment, fs } = require('./props')
const { distPath } = deployment
const localPath = rootPath + distPath

module.exports = () => {
  try {
    recursive(localPath, [], async (err, files) => {
      new Promise(async (c, e) => {
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          if (file.includes('.gz') || file.includes('.svg')) {
            fs.writeFile(
              file.replace('.gz', ''),
              '1',
              'utf8',
              function (error) {
                info('重写文件：', `${file.replace('.gz', '')}`)
              }
            )
          }
        }
        success('success', '---------------- 生产包优化完成 --------------')
      })
    })
  } catch (e) {
    err('生产包优化失败', e)
  }
}
