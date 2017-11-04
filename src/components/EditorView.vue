<template>
  <div class="editor-view">
    <menu-bar></menu-bar>
    <builder-palette v-show="currentPalette === 'builder-palette'"></builder-palette>
    <runner-palette v-show="currentPalette === 'runner-palette'"></runner-palette>
    <main-canvas></main-canvas>
    <tool-bar></tool-bar>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import MenuBar from './MenuBar.vue'
  import MainCanvas from './MainCanvas.vue'
  import ToolBar from './ToolBar.vue'
  import BuilderPalette from './builder/BuilderPalette'
  import RunnerPalette from './runner/RunnerPalette'
  import Component from 'vue-class-component'
  import {State} from "vuex-class"

  @Component({
    components: {
      MenuBar,
      MainCanvas,
      ToolBar,
      BuilderPalette,
      RunnerPalette
    }
  })
  export default class EditorView extends Vue {
    @State
    currentPalette: string
  }
</script>
