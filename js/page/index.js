'use strict';

// const fs = window.nodeRequire('fs');

// const path = window.nodeRequire('path');

// const app = window.nodeRequire('electron').remote.app;

// const mustache = window.nodeRequire('mustache');

// const moment = window.nodeRequire('moment');

//const jQuery = require('jquery');

const fs = require('fs');

const path = require('path');

const app = require('electron').remote.app;

const mustache = require('mustache');

const moment = require('moment');

const ace = require('brace');

const bootstrap = require('bootstrap');

const marked = require('marked');

const Vue = require('vue');

moment.locale('ja', {
  weekdays: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
  weekdaysShort: ["日", "月", "火", "水", "木", "金", "土"],
});

function calcStartDate() {
  const s = moment(new Date(2017, 3 - 1, 8));
  return startDayOfWeekFor(s);
}

function isOffDay(d) {
  return d.day() == 0 || d.day() == 6;
}

function startDayOfWeekFor(d) {
  return d.subtract(d.day() - 1, "day");
}

function defaultTemplate() {
  console.log(">>defaultTemplate()");
  let startDate = calcStartDate();
  var buf = "";
  var template = "";
  template += "|日付       |概要|" + "\n";
  template += "|:---------|:--|" + "\n";
  const defaultWork = "作業日";
  for (var i of [1, 2, 3, 4, 5, 6, 7]) {
    template += "|{{date" + i + "}}|{{work" + i + "}}|" + "\n";
  }
  var values = {};
  var d = startDate;
  for (var i of [1, 2, 3, 4, 5, 6, 7]) {
    values["date" + i] = d.format("MM-DD(ddd)");
    if (isOffDay(d)) {
      values["work" + i] = "休み";
    } else {
      values["work" + i] = defaultWork;
    }
    d.add(1, "day");
  }
  var rendered = mustache.render(template, values);
  buf += rendered;

  indexPage.changeContentA(buf);
}

function getReportDateStr() {
  return calcStartDate().format("MM-DD");
}

function getSubmitAddress() {
  return "someone@example.com";
}

function getSubject() {
  return "Weekly Report " + getReportDateStr();
}

function encodeBody(text) {
  return text.replace(/\n/g, " %0D%0A ");
}

function composeMailLink(content) {
  return "mailto:" + getSubmitAddress() + "?subject=" + getSubject() + "&body=" + encodeBody(content);
}

function sendMail(url) {
  console.log(">>defaultTemplate()");
  const link = document.querySelector('.send-mail-link');
  link.click();

  // var elem = this.$refs.sendMailLink;
  // var prevented = elem.dispatchEvent(new Event("click"));
  // if (prevented) { } // A handler used event.preventDefault();  
}

function loadLast(buf) {
  console.log(">>loadLastBuffer()");
  try {
      const jsonStr = fs.readFileSync(app.getPath('userData') + '/currentBuffer.json', 'utf-8');
      const json = JSON.parse(jsonStr);
      const b64Txt = json['buf'];
      const b = new Buffer(b64Txt, 'base64');
      console.log('Load last buffer.');
      return b.toString();
  } catch (err) {
      // return empty string when the buffer file is not found
      return "";
      //throw err;
  }
}

function saveCurrent(buf) {
  console.log(">>saveCurrent()");
  const b = new Buffer(buf);
  const b64Txt = b.toString('base64');
  const txt = '{"buf": "' + b64Txt + '"}';
  try {
      fs.writeFileSync(app.getPath('userData') + '/currentBuffer.json', txt, 'utf-8');
      console.log('Saved current buffer.');
  } catch (err) {
      throw err;
  }
}

function saveSettings() {
  console.log(">>saveSettings()");
  const txt = '{"key": "Hello"}';
  try {
      alert(app.getPath('userData'));
      fs.writeFileSync(app.getPath('userData') + '/shu-ho-settings.json', txt, 'utf-8');
      console.log('Saved settings.');
  } catch (err) {
      throw err;
  }
}

// from
// http://kuroeveryday.blogspot.jp/2016/10/ace-editor-for-vuejs.html
Vue.component('Editor', {
  template: '<div :id="editorId" style="width: 100%; height: 100%;"></div>',
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
    });

    this.editor.on('change', () => {
      this.beforeContent = this.editor.getValue()
      this.$emit('change-content', this.editor.getValue())
    })
  }
});

Vue.component('Previewer', {
  template: '<div :id="previewerId" style="width: 100%; height: 100%;" v-html="content"></div>',
  props: ['previewerId'],
  computed: {
    content: function () { return indexPage.renderedContentA() }
  }
});

const indexPage = new Vue({
  el: "#index",
  data: {
    page: 'editor',
    contentA: '# hint\nclick "Template" button to get template content.'
  },
  computed: {
    mailLinkA: function () {
      return composeMailLink(this.contentA);
    }
  },
  methods: {
    renderedContentA: function () {
      return marked(this.contentA);
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
      return this.contentA;
    },
    reset() {
      this.contentA = 'reset content for Editor A'
    },
    loadLastBuffer: function() {
      this.contentA = loadLast();
    },
    template: function () {
      defaultTemplate();
    },
    saveCurrentBuffer: function() {
      saveCurrent(this.contentA);
    },
    sendMail: function () {
      sendMail(this.mailLinkA);
    },
    showEditor: function () {
      this.page = 'editor';
    },
    showPreview: function () {
      this.page = 'preview';
    }
  }
});
