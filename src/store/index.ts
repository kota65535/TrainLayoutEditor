import Vue from 'vue'
import Vuex, {StoreOptions} from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import createLogger, {LoggerOption} from 'vuex/dist/logger'
import {State} from "./state";
import {INITIAL_BUILDER_PALETTE_DATA} from "../constants";

Vue.use(Vuex)

const state: State = {
  paletteItemId: null,
  editorMode: null,
  isSignedIn: false,
  fileInfo: {
    fileName: "",
    fileId: "",
    folderName: "",
    folderId: ""
  },
  layoutData: {
    nextRailId: 0,
    rails: [],
    feeders: [],
    gaps: []
  },
  permitRailIntersection: undefined,

  // Tool Bar
  railAngle: 0,

  // Palette
  currentPalette: "builder-palette",
  rails: [],
  feederSockets: [],
  gapSockets: [],

  // Builder Palette
  builderPaletteData: INITIAL_BUILDER_PALETTE_DATA,

  // Runner Palette
  powerPacks: [],
  selectedFeederSocket: null,
  currentPowerPack: null,
  switchers: [],
  selectedTurnout: null,
  currentSwitcher: null,

  flowDirectionTable: null,
}

export default new Vuex.Store<State>({
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations,
  plugins: process.env.NODE_ENV !== 'production' ?
    [createLogger({collapsed: false} as LoggerOption<State>)] : [],
  strict: true
} as StoreOptions<State>)
