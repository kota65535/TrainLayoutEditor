import * as types from './mutation-types'
import {FileInfo, PowerPackState, State} from "./state";
import {MutationTree} from "vuex";
import {EditorMode, PaletteItem} from "../lib/PaletteItem";
import {RailStoreState} from "../lib/rails/Rail";
import {FeederStoreState} from "../lib/rails/parts/FeederSocket";
import Vue from "vue";

export default ({
  [types.SET_SIGNIN_STATUS](state: State, isSignedIn: boolean) {
    state.isSignedIn = isSignedIn
  },
  [types.SET_FILE_INFO](state: State, fileInfo: FileInfo) {
    state.fileInfo = fileInfo
  },
  [types.SET_RAIL](state: State, rails: RailStoreState[]) {
    state.rails = rails
  },
  [types.SET_FEEDER](state: State, feederSockets: FeederStoreState[]) {
    state.feederSockets = feederSockets
  },
  [types.SELECT_FEEDER](state: State, feederSocket: FeederStoreState) {
    state.selectedFeederSocket = feederSocket
  },
  [types.SET_CURRENT_POWER_PACK](state: State, powerPack: PowerPackState) {
    state.currentPowerPack = powerPack
  },
  [types.SET_TURNOUT_DIRECTION](state: State, payload: RailStoreState) {
    let index = state.rails.findIndex(e => e.name === payload.name)
    if (index >= 0) {
      state.rails[index].conductionState = payload.conductionState
    }
  },
  [types.SET_GAP](state: State, gapSockets: string[]) {
    state.gapSockets = gapSockets
  },
  // [types.SET_LAYOUT_DATA](state: State, layoutData: LayoutData) {
  //   state.layoutData = layoutData
  // },
  [types.SET_PALETTE](state: State, palette: string) {
    state.currentPalette = palette
  },
  [types.SET_PALETTE_ITEM](state: State, item: PaletteItem) {
    state.paletteItemId = item.id
  },
  [types.SET_PERMIT_RAIL_INTERSECTION](state: State, value: boolean) {
    state.permitRailIntersection = value
  },
  [types.SET_RAIL_ANGLE](state: State, value: number) {
    state.railAngle = value
  },
  addPowerPack (state: State, powerPack: PowerPackState) {
    state.powerPacks.push(powerPack)
  },

  setEditorMode(state: State, mode: EditorMode) {
    state.editorMode = mode
  },

  updatePowerPack(state: State, powerPack: PowerPackState) {
    let index = state.powerPacks.findIndex(e => e.name === powerPack.name)
    if (index < 0) {
      throw new Error(`PowerPack named ${powerPack.name} not found.`)
    }
    Vue.set(state.powerPacks, index, powerPack)

    powerPack.feeders.forEach(feeder => {
      let index = state.feederSockets.findIndex(e => e.name === feeder.name)
      if (index >= 0) {
        Vue.set(state.feederSockets, index, feeder)
      }
    })
  },
}) as MutationTree<State>


