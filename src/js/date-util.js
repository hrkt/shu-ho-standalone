import moment from 'moment'

export function isOffDay (d) {
  return d.day() === 0 || d.day() === 6
}

export function startDayOfWeekFor (d) {
  return d.subtract(d.day() - 1, 'day')
}

export function calcStartDate () {
  const s = moment(new Date())
  return startDayOfWeekFor(s)
}

export function getTimestamp() {
  const d = moment(new Date())
  return d.format('YYYYMMDD_HHmmss')
}