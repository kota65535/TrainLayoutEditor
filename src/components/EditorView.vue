<template>
  <div class="editor-view">
    <menu-bar></menu-bar>
    <main-canvas></main-canvas>
    <tool-bar></tool-bar>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import MenuBar from './MenuBar.vue'
  import MainCanvas from './MainCanvas.vue'
  import ToolBar from './ToolBar.vue'
  import Component from 'vue-class-component'

  @Component({
    components: {
      MenuBar,
      MainCanvas,
      ToolBar
    }
  })
  export default class EditorView extends Vue {
  }
</script>
