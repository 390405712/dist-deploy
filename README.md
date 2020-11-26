# 生产包部署工具

1.在项目根目录下创建 deployment.js

2.写入配置信息

```js
module.exports = {
  projectName: '', // 项目名
  distPath: 'dist', // 生产包地址，默认：dist，不已 / 为开头
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
```

3.在 package.json 添加命令

```json
  "scripts": {
    "pkg:out": "npm run build:out && cd node_modules/dist-deploy && npm run out",
    "pkg:in": "npm run build:in && cd node_modules/dist-deploy && npm run in",
    "build:out": "vue-cli-service build --mode prodOut",
    "build:in": "vue-cli-service build --mode prodIn",
  }
```

4.运行

- npm run pkg:out // 打外网包并部署到服务器
- npm run pkg:in // 打内网包并上传至云盘
- npm run build:out // 打外网包
- npm run build:in // 打内网包
