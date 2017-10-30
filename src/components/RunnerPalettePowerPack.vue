<template>
  <div class="card">
    <div class="card-header">
      <b-row>
        <b-col cols=9>
          <b-form-input id="input-small" size="sm" type="text" :value="powerPack.name"></b-form-input>
        </b-col>
        <b-col cols=3>
          <b-button size="sm" @click="onAddFeeder">+</b-button>
        </b-col>
      </b-row>
    </div>
    <div class="card-body container">
      <div class="row">
        <div class="col-md-3">
          <input type="checkbox" v-model="direction">
        </div>
        <div class="col-md-9">
          <b-form-slider :min="0" :max="255" v-model="power"></b-form-slider>
        </div>
      </div>
      <div class="row" v-for="feeder in powerPack.feeders">
        <div class="col-md-3">
          {{ feeder.name }}
        </div>
        <div class="col-md-9">
          {{ feeder.name }}
        </div>
      </div>
    </div>
  </div>
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
  import {FeederSocket, FeederDirection, FeederStoreState} from "../lib/rails/parts/FeederSocket";
  import {PowerPackState} from "../store/state";
  import clone from "clone"

  @Component
  export default class RunnerPalettePowerPack extends Vue {

    @Prop()
    powerPack: PowerPackState

    @State
    selectedFeederSocket: FeederStoreState

    @State
    currentPowerPack: PowerPackState

    power: number = 0

    direction: boolean = true

    /**
     * パワーパックに選択したフィーダーを追加する
     */
    @Watch('selectedFeederSocket')
    onFeederSelected (selectedFeederSocket: FeederStoreState) {
      // Addボタンを押したのがこのパワーパックで、かつ選択されたフィーダーが未登録の場合
      if (this.powerPack.name === this.currentPowerPack.name
        && this.powerPack.feeders.filter( f => f.name === this.selectedFeederSocket.name).length === 0
      ) {
        let powerPack = clone(this.powerPack)
        powerPack.feeders.push(selectedFeederSocket)
        this.$store.commit('updatePowerPack', powerPack)
      }
    }

    /**
     * スライダーの値をもとに、パワーパックのパワーを更新する
     */
    @Watch('power')
    onPowerChanged () {
      let powerPack = clone(this.powerPack)
      powerPack.power = this.power
      powerPack.feeders.forEach(f => f.power = powerPack.power)
      this.$store.dispatch('setPowerPackPower', powerPack)
    }

    /**
     * スライダーの値をもとに、パワーパックの方向を更新する
     */
    @Watch('direction')
    onDirectionChanged () {
      let powerPack = clone(this.powerPack)
      powerPack.power = 0
      powerPack.feeders.forEach(f => f.power = 0)
      powerPack.direction = this.direction
      powerPack.feeders.forEach(f => f.flowDirection = powerPack.direction)
      this.$store.dispatch('setPowerPackDirection', powerPack)
    }

    /**
     * 現在のパワーパックを設定し、フィーダー選択モードに入る。
     */
    onAddFeeder () {
      this.$store.commit('SET_CURRENT_POWER_PACK', this.powerPack)
      this.$store.commit('setEditorMode', EditorMode.FEEDER_SELECTING)
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
