import * as types from './mutation-types'
import {ActionTree} from "vuex";
import {PowerPackState, State} from "./state";
import {PaletteItem} from "../lib/PaletteItem";
import {FeederStoreState, RailStoreState} from "../lib/LayoutEditorStoreProxy";
import LayoutAPI from "../apis/layout";
import GoogleAPI from "../apis/google";


export const setSignInStatus = ({ commit }: any, isSignedIn: boolean) => {
  commit(types.SET_SIGNIN_STATUS, isSignedIn)
}


export const setFeederDirection = ({ commit }, state: FeederStoreState) => {
  commit(types.SET_FEEDER_FLOW_DIRECTION, state)
}

export const setTurnoutDirection = ({ commit }, state: RailStoreState) => {
  commit(types.SET_TURNOUT_DIRECTION, state)
}

export default {
  setSignInStatus,
  setFeederDirection,
  setTurnoutDirection,

  setPaletteItem ({ commit }: any, item: PaletteItem) {
    commit(types.SET_PALETTE_ITEM, item)
    commit(types.SET_EDITOR_MODE, item.mode)
  },

  /**
   * パワーパックのパワーを更新する。
   * @param {any} commit
   * @param {PowerPackState} state
   */
  setPowerPackPower ({ commit }, state: PowerPackState) {
    LayoutAPI.setPowerPackPower(GoogleAPI.getCurrentUser(), state.id, state.power)
    commit('updatePowerPack', state)
  },

  /**
   * パワーパックの電流方向を更新する。
   * @param {any} commit
   * @param {PowerPackState} state
   */
  setPowerPackDirection ({ commit }, state: PowerPackState) {
    LayoutAPI.setPowerPackDirection(GoogleAPI.getCurrentUser(), state.id, state.power)
    commit('updatePowerPack', state)
  }
} as ActionTree<State, any>
