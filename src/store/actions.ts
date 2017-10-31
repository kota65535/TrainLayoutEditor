import * as types from './mutation-types'
import {ActionTree} from "vuex";
import {PowerPackState, State, SwitcherState} from "./state";
import {PaletteItem} from "../lib/PaletteItem";
import LayoutAPI from "../apis/layout";
import GoogleAPI from "../apis/google";
import {FeederStoreState} from "../lib/rails/parts/FeederSocket";
import {RailStoreState} from "../lib/rails/Rail";


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

  /**
   * パレットアイテムおよびエディターモードを更新する
   * @param {any} commit
   * @param {PaletteItem} item
   */
  setPaletteItem ({ commit }: any, item: PaletteItem) {
    commit(types.SET_PALETTE_ITEM, item)
    commit('setEditorMode', item.mode)
  },

  /**
   * パワーパックを追加する。
   * @param {any} commit
   * @param {PowerPackState} state
   */
  addPowerPack ( { commit }, state: PowerPackState) {
    LayoutAPI.addPowerPack(GoogleAPI.getCurrentUser(), state.id)
    commit('addPowerPack', state)
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
  },

  /**
   * スイッチを追加する。
   * @param {any} commit
   * @param {SwitcherState} state
   */
  addSwitcher ( { commit }, state: SwitcherState) {
    LayoutAPI.addSwitcher(GoogleAPI.getCurrentUser(), state.id)
    commit('addSwitcher', state)
  },

  /**
   * スイッチの方向を更新する。
   * @param {any} commit
   * @param {SwitcherState} state
   */
  setSwitcherDirection({ commit }, state: SwitcherState) {
    LayoutAPI.setSwitcherDirection(GoogleAPI.getCurrentUser(), state.id, state.direction)
    commit('updateSwitcher', state)
  }


} as ActionTree<State, any>
