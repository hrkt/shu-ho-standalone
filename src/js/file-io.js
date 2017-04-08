import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'

// import constants from './app-constants'

exports.getFilenames = function (dir) {
  const list = fs.readdirSync(dir)
  return list.filter(
    function (value) {
      return fs.statSync(dir + '/' + value).isFile()
    }
  )
}

exports.getDataDir = function (app) {
  return app.getPath('userData')
}

exports.save = function (filename, txt) {
  console.log('>>save()')
  try {
    mkdirp(path.getDirName(path), function (err) {
      if (err) {
        throw err
      }
      fs.writeFileSync(path.join(this.getDataDir(), filename), txt, 'utf-8')
    })
    fs.writeFileSync(path.join(this.getDataDir(), filename), txt, 'utf-8')
  } catch (err) {
    throw err
  }
}

exports.saveWithBase64 = function (path, buf) {
  const b = new Buffer(buf)
  const b64Txt = b.toString('base64')
  var obj = { 'buf': b64Txt }
  try {
    fs.writeFileSync(path, JSON.stringify(obj), 'utf-8')
    console.log('Saved to' + path)
  } catch (err) {
    throw err
  }
}

exports.load = function (path) {
  const encoding = 'UTF-8'
  console.log('load:' + path)
  try {
    const jsonStr = fs.readFileSync(path, encoding)
    const json = JSON.parse(jsonStr.toString())
    const b = new Buffer(json['buf'], 'base64')
    return b.toString()
  } catch (err) {
    console.log(err)
    // return empty string when the buffer file is not found
    return ''
  }
}

exports.prepareDirIfNotExist = function (target) {
  mkdirp(target, function (err) {
    if (err) {
      throw err
    } else {
      // success
    }
  })
}
