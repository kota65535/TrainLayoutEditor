import Vue from 'vue'
import Vuex, {StoreOptions} from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import createLogger, {LoggerOption} from 'vuex/dist/logger'
import {State} from "./state";

Vue.use(Vuex)

const state: State = {
  paletteItem: null,
  isSignedIn: false,
  fileInfo: {
    fileName: "",
    fileId: "",
    folderName: "",
    folderId: ""
  },
  layoutData: null
}

export default new Vuex.Store<State>({
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations,
  plugins: process.env.NODE_ENV !== 'production' ?
    [createLogger({collapsed: false} as LoggerOption<State>)] : []
} as StoreOptions<State>)
