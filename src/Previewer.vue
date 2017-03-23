
<template>
<div :id='previewerId' style='width: 100% height: 100%' v-html='content'></div>
</template>

<script>
import marked from 'marked'

export default {
  // computed: {
  //   content: function () { return indexPage.renderedContentA() }
  // },
  computed: {
    content: function () { 
      return marked(this.parentContent)
    }
  },
  name: 'previewer',
  props: ['previewerId', 'parentContent'],
}
</script>