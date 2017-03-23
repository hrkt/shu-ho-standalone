'use strict'

import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import electron from 'electron'
const app=electron.remote.app
import mustache from 'mustache'
import moment from 'moment'
import ace from 'brace'
import bootstrap from 'bootstrap'
import marked from 'marked'
import Vue from 'vue'

import EditorComponent from './Editor.vue'
import PreviewerComponent from './Previewer.vue'

moment.locale('ja', {
  weekdays: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],
})

function calcStartDate() {
  const s = moment(new Date())
  return startDayOfWeekFor(s)
}

function isOffDay(d) {
  return d.day() == 0 || d.day() == 6
}

function startDayOfWeekFor(d) {
  return d.subtract(d.day() - 1, 'day')
}

function week(startDate) {
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
    if (isOffDay(d)) {
      values['work' + i] = '休み'
    } else {
      values['work' + i] = defaultWork
    }
    d.add(1, 'day')
  }
  return mustache.render(template, values)
}

function defaultTemplate() {
  console.log('>>defaultTemplate()')

  var buf = ''

  const title1 = '## Record of the week\n\n'
  buf += title1
  buf += week(calcStartDate().subtract(7, 'day'))

  const title2 = '\n\n## Plan for the next week\n\n'
  buf += title2
  buf += week(calcStartDate())

  const title3 = '\n\n## Topics\n\n'
  buf += title3

  indexPage.changeContentA(buf)
}

function getReportDateStr() {
  return calcStartDate().format('MM-DD')
}

function getSubmitAddress() {
  return 'someone@example.com'
}

function getSubject() {
  return 'Weekly Report ' + getReportDateStr()
}

function encodeBody(text) {
  return text.replace(/\n/g, ' %0D%0A ')
}

function composeMailLink(content) {
  return 'mailto:' + getSubmitAddress() + '?subject=' + getSubject() + '&body=' + encodeBody(content)
}

function sendMail(url) {
  console.log('>>defaultTemplate()')
  const link = document.querySelector('.send-mail-link')
  link.click()

  // var elem = this.$refs.sendMailLink
  // var prevented = elem.dispatchEvent(new Event('click'))
  // if (prevented) { } // A handler used event.preventDefault()  
}

function loadLast(buf) {
  console.log('>>loadLastBuffer()')
  try {
    const jsonStr = fs.readFileSync(app.getPath('userData') + '/currentBuffer.json', 'utf-8')
    const json = JSON.parse(jsonStr)
    const b64Txt = json['buf']
    const b = new Buffer(b64Txt, 'base64')
    console.log('Load last buffer.')
    return b.toString()
  } catch (err) {
    // return empty string when the buffer file is not found
    return ''
    //throw err
  }
}

function saveCurrent(buf) {
  console.log('>>saveCurrent()')
  const b = new Buffer(buf)
  const b64Txt = b.toString('base64')
  const txt = '{\'buf\': \'' + b64Txt + '\'}'
  try {
    fs.writeFileSync(app.getPath('userData') + '/currentBuffer.json', txt, 'utf-8')
    console.log('Saved current buffer.')
  } catch (err) {
    throw err
  }
}

function saveSettings() {
  console.log('>>saveSettings()')
  const txt = '{\'key\': \'Hello\'}'
  try {
    alert(app.getPath('userData'))
    fs.writeFileSync(app.getPath('userData') + '/shu-ho-settings.json', txt, 'utf-8')
    console.log('Saved settings.')
  } catch (err) {
    throw err
  }
}

// history

function getDataDir() {
  return app.getPath('userData')
}

function save(filename, txt) {
  console.log('>>save()')
  try {
    mkdirp(path.getDirName(path), function (err) {
      if (err) return cb(err)
      fs.writeFileSync(getDataDir() + '/' + filename, txt, 'utf-8')
    })
    fs.writeFileSync(getDataDir() + '/' + filename, txt, 'utf-8')
  } catch (err) {
    throw err
  }
}

function getFilenames() {
  console.log('>>getFilenames()')

  // 指定ディレクトリを検索して一覧を表示
  var list = []
  fs.readdirSync(getDataDir(), function (err, files) {
    
    // filesの中身を繰り替えして出力
    files.forEach(function (file) {
      var _type = ""
      if (fs.statSync(_dir + "/" + file).isFile()) {
        _type = "file     :"
        list.add(file)
      } else {
        _type = "directory:"
      }
      console.log(_type + _dir + "/" + file)
    })
  })
  return list
}

// from
// http://kuroeveryday.blogspot.jp/2016/10/ace-editor-for-vuejs.html
Vue.component('editor', {
  template: '<div :id=\'editorId\' style=\'width: 100% height: 100%\' ref=\'editor\'></div>',
  props: ['editorId', 'content', 'lang', 'theme'],
  data() {
    return {
      editor: Object,
      beforeContent: ''
    }
  },
  watch: {
    'content'(value) {
      if (this.beforeContent !== value) {
        this.editor.setValue(value, 1)
      }
    }
  },
  mounted() {
    const lang = this.lang || 'text'
    const theme = this.theme || 'github'

    this.editor = window.ace.edit(this.editorId)
    this.editor.setValue(this.content, 1)

    // mode-xxx.js or theme-xxx.jsがある場合のみ有効
    // this.editor.getSession().setMode(`brace/mode/${lang}`)
    // this.editor.setTheme(`blace/theme/${theme}`)

    this.editor.setOptions({
      // maxLines: Infinity
      minLines: 20,
      maxLines: 20
    })

    this.editor.on('change', () => {
      this.beforeContent = this.editor.getValue()
      this.$emit('change-content', this.editor.getValue())
    })
  }
})

Vue.component('previewer', {
  template: '<div :id=\'previewerId\' style=\'width: 100% height: 100%\' v-html=\'content\'></div>',
  props: ['previewerId'],
  computed: {
    content: function () { return indexPage.renderedContentA() }
  }
})

Vue.component('history-items', {
  template: '<div :id=\'history-items\' style=\'width: 100% height: 100%\' >\
  <ul>\
  <li v-for="item in items">\
    {{ item.value }}\
  </li>\
  </ul>\
  </div>',
  data: function() {
    return {items: [{value:"1"}, {value:"2"}, {value:"3"}]}
  }
})

const indexPage = new Vue({
  el: '#index',
  components: {
    EditorComponent,
    PreviewerComponent
  },
  computed: {
    mailLinkA: function () {
      return composeMailLink(this.contentA)
    }
  },
  created: function () {
    //this.page = 'history-items'
    this.loadLastBuffer()
  },
  data{
    page: 'editor',
    contentA: '# hint\nclick \'Template\' button to get template content.'
    appVersion: process.env.npm_package_version
  },
  methods: {
    renderedContentA: function () {
      return marked(this.contentA)
    },
    changeContentA(val) {
      if (this.contentA !== val) {
        this.contentA = val
      }
    },
    changeMailLinkA(val) {
      if (this.mailLinkA !== val) {
        this.mailLinkA = val
      }
    },
    getContentA() {
      return this.contentA
    },
    reset() {
      this.contentA = 'reset content for Editor A'
    },
    loadLastBuffer: function () {
      this.contentA = loadLast()
    },
    template: function () {
      defaultTemplate()
    },
    saveCurrentBuffer: function () {
      saveCurrent(this.contentA)
    },
    sendMail: function () {
      sendMail(this.mailLinkA)
    },
    showEditor: function () {
      this.page = 'editor'
    },
    showHistory: function () {
      this.page = 'history-items'
    },
    showPreview: function () {
      this.page = 'preview'
    }
  }
})
