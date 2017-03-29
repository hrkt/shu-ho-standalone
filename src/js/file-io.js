import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'

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
      fs.writeFileSync(this.getDataDir() + '/' + filename, txt, 'utf-8')
    })
    fs.writeFileSync(this.getDataDir() + '/' + filename, txt, 'utf-8')
  } catch (err) {
    throw err
  }
}

exports.saveWithBases64 = function (path, buf) {
  const b = new Buffer(buf)
  const b64Txt = b.toString('base64')
  const txt = '{\'buf\': \'' + b64Txt + '\'}'
  try {
    fs.writeFileSync(path, txt, 'utf-8')
    console.log('Saved current buffer.')
  } catch (err) {
    throw err
  }
}

exports.load = function (path, encoding) {
  try {
    const jsonStr = fs.readFileSync(path, encoding)
    const json = JSON.parse(jsonStr)
    const b64Txt = json['buf']
    const b = new Buffer(b64Txt, 'base64')
    console.log('Load last buffer.')
    return b.toString()
  } catch (err) {
    console.log(err)
    // return empty string when the buffer file is not found
    return ''
  }
}
