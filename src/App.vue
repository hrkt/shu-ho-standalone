<template>
  <div id="index" class="container">
    <div class="page-header">
      <h1>Shu-ho<small> Standalone {{appVersion}}</small>
        <button type="button" class="btn btn-link" onClick="saveSettings()" disabled><span class="glyphicon glyphicon-cog" aria-hidden="true"></span>Settings</button>
      </h1>
    </div>
    <div class="row">
      <div v-if="page === 'editor'">
        <div class="col-md-12">
          <input type="hidden">
          <a v-bind:href="mailLinkA" class="send-mail-link"></a>
          </input>
          <button type="button" class="btn btn-link" v-on:click="template()"><span class="glyphicon glyphicon-file" aria-hidden="true"></span>Template</button>
          <button type="button" class="btn btn-link" disabled><span class="glyphicon glyphicon-copy" aria-hidden="true"></span>Copy from the last report</button>
          <button type="button" class="btn btn-link" v-on:click="saveCurrentBuffer()"><span class="glyphicon glyphicon-save" aria-hidden="true"></span>Save current</button>
          <button type="button" class="btn btn-link" v-on:click="loadLastBuffer()"><span class="glyphicon glyphicon-open" aria-hidden="true"></span>Load Last</button>
          <button type="button" class="btn btn-link send-mail" v-on:click="sendMail()"><span class="glyphicon glyphicon-send" aria-hidden="true"></span>Send Mail</button>
          <button type="button" class="btn btn-link" v-on:click="showHistoryView()"><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span>History</button>
          <button type="button" class="btn btn-link" v-on:click="showPreview()"><span class="glyphicon glyphicon-play" aria-hidden="true"></span>Preview</button>
        </div>
      </div>
      <div v-if="page === 'preview'">
        <div class="col-md-12">
          [Preview]
          <button type="button" class="btn btn-link" v-on:click="showEditor()"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>Edit</button>
        </div>
      </div>
    </div>

    <hr>

    <div v-if="page === 'editor'">
      <div class="row">
        <div class="col-md-12">
          <div style="height: 400px">
            <editor editor-id="editorA" theme="twilight" :content="contentA" v-on:change-content="changeContentA"></editor>
          </div>
        </div>
      </div>
    </div>
    <div v-if="page === 'preview'">
      <div class="row">
        <div class="col-md-12">
          <div class='preview' style="height: 400px">
            <previewer previewer-id="previewerA" v-bind:parentContent='contentA'></previewer>
          </div>
        </div>
      </div>
    </div>
    <div v-if="page === 'history-items'">
      <div class="row">
        <div class="col-md-12">
          <div style="height: 400px">
            <h2>History</h2>
            <history-items histroy-id="historyA" v-on:showHistory="historyItemSelected"></history-items>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

'use strict'

import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import electron from 'electron'
const app=electron.remote.app
import ace from 'brace'
import bootstrap from 'bootstrap'
import Vue from 'vue'

import EditorComponent from './Editor.vue'
import PreviewerComponent from './Previewer.vue'
import HistoryComponent from './History.vue'
import * as dateUtil from './js/date-util.js'
import * as mailUtil from './js/mail-util.js'
import * as templateGen from './js/template-generator.js'

function sendMail(url) {
  console.log('>>defaultTemplate()')
  const link = document.querySelector('.send-mail-link')
  link.click()
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

module.exports = {
  components: {
    editor: EditorComponent,
    'history-items': HistoryComponent,
    previewer: PreviewerComponent
  },
  computed: {
    mailLinkA: function () {
      return mailUtil.composeMailLink(this.contentA)
    }
  },
  created: function () {
    if(process.env.NODE_ENV == 'develop') {
      this.page = 'history-items'
    }
    this.loadLastBuffer()
  },
  data: function() {
    return {
      page: 'editor',
      contentA: '# hint\nclick \'Template\' button to get template content.',
      appVersion: process.env.npm_package_version
    }
  },
  methods: {
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
    showHistoryView(d) {
      this.page = 'history-items'
    },
    template: function () {
      const buf = templateGen.generateTemplate()
      app.changeContentA(buf)
    },
    saveCurrentBuffer: function () {
      saveCurrent(this.contentA)
    },
    sendMail: function () {
      sendMail(this.mailLinkA)
    },
    historyItemSelected: function (msg) {
      console.log('selected:' + msg)
      this.showEditor()
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
}

</script>