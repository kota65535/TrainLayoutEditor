import * as types from './mutation-types'
import {FileInfo, PowerPackState, State} from "./state";
import {MutationTree} from "vuex";
import {PaletteItem} from "../lib/PaletteItem";
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
  [types.SET_FEEDER_FLOW_DIRECTION](state: State, payload: FeederStoreState) {
    let index = state.feederSockets.findIndex(e => e.name === payload.name)
    if (index >= 0) {
      state.feederSockets[index].direction = payload.direction
    }
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
    state.paletteItem = item
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
}) as MutationTree<State>


