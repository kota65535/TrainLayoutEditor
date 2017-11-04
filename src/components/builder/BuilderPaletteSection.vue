<template>
  <section>
    <span class="sidebar-nav">{{ name }}</span>
    <b-row>
      <b-col cols=6 class="palette-item" v-for="item in items">
        <builder-palette-item :item="item"></builder-palette-item>
      </b-col>
    </b-row>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import {Prop} from 'vue-property-decorator'
  import {State} from "vuex-class"
  import {PaletteItem, EditorMode} from '../../lib/PaletteItem'
  import logger from '../../logging'
  import {RailFactory} from "src/lib/RailFactory"
  import paper, {Point} from "paper"
  import BuilderPaletteItem from "./BuilderPaletteItem"

  @Component({
    components: {
      BuilderPaletteItem
    }
  })
  export default class BuilderPaletteSection extends Vue {
    @Prop()
    name: string
    @Prop()
    items: PaletteItem[]

    @State
    selectedItem: PaletteItem
  }
</script>

<style lang="scss" scoped>
  @import "../../css/app";

  /* for debug */
  [class*="col-"] {
    border: 1px solid #ddd;
  }

  .sidebar-nav > .sidebar-brand a {
    color: #999999;
  }

  .sidebar-nav > .sidebar-brand a:hover {
    color: #fff;
    background: none;
  }

  .palette-item {
    height: $palette-width / 2;
    background: #eee;
    padding: 10px;
  }

  .palette-item button {
    height: 100%;
  }

  .button-canvas {
    height: 100%;
    width: 100%;
  }
</style>
