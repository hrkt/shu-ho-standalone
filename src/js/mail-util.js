import * as dateUtil from './date-util.js'

exports.encodeBody = function (text) {
  return text.replace(/\n/g, ' %0D%0A ')
}

exports.getReportDateStr = function () {
  return dateUtil.calcStartDate().format('MM-DD')
}

exports.getSubmitAddress = function () {
  return 'someone@example.com'
}

exports.getSubject = function () {
  return 'Weekly Report ' + this.getReportDateStr()
}

exports.composeMailLink = function (content) {
  return 'mailto:' + this.getSubmitAddress() + '?subject=' + this.getSubject() + '&body=' + this.encodeBody(content)
}
