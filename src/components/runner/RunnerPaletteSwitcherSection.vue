<template>
  <section>
    <b-row>
      <b-col cols=9>
        <h4>Switches</h4>
      </b-col>
      <b-col cols=3>
        <b-button size="sm" @click="onCreateSwitcher">+</b-button>
      </b-col>
    </b-row>
    <runner-palette-switcher v-for="switcher in getRunnerPaletteData.switchers" :switcher="switcher"></runner-palette-switcher>
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
  import {RailStoreState} from "../../lib/rails/Rail";
  import {SwitcherState} from "../../store/state";
  import RunnerPaletteSwitcher from "./RunnerPaletteSwitcher"

  @Component({
    components: {
      RunnerPaletteSwitcher
    }
  })
  export default class RunnerPaletteTurnoutSection extends Vue {
    @Getter
    getRunnerPaletteData: RunnerPaletteData

    onCreateSwitcher (e: Event) {
      let id = this.getRunnerPaletteData.switchers.length + 1
      let defaultName = `Switcher ${id}`
      this.$store.commit('addSwitcher', {
        id: id,
        name: defaultName,
        direction: 0,
        stateMap: [[]],
        turnouts: []
      } as SwitcherState)
    }
  }
</script>

<style lang="scss" scoped>
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
