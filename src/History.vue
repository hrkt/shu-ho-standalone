<template>
  <div :id="'history-id'" style="width: 100% height: 100%">
  This function is under development.
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
      //items: [{ title: '1', data: 'data1' }]
      items: this.getHistories()
    }
      // items: [
      // { title: '1', data: 'data1' }, { title: '2', data: 'data1'  }, { title: '3', data: 'data1'  }
      // ]
      // items: function() {
      //   // { title: '1', data: 'data1' }, { title: '2', data: 'data1'  }, { title: '3', data: 'data1'  }
      //   const files = this.getHistories()
      //   console.log("files:")
      //   console.dir(files)
      //   for (var f in files) {
      //     var ret = {title: f, data: f}
      //   }
      //   return ret
      // }
  },
  name: 'history',
  methods: {
    getHistories: function () {
      const files = fileIO.getFilenames(this.dataPath)
      if (null === files) {
        return []
      }
      return files.map(function (f) {return {title: f, data: f}})
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