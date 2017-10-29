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
  import {PaletteItem, EditorMode} from '../lib/PaletteItem'
  import logger from '../logging'
  import {RailFactory} from "src/lib/RailFactory"
  import paper, {Point} from "paper"
  import {FeederData} from "../lib/LayoutManager";
  import {FeederStoreState} from "../lib/LayoutEditorStoreProxy";
  import {FlowDirection} from "../lib/rails/parts/FeederSocket";
  import {PowerPackState} from "../store/state";
  import RunnerPalettePowerPack from './RunnerPalettePowerPack'

  @Component({
    components: {
      RunnerPalettePowerPack
    }
  })
  export default class RunnerPalettePowerPackSection extends Vue {
    @Getter
    getRunnerPaletteData

    onCreatePowerPack (e: Event) {
      let defaultName = `PowerPack ${this.getRunnerPaletteData.powerPacks.length + 1}`
      this.$store.commit('addPowerPack', {
        name: defaultName,
        power: 0,
        direction: FlowDirection.START_TO_END,
        feeders: []
      } as PowerPackState)
    }


  }
</script>

<style scoped>
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

  .palette-item {
    height: 125px;
    /*line-height: 125px;*/
    background: #eee;
    padding: 10px;
    /*text-align: center;*/
  }

  .palette-item button {
    height: 100%;
  }

  .button-canvas {
    height: 100%;
    width: 100%;
    /*height: 100px;*/
    /*width: 100px;*/
  }


  /*.palette-item-text {*/
  /*display: inline-block;*/
  /*vertical-align: middle;*/
  /*line-height: normal;*/
  /*}*/
</style>
