const path = require('path')
const fs = require('fs')
const { success, info, err } = require('./consoleTemplate')
const rootPath = path.join(__dirname).split('node_modules')[0]
const deployment = require(rootPath + 'deployment.js')

module.exports = {
  success,
  info,
  err,
  rootPath,
  deployment,
  path,
  fs,
}
