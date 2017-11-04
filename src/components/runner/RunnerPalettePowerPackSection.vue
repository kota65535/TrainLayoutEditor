<template>
  <section>
    <b-row>
      <b-col cols=9>
        <h4>Power Packs</h4>
      </b-col>
      <b-col cols=3>
        <b-button size="sm" @click="onCreatePowerPack">+</b-button>
      </b-col>
    </b-row>
    <runner-palette-power-pack v-for="powerPack in getRunnerPaletteData.powerPacks" :powerPack="powerPack"></runner-palette-power-pack>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import {Model, Prop, Watch} from 'vue-property-decorator'
  import {State, Getter} from "vuex-class"
  import {PaletteItem, EditorMode, RunnerPaletteData} from '../../lib/PaletteItem'
  import logger from '../../logging'
  import {RailFactory} from "src/lib/RailFactory"
  import paper, {Point} from "paper"
  import {FeederData} from "../../lib/LayoutManager";
  import {FeederDirection} from "../../lib/rails/parts/FeederSocket";
  import {PowerPackState} from "../../store/state";
  import RunnerPalettePowerPack from './RunnerPalettePowerPack'

  @Component({
    components: {
      RunnerPalettePowerPack
    }
  })
  export default class RunnerPalettePowerPackSection extends Vue {
    @Getter
    getRunnerPaletteData: RunnerPaletteData

    onCreatePowerPack (e: Event) {
      let id = this.getRunnerPaletteData.switchers.length + 1
      let defaultName = `PowerPack ${id}`
      this.$store.commit('addPowerPack', {
        id: id,
        name: defaultName,
        power: 0,
        direction: true,
        feeders: []
      } as PowerPackState)
    }


  }
</script>

<style lang="scss" scoped>
  [class*="col-"] {
    border: 1px solid #ddd;
  }
</style>
