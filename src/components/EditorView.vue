<template>
  <div class="editor-view">
    <menu-bar></menu-bar>
    <component :is="currentPalette" :sectionParams="paletteSectionParams"></component>
    <main-canvas></main-canvas>
    <tool-bar></tool-bar>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import MenuBar from './MenuBar.vue'
  import MainCanvas from './MainCanvas.vue'
  import ToolBar from './ToolBar.vue'
  import BuilderPalette from './BuilderPalette'
  import Component from 'vue-class-component'
  import {State} from "vuex-class"
  import {BUILDER_PALETTE_SECTION_PARAMS} from "../constants";

  @Component({
    components: {
      MenuBar,
      MainCanvas,
      ToolBar,
      BuilderPalette,
    }
  })
  export default class EditorView extends Vue {
    @State
    currentPalette: string

    paletteSectionParams = BUILDER_PALETTE_SECTION_PARAMS
  }
</script>
