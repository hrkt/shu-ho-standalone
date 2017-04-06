
<template>
<div :id='previewerId'>
  <span class="label label-default">{{title}}</span>
  <div style='width: 100% height: 100%' v-html='content'></div>
</div>
</template>

<script>
import marked from 'marked'

export default {
  computed: {
    content: function () { 
      return marked(this.parentContent)
    }
  },
  name: 'previewer',
  props: ['previewerId', 'parentContent', 'title'],
}
</script>