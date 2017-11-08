<template>
  <div class="card">
    <div class="card-header">
      <b-row>
        <b-col cols=9>
          <b-form-input id="input-small" size="sm" type="text" :value="switcher.name"></b-form-input>
        </b-col>
        <b-col cols=3>
          <b-button size="sm" @click="onConnectTurnout">+</b-button>
        </b-col>
      </b-row>
    </div>
    <div class="card-body container">
      <div v-for="turnout in switcher.turnouts">
        <b-row>
          <b-col cols=2>
          </b-col>
          <b-col cols=10>
            {{ turnout.name }}
          </b-col>
        </b-row>
        <b-row>
          <b-form-radio-group v-model="direction" stacked>
            <b-form-radio v-for="(cond, i) in turnout.conductionTable" :value="i.toString()">{{ cond }}</b-form-radio>
          </b-form-radio-group>
        </b-row>
      </div>
    </div>

    <switcher-connection-dialog ref="connectionDialog" :switcher="switcher" :turnout="selectedRail" @ok="onModalOK"></switcher-connection-dialog>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import {Model, Prop, Watch} from 'vue-property-decorator'
  import {State, Getter} from "vuex-class"
  import {PaletteItem, EditorMode} from '../../lib/PaletteItem'
  import logger from '../../logging'
  import paper, {Point} from "paper"
  import {FeederData} from "../../lib/LayoutManager";
  import {FeederSocket, FeederDirection, FeederStoreState} from "../../lib/parts/FeederSocket";
  import {SwitcherState} from "../../store/state";
  import clone from "clone"
  import {RailStoreState} from "../../lib/rails/Rail";
  import RailFactory from "src/lib/RailFactory"
  import SwitcherConnectionDialog from "./SwitcherConnectionDialog"

  @Component({
    components: {
      SwitcherConnectionDialog
    }
  })
  export default class RunnerPaletteSwitcher extends Vue {
    direction: string = '0'

    @Prop()
    switcher: SwitcherState

    @State
    selectedRailName: string
    @State
    currentSwitcherName: string
    @State
    isTurnoutSelected: boolean

    @Getter
    selectedRail: RailStoreState


    /**
     * スイッチにポイントを接続するための処理を開始する。
     */
    onConnectTurnout () {
      this.$store.commit('setCurrentSwitcher', this.switcher.name)
      this.$store.commit('setEditorMode', EditorMode.TURNOUT_SELECTING)
    }

    /**
     * ポイントが選択されたら、ダイアログを表示する
     */
    @Watch('selectedRailName')
    onFeederSelected () {
      if (this.isCurrentSwitcher()) {
        (<any>this.$refs.connectionDialog).show();
      }
    }

    /**
     * ダイアログでOKボタンが押されたら、スイッチにポイントを接続する
     */
    onModalOK () {
      if (this.isCurrentSwitcher()) {
        let switcher = clone(this.switcher)
        switcher.turnouts.push(this.selectedRail)
        this.$store.commit('updateSwitcher', switcher)
      }
    }

    /**
     * スイッチの切替が行われた時、スイッチおよび接続されたポイントの状態を変更してストアに通知する
     * @param {string} direction
     */
    @Watch('direction')
    onStateChanged (direction: string) {
      let switcher = clone(this.switcher)
      switcher.direction = parseInt(direction)
      switcher.turnouts.forEach(t => t.conductionState = switcher.direction)
      this.$store.dispatch('setSwitcherDirection', switcher)
    }

    /**
     * 現在処理中のスイッチか否かを返す
     * @returns {boolean}
     */
    private isCurrentSwitcher () {
      return this.switcher.name === this.currentSwitcherName
    }

  }
</script>

<style lang="scss" scoped>
  [class*="col-"] {
    border: 1px solid #ddd;
  }
</style>
