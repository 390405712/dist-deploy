module.exports = {
  projectName: 'jiangbei-screen-web', // 项目名
  distPath: '/dist', // 生产包地址，默认：dist，不已 / 为开头
  // 外网部署配置
  outConfig: {
    host: '111.229.161.253', // 主机名
    port: 22, // sftp端口，默认：22
    username: 'root', // 账号，默认：root
    password: 'bm20@Sd%f9W3', // 密码
    remotePath: '/data/jar/jiangbei/dist/', // 部署地址
  },
  // 内网上传配置
  inConfig: {
    username: 'beiming', // 云盘账号
    password: 'bmrj%40123', // 云盘密码
  },
}
