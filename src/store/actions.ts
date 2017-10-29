import * as types from './mutation-types'
import {ActionTree} from "vuex";
import {State} from "./state";
import {PaletteItem} from "../lib/PaletteItem";
import {FeederStoreState, RailStoreState} from "../lib/LayoutEditorStoreProxy";


export const setSignInStatus = ({ commit }: any, isSignedIn: boolean) => {
  commit(types.SET_SIGNIN_STATUS, isSignedIn)
}

export const setPaletteItem = ({ commit }: any, item: PaletteItem) => {
  commit(types.SET_PALETTE_ITEM, item)
}

export const setFeederPower = ({ commit }, state: FeederStoreState) => {
  commit(types.SET_FEEDER_FLOW_POWER, state)
}


export const setFeederDirection = ({ commit }, state: FeederStoreState) => {
  commit(types.SET_FEEDER_FLOW_DIRECTION, state)
}


export const setTurnoutDirection = ({ commit }, state: RailStoreState) => {
  commit(types.SET_TURNOUT_DIRECTION, state)
}

export default {
  setSignInStatus,
  setPaletteItem,
  setFeederPower,
  setFeederDirection,
  setTurnoutDirection
} as ActionTree<State, any>
