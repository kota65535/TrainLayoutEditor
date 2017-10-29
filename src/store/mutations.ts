import * as types from './mutation-types'
import {FileInfo, PowerPackState, State} from "./state";
import {MutationTree} from "vuex";
import {EditorMode, PaletteItem} from "../lib/PaletteItem";
import {FeederStoreState, RailStoreState} from "../lib/LayoutEditorStoreProxy";

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
  [types.SET_FEEDER_FLOW_DIRECTION](state: State, payload: FeederStoreState) {
    let index = state.feederSockets.findIndex(e => e.name === payload.name)
    if (index >= 0) {
      state.feederSockets[index].direction = payload.direction
    }
  },
  [types.SET_CURRENT_POWER_PACK](state: State, powerPack: PowerPackState) {
    state.currentPowerPack = powerPack
  },

  [types.SET_FEEDER_FLOW_POWER](state: State, payload: FeederStoreState) {
    let index = state.feederSockets.findIndex(e => e.name === payload.name)
    if (index >= 0) {
      state.feederSockets[index].power = payload.power
    }
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
  [types.SET_EDITOR_MODE](state: State, mode: EditorMode) {
    state.editorMode = mode
  },
  [types.SET_PERMIT_RAIL_INTERSECTION](state: State, value: boolean) {
    state.permitRailIntersection = value
  },
  [types.SET_RAIL_ANGLE](state: State, value: number) {
    state.railAngle = value
  },
  [types.ADD_POWER_PACK](state: State, powerPack: PowerPackState) {
    state.powerPacks.push(powerPack)
  },

  updatePowerPack(state: State, powerPack: PowerPackState) {
    let index = state.powerPacks.findIndex(e => e.name === powerPack.name)
    if (index >= 0) {
      state.powerPacks[index] = powerPack
    }
  },
}) as MutationTree<State>


