<template>
  <section>
    Feeders
    <section v-for="feeder in getRunnerPaletteData.feeders">
      <span class="sidebar-nav">{{ feeder.name }}</span>
      <b-row>
        <b-col cols=3>
          <!-- イベントハンドラにフィーダー名を渡す -->
          <input :ref="`${feeder.name}-direction`" type="checkbox" @change="onDirectionInput($event, feeder.name)">
        </b-col>
        <b-col cols=9>
          <input data-provide="slider" :ref="`${feeder.name}-slider`" @input="onValueInput($event, feeder.name)"
                 class="form-control" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="20" data-slider-step="1" data-slider-value="14"/>
        </b-col>
      </b-row>
    </section>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import {Model, Prop, Watch} from 'vue-property-decorator'
  import {State, Getter} from "vuex-class"
  import {PaletteItem, PaletteItemType} from '../lib/PaletteItem'
  import logger from '../logging'
  import {RailFactory} from "src/lib/RailFactory"
  import paper, {Point} from "paper"
  import {FeederData} from "../lib/LayoutManager";
  import {FeederStoreState} from "../lib/LayoutEditorStoreProxy";
  import {FlowDirection} from "../lib/rails/parts/FeederSocket";

  @Component
  export default class RunnerPaletteFeederSection extends Vue {
    @Getter
    getRunnerPaletteData

//    @Model('change')
//    feederDirections: any
//
//    @Model('change')
//    feederValues: any

    onDirectionInput (e: Event, name: string) {
      let checked = (<HTMLInputElement>e.target).checked
      let direction
      if (checked) {
        direction = FlowDirection.START_TO_END
      } else {
        direction = FlowDirection.END_TO_START
      }
      this.$store.commit('SET_FEEDER_FLOW_DIRECTION', {
        name: name,
        power: null,
        direction: direction
      } as FeederStoreState)
    }

    onValueInput (e: Event, name: string) {
      let power = parseInt((<HTMLInputElement>e.target).value)
      if (power) {
        this.$store.commit('SET_FEEDER_FLOW_POWER', {
          name: name,
          power: power,
          direction: null
        } as FeederStoreState)
      }
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
