import * as types from './mutation-types'
import {ActionTree} from "vuex";
import {LayoutData} from "../lib/LayoutManager";
import {State} from "./state";


export const setLayoutData = ({ commit }: any, layoutData: LayoutData) => {
  commit(types.SET_LAYOUT_DATA, layoutData)
}

export const setSignInStatus = ({ commit }: any, isSignedIn: boolean) => {
  commit(types.SET_SIGNIN_STATUS, isSignedIn)
}


export default {
  setLayoutData,
  setSignInStatus
} as ActionTree<State, any>
