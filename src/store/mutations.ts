import Vue from 'vue'
import * as types from './mutation-types'
import {FileInfo, State} from "./state";
import {MutationTree} from "vuex";
import {LayoutData} from "../lib/LayoutManager";

export default ({
  [types.SET_SIGNIN_STATUS](state: State, isSignedIn: boolean) {
    state.isSignedIn = isSignedIn
  },
  [types.SET_FILE_INFO](state: State, fileInfo: FileInfo) {
    state.fileInfo = fileInfo
  },
  [types.SET_LAYOUT_DATA](state: State, layoutData: LayoutData) {
    state.layoutData = layoutData
  },
}) as MutationTree<State>


