<template>
  <section class="builder-palette">
    <div class="container-fluid">
      <builder-palette-section v-for="section in this.getBuilderPaletteData.sections" :name="section.name" :items="section.items"/>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import {Prop} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import BuilderPaletteSection from './BuilderPaletteSection'
  import {BuilderPaletteData, PaletteItem} from '../../lib/PaletteItem'
  import logger from '../../logging'

  @Component({
    components: {
      BuilderPaletteSection
    }
  })
  export default class BuilderPalette extends Vue {
    @Getter
    getBuilderPaletteData: BuilderPaletteData
  }
</script>

<style lang="scss" scoped>
  @import "../../css/app";

  .builder-palette {
    /* position */
    position: fixed;
    margin-top: $menu-bar-height;
    margin-bottom: $tool-bar-height;
    width: $palette-width;
    /* for scroll */
    overflow-y: scroll;
    top: 0;
    bottom: 0;
    /* above main canvas, under drop down menu */
    z-index: $palette-z-index;
    background: #999;
  }
</style>
