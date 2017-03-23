// from
// http://kuroeveryday.blogspot.jp/2016/10/ace-editor-for-vuejs.html
<template>
  <div :id='editorId' style='width: 100% height: 100%' ref='editor'></div>
</template>

<script>
export default {
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
  },
  name: 'editor'
}
</script>