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

export default {
  created: function () {
    this.$on('showHistory', function() {console.log('event fired and captured in child.')})
  },
  data: function () {
    return {
      items: [
      { title: '1', data: 'data1' }, { title: '2', data: 'data1'  }, { title: '3', data: 'data1'  }
      ]
    }
  },
  name: 'history',
  methods: {
    historySelected: function (v) {
      console.log(JSON.stringify(v))
      // console.dir(v)
      this.$emit('showHistory', v.data)
    }
  }
}
</script>