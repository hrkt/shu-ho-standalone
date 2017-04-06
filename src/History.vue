<template>
  <div :id="'history-id'" style="width: 100% height: 100%">
    <ul>
      <li v-for="item in items">
        <button v-on:click="historySelected(item)" v-bind:value="item.value">{{ item.title }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
// import * as historyDb from './js/local-db.js'
import * as fileIO from './js/file-io.js'
import * as appConstants from './js/app-constants.js'

export default {
  created: function () {
    this.$on('showHistory', function() {console.log('event fired and captured in child.')})
    console.log("dataPath:" + this.dataPath)
  },
  data: function () {
    return {
      items: this.getHistories()
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
      this.$emit('showHistory', v.data)
    }
  },
  props: ['dataPath']  
}
</script>