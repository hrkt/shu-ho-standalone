import fs from 'fs'

exports.getFilenames = function (dir) {
  const list = fs.readdirSync(dir)
  return list.filter(
    function (value) {
      return fs.statSync(dir + '/' + value).isFile()
    }
  )
}
