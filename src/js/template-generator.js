import moment from 'moment'
import mustache from 'mustache'

import * as dateUtil from './date-util.js'

moment.locale('ja', {
  weekdays: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],
})

function week (startDate) {
  var template = ''
  template += '|Date       |Work|' + '\n'
  template += '|:---------|:--|' + '\n'
  const defaultWork = '作業日'
  for (var i of [1, 2, 3, 4, 5, 6, 7]) {
    template += '|{{date' + i + '}}|{{work' + i + '}}|' + '\n'
  }
  var values = {}
  var d = startDate
  for (var i of [1, 2, 3, 4, 5, 6, 7]) {
    values['date' + i] = d.format('MM-DD(ddd)')
    if (dateUtil.isOffDay(d)) {
      values['work' + i] = '休み'
    } else {
      values['work' + i] = defaultWork
    }
    d.add(1, 'day')
  }
  return mustache.render(template, values)
}

exports.generateTemplate = function () {
  var buf = ''

  const title1 = '## Record of the week\n\n'
  buf += title1
  buf += week(dateUtil.calcStartDate().subtract(7, 'day'))

  const title2 = '\n\n## Plan for the next week\n\n'
  buf += title2
  buf += week(dateUtil.calcStartDate())

  const title3 = '\n\n## Topics\n\n'
  buf += title3

  return buf
}
