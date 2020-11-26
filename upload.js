const Client = require('ssh2-sftp-client')
const sftp = new Client()
const recursive = require('recursive-readdir')
const { success, info, err, rootPath, deployment, path } = require('./props')
const { outConfig, distPath } = deployment

const option = {
  host: outConfig.host,
  port: outConfig.port,
  username: outConfig.username,
  password: outConfig.password,
}
const remotePath = outConfig.remotePath
const localPath = rootPath + distPath

module.exports = () => {
  try {
    sftp.connect(option).then((res) => {
      recursive(localPath, [], async (err, files) => {
        new Promise(async (c, e) => {
          const list = await sftp.list(remotePath)
          for (const i in list) {
            const data = list[i]
            if (data.type === '-') {
              info('移除文件：', remotePath + data.name)
              await sftp.delete(remotePath + data.name)
            } else if (data.type === 'd') {
              info('移除文件夹：', remotePath + data.name)
              await sftp.rmdir(remotePath + data.name, true)
            }
          }
          info('移除完毕', '---------------- 移除完毕 --------------')
          for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const mac = file.split('/')
            const windows = file.split('\\')
            let s = []
            let spliceIndex = 0
            s = mac.length > windows.length ? mac : windows
            s.forEach((item, index) => {
              if (item === 'dist') spliceIndex = index + 1
            })
            s.splice(0, spliceIndex)
            let shortPath = ''
            for (let idx = 0; idx < s.length; idx++) {
              shortPath += `${s[idx]}${idx === s.length - 1 ? '' : '/'}`
            }
            let serverP = ''
            s.forEach((sp, idx) => {
              if (idx !== s.length - 1) serverP += `${sp}/`
            })
            const serverPath = remotePath + serverP
            try {
              await sftp.stat(serverPath)
            } catch (e) {
              await sftp.mkdir(serverPath, true)
            }
            info(
              '更新：',
              `${path.join(path.resolve(file))} 至 ${remotePath}${shortPath}`
            )
            sftp.put(path.join(path.resolve(file)), remotePath + shortPath)
          }
          success('部署完成', '---------------- 已部署完成 --------------')
        })
      })
    })
  } catch (e) {
    err('部署失败', e)
  }
}
