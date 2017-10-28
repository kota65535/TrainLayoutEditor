<template>
  <section class="builder-palette">
    <div class="container-fluid">
      <builder-palette-section v-for="param in this.sectionParams" :name="param.name" :items="param.items"/>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import {Prop} from 'vue-property-decorator'
  import BuilderPaletteSection from './BuilderPaletteSection'
  import {PaletteItem, PaletteSectionParam} from '../lib/PaletteItem'
  import logger from '../logging'

  @Component({
    components: {
      BuilderPaletteSection
    }
  })
  export default class BuilderPalette extends Vue {
    @Prop()
    sectionParams: PaletteSectionParam[]
  }
</script>

<style scoped>
  .builder-palette {
    /* position */
    position: fixed;
    margin-top: 50px;
    margin-bottom: 50px;
    width: 250px;
    /* for scroll */
    overflow-y: scroll;
    top: 0;
    bottom: 0;
    /* above content */
    z-index: 9901;
    background: #999;
  }

  [class*="col-"] {
    border: 1px solid #ddd;
  }

  /*.sidebar-nav {*/
  /*position: absolute;*/
  /*top: 0;*/
  /*width: 250px;*/
  /*margin: 0;*/
  /*padding: 0;*/
  /*list-style: none;*/
  /*}*/

  /*.sidebar-nav > .sidebar-brand {*/
  /*height: 65px;*/
  /*font-size: 18px;*/
  /*line-height: 60px;*/
  /*}*/

  .sidebar-nav > .sidebar-brand a {
    color: #999999;
  }

  .sidebar-nav > .sidebar-brand a:hover {
    color: #fff;
    background: none;
  }
</style>
