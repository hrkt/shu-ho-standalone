const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB

export function init () {
  var idbReq = indexedDB.open('shu-ho', 1)

  idbReq.onupgradeneeded = function (event) {
    var db = event.target.result
    var historyStore = db.createObjectStore('history', { keyPath: 'idStr' })

    historyStore.add({ idStr: '1', text: 'test' })
  }
}
