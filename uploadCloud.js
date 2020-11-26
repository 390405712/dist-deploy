const request = require('request')
const readline = require('readline')
const {
  success,
  info,
  err,
  rootPath,
  deployment,
  path,
  fs,
} = require('./props')
const { inConfig } = deployment
const resolve = () => path.join(rootPath, '../')
const sessionTxt = resolve() + 'session.txt'
const codePng = resolve() + '验证码.png'

let fileName, filePath, cookie

module.exports = (name, path) => {
  fileName = name
  filePath = path
  getCookie()
}

function unlink() {
  info('信息', '开始执行新的上传流程')
  fs.unlink(codePng, function () {})
  fs.unlink(sessionTxt, function () {})
  getCookie()
}

function getCookie() {
  fs.readFile(sessionTxt, 'utf-8', (error, res) => {
    if (error) {
      getImg()
    } else {
      cookie = res
      upload()
    }
  })
}

function getImg(once = true) {
  request(
    {
      url: 'https://fwyp.jsfy.gov.cn/api/captcha/generateBase64',
      method: 'GET',
    },
    (error, res, body) => {
      const dataBuffer = new Buffer(JSON.parse(body).base64Str, 'base64')
      cookie =
        res.caseless.dict['set-cookie'][0].split(';')[0] +
        '; ' +
        res.caseless.dict['set-cookie'][1].split(';')[0]
      fs.writeFile(sessionTxt, cookie, 'utf8', () => {})
      fs.writeFile(codePng, dataBuffer, () => {
        success('成功', '验证码图片已生成，打开以下路径查看验证码')
        console.log(codePng)
        info('提示', '输入验证码：')
        once && writeCode()
      })
    }
  )
}

function writeCode() {
  const rl = readline.createInterface(process.stdin, process.stdout)
  rl.on('line', (code) => {
    request(
      {
        url: 'https://fwyp.jsfy.gov.cn/spacex/captcha/validate?code=' + code,
        method: 'POST',
        headers: {
          cookie,
        },
      },
      (error, res, body) => {
        if (body === 'true') {
          info('提示', '模拟登录中...')
          login(code)
        } else {
          err('错误', '验证码不一致，加载新的验证码')
          getImg(false)
        }
      }
    )
  })
}

function login(code) {
  request(
    {
      url: 'https://fwyp.jsfy.gov.cn/spacex/login?ajax=true',
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.9',
        'content-type': 'application/x-www-form-urlencoded',
        'cs-networkenv': 'public',
        'cs-platform': 'web',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        tenant: 'jsgy',
        'x-requested-with': 'XMLHttpRequest',
        cookie,
      },
      referrer: 'https://fwyp.jsfy.gov.cn/',
      referrerPolicy: 'strict-origin-when-cross-origin',
      method: 'POST',
      mode: 'cors',
      body: `username=${inConfig.username}&password=${inConfig.password}&code=${code}&rememberMe=off`,
    },
    (error, res, body) => {
      success('成功', '登录成功')
      upload()
    }
  )
}

function upload() {
  fs.stat(filePath, (error, file) => {
    const id = new Date().getTime()
    info('提示', '开始上传文件')
    const timer = setInterval(() => {
      info('提示', '上传中......')
    }, 300)
    request(
      {
        url: 'https://fwyp.jsfy.gov.cn/api/v2/file/inner/upload',
        method: 'POST',
        formData: {
          dirId: 'rootpath',
          id,
          name: fileName,
          type: 'application/zip',
          lastModifiedDate: file.atime.toLocaleString(),
          size: file.size,
          guid: id,
          uploadType: '',
          file: fs.createReadStream(filePath),
        },
        headers: {
          cookie,
        },
      },
      function optionalCallback(error, res, body) {
        clearInterval(timer)
        if (error) return err('上传失败：', error)
        if (body.includes('401')) {
          err('错误', 'session过期')
          return unlink()
        }
        success('成功', '上传完毕！！！')
        fs.unlink(filePath, function () {
          success('成功', '本地压缩包已删除')
        })
        const info = JSON.parse(body)
        console.table({
          id: { 值: info.fileId },
          名称: { 值: info.fileName },
          大小: { 值: (file.size / 1024).toFixed(2) + 'kb' },
        })
      }
    )
  })
}
