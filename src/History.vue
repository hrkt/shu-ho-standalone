<template>
  <div :id="'history-id'" style="width: 100% height: 100%">
    <ul>
      <li v-for="item in items">
        {{ item.value }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      items: [
      { value: '1' }, { value: '2' }, { value: '3' }
      ]
    }
  },
  name: 'history'
}
</script>