import * as types from './mutation-types'
import {ActionTree} from "vuex";
import {State} from "./state";
import {PaletteItem} from "../lib/PaletteItem";


export const setSignInStatus = ({ commit }: any, isSignedIn: boolean) => {
  commit(types.SET_SIGNIN_STATUS, isSignedIn)
}

export const setPaletteItem = ({ commit }: any, item: PaletteItem) => {
  commit(types.SET_PALETTE_ITEM, item)
}

export default {
  setSignInStatus,
  setPaletteItem
} as ActionTree<State, any>
