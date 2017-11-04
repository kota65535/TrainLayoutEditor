<template>
  <section class="runner-palette">
    <div class="container-fluid">
      <runner-palette-power-pack-section/>
      <runner-palette-turnout-section/>
    </div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import {Prop} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import RunnerPalettePowerPackSection from './RunnerPalettePowerPackSection'
  import RunnerPaletteTurnoutSection from './RunnerPaletteSwitcherSection'
  import {PaletteItem} from '../../lib/PaletteItem'
  import logger from '../../logging'

  @Component({
    components: {
      RunnerPalettePowerPackSection,
      RunnerPaletteTurnoutSection
    }
  })
  export default class RunnerPalette extends Vue {
  }
</script>

<style lang="scss" scoped>
  @import "../../css/app";

  .runner-palette {
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
