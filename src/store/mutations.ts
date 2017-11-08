import * as types from './mutation-types'
import {FileInfo, PowerPackState, State, SwitcherState} from "./state";
import {MutationTree} from "vuex";
import {EditorMode, PaletteItem} from "../lib/PaletteItem";
import {RailStoreState} from "../lib/rails/Rail";
import {FeederStoreState} from "src/lib/parts/FeederSocket";
import Vue from "vue";
import {FlowDirectionTable} from "../lib/LayoutSimulator";

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

  [types.SET_CURRENT_POWER_PACK](state: State, powerPack: PowerPackState) {
    state.currentPowerPack = powerPack
  },

  [types.SELECT_FEEDER](state: State, feederSocket: FeederStoreState) {
    state.selectedFeederSocket = feederSocket
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

  setEditorMode(state: State, mode: EditorMode) {
    state.editorMode = mode
  },

  addSwitcher (state: State, switcher: SwitcherState) {
    state.switchers.push(switcher)
  },

  setCurrentSwitcher(state: State, name: string) {
    state.currentSwitcherName = name
  },

  selectTurnout(state: State, rail: RailStoreState) {
    state.selectedRailName = rail.name
  },

  updateSwitcher(state: State, switcher: SwitcherState) {
    let index = state.switchers.findIndex(e => e.name === switcher.name)
    if (index < 0) {
      throw new Error(`PowerPack named ${switcher.name} not found.`)
    }
    Vue.set(state.switchers, index, switcher)

    switcher.turnouts.forEach(turnout => {
      let index = state.rails.findIndex(e => e.name === turnout.name)
      if (index >= 0) {
        Vue.set(state.rails, index, turnout)
      }
    })
  },

  updateRail(state: State, rail: RailStoreState) {
    let index = state.rails.findIndex(r => r.name === rail.name)
    if (index >= 0) {
      Vue.set(state.rails, index, rail)
    }
  },

  setFlowDirectionTable(state: State, table: FlowDirectionTable) {
    state.flowDirectionTable = table
  },

  changeCursorShape(state: State, cursorShape: string) {
    state.cursorShape = cursorShape
  },
}) as MutationTree<State>


