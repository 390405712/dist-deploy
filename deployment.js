module.exports = {
  projectName: '', // 项目名
  distPath: '/dist', // 生产包地址，默认：dist，不已 / 为开头
  // 外网部署配置
  outConfig: {
    host: '', // 主机名
    port: 22, // sftp端口，默认：22
    username: 'root', // 账号，默认：root
    password: '', // 密码
    remotePath: '', // 部署地址
  },
  // 内网上传配置
  inConfig: {
    username: '', // 云盘账号
    password: '', // 云盘密码
  },
}
