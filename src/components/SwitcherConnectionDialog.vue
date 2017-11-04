<template>
  <b-modal @shown="onShown" ref="modal" @ok="onOK" :title="`Connecting turnout ${turnout.name} to switcher ${switcher.name}`">
    <b-row>
      <b-col cols=3>
        Switcher
      </b-col>
      <b-col cols=9>
        Turnout State
      </b-col>
    </b-row>
    <b-row v-for="(state, i) in turnout.conductionTable">
      <b-col cols=3>
        {{ i }}
      </b-col>
      <b-col cols=9>
        <canvas :ref="`${turnout.name}-${i}-canvas`" :id="`${turnout.name}-${i}-canvas`"></canvas>
      </b-col>
    </b-row>
    <b-button @click="onToggle">Toggle</b-button>
  </b-modal>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import {Model, Prop, Watch} from 'vue-property-decorator'
  import {State, Getter} from "vuex-class"
  import {PaletteItem, EditorMode} from '../lib/PaletteItem'
  import logger from '../logging'
  import paper, {Point} from "paper"
  import {FeederData} from "../lib/LayoutManager";
  import {FeederSocket, FeederDirection, FeederStoreState} from "../lib/rails/parts/FeederSocket";
  import {SwitcherState} from "../store/state";
  import clone from "clone"
  import {Rail, RailStoreState} from "../lib/rails/Rail";
  import RailFactory from "src/lib/RailFactory"
  import {cloneRail} from "../lib/RailUtil";
  import {FlowDirection} from "../lib/rails/parts/RailPart";
  import {SimpleTurnout, TurnoutDirection} from "../lib/rails/Turnout";

  @Component
  export default class SwitcherConnectionDialog extends Vue {
    @Prop()
    turnout: RailStoreState
    @Prop()
    switcher: SwitcherState

    onShown() {
      this.drawRails()
    }

    @Watch('turnout')
    onTurnoutChanged () {
      // Turnoutの状態が変わったら再描画する
      this.drawRails()
    }

    show() {
      (<any>this.$refs.modal).show()
    }

    hide() {
      (<any>this.$refs.modal).hide()
    }

    /**
     *  Toggleボタンを押したらTurnoutの通電状態を変更する。
     *  結果、onTurnoutChanged() が呼ばれて再描画を行う想定
     */
    onToggle () {
      let turnout: RailStoreState = clone(this.turnout)
      let tmp = clone(turnout.conductionTable[0])
      turnout.conductionTable[0] = turnout.conductionTable[1]
      turnout.conductionTable[1] = tmp
      this.$store.commit('updateRail', turnout)
    }

    onOK () {
      this.$emit('ok', this.turnout)
    }

    /**
     * Canvasにレールを描画する。
     * ダイアログが表示された直後でないとCanvasのサイズが0なのでこのタイミングで行う
     */
    drawRails () {
      // 現在のProjectを取得しておく
      let currentProject = paper.project

      // 通電状態ごとに描画
      for (let i=0 ; i < this.turnout.conductionTable.length ; ++i) {
        let target = `${this.turnout.name}-${i}-canvas`
        paper.setup(target);

        // 選択中のレールをクローンしてこのキャンバスに描画する
        let rail: Rail = cloneRail((<any>this).$editor.layoutManager.rails.find(r => r.name === this.turnout.name))
        rail.storeState = this.turnout
        // v-forの内部では$refsはArrayを返す
        let canvas = this.$refs[target][0]
        let bounds = rail.getBounds();
        let center = new Point((<any>canvas).clientWidth / 2, (<any>canvas).clientHeight / 2);
        rail.move(center, bounds.center)

        // 電流アニメーションの表示
        let rootJoint = rail.railParts[0].joints[0]
        rail.conductionTable[i].forEach(k => {
          if ( rail.railParts[k].joints[0] === rootJoint ) {
            rail.railParts[k].flowDirection = FlowDirection.START_TO_END
          } else {
            rail.railParts[k].flowDirection = FlowDirection.END_TO_START
          }
        })
        paper.view.onFrame = (event) => {
          rail.animate(event)
        };

        // ジョイントの検出範囲を非表示
        rail.disableJoints()
      }

      // 現在のProjectを元に戻す
      if (currentProject) {
        currentProject.activate()
      }
    }
  }
</script>

<style lang="scss" scoped>
  [class*="col-"] {
    border: 1px solid #ddd;
  }
</style>
