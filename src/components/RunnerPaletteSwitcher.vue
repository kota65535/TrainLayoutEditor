<template>
  <div class="card">
    <div class="card-header">
      <b-row>
        <b-col cols=9>
          <b-form-input id="input-small" size="sm" type="text" :value="switcher.name"></b-form-input>
        </b-col>
        <b-col cols=3>
          <b-button size="sm" @click="onAddTurnout">+</b-button>
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
  import {SwitcherState} from "../store/state";
  import clone from "clone"
  import {RailStoreState} from "../lib/rails/Rail";

  @Component
  export default class RunnerPaletteSwitcher extends Vue {

    @Prop()
    switcher: SwitcherState

    @State
    selectedTurnout: RailStoreState

    @State
    currentSwitcher: string

    direction: string = '0'

    /**
     * スイッチにポイントを追加
     */
    @Watch('selectedTurnout')
    onFeederSelected (selectedTurnout: RailStoreState) {
      // Addボタンを押したのがこのパワーパックで、かつ選択されたフィーダーが未登録の場合
      if (this.switcher.name === this.currentSwitcher) {
        let switcher = clone(this.switcher)
        switcher.turnouts.push(selectedTurnout)
        this.$store.commit('updateSwitcher', switcher)
      }
    }

    @Watch('direction')
    onStateChanged (direction: string) {
      let switcher = clone(this.switcher)
      switcher.direction = parseInt(direction)
      switcher.turnouts.forEach(t => t.conductionState = switcher.direction)
      this.$store.dispatch('setSwitcherDirection', switcher)
    }

    onAddTurnout () {
      this.$store.commit('setCurrentSwitcher', this.switcher.name)
      this.$store.commit('setEditorMode', EditorMode.TURNOUT_SELECTING)
    }
  }
</script>

<style lang="scss" scoped>
  [class*="col-"] {
    border: 1px solid #ddd;
  }
</style>
