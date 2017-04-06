<template>
  <div class="row">
    <div class="col-md-4">
      <div :id="'history-id'"
           style="width: 100% height: 100%">
        <ul>
          <li v-for="item in items">
            <button v-on:click="historySelected(item)"
                    v-bind:value="item.value">{{ item.title }}</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="col-md-8">
      <previewer previewer-id="previewerH" v-bind:parentContent='contentH' v-bind:title='previewTitle'></previewer>
    </div>
  </div>
</template>

<script>

import path from 'path'

import PreviewerComponent from './Previewer.vue'

// import * as historyDb from './js/local-db.js'
import * as fileIO from './js/file-io.js'
import * as appConstants from './js/app-constants.js'

export default {
  created: function () {
    this.$on('showHistory', function() {console.log('event fired and captured in child.')})
    console.log("dataPath:" + this.dataPath)
  },
  components: {
    previewer: PreviewerComponent
  },
  data: function () {
    return {
      contentH: '# hint\nclick \'file\' button to see a content.',
      items: this.getHistories(),
      previewTitle: ''
    }
  },
  name: 'history',
  methods: {
    getHistories: function () {
      const files = fileIO.getFilenames(this.dataPath)
      if (null === files) {
        return []
      }
      files.sort().reverse();
      return files.map(function (f) {
        const t = f.replace(/\.json$/, '')
        return {title: t, data: f}
      })
    },
    historySelected: function (v) {
      console.log(JSON.stringify(v))
      // console.dir(v)
      //this.$emit('showHistory', v.data)
      const buf = fileIO.load(path.join(this.dataPath, v.data))
      this.contentH = buf
      this.previewTitle = v.title
    }
  },
  props: ['dataPath']  
}
</script>