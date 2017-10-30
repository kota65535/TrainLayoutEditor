/**
 * Created by tozawa on 2017/07/12.
 */
import {FeederSocket} from "./rails/parts/FeederSocket";
import {Rail} from "./rails/Rail";
import logger from "../logging";
import {GapSocket} from "./rails/parts/GapSocket";
import {Store} from "vuex";
import {State} from "../store/state";
import {EditorMode} from "./PaletteItem";
import {FlowDirectionTable} from "./LayoutSimulator";

let log = logger("LayoutEditorStoreProxy");


export class LayoutEditorStoreProxy {
  store: Store<State>

  constructor(store: Store<State>) {
    this.store = store
  }

  commitRails (rails: Rail[]) {
    this.store.commit('SET_RAIL', rails.map(r => r.storeState))
  }

  commitFeeders (feeders: FeederSocket[]) {
    this.store.commit('SET_FEEDER', feeders.map( f => f.storeState))
  }

  commitFeedersSelected (feeder: FeederSocket) {
    this.store.commit('SELECT_FEEDER', feeder.storeState)
  }

  commitSetEditorMode (mode: EditorMode) {
    this.store.commit('setEditorMode', mode)
  }

  commitGaps(gaps: GapSocket[]) {
    // this.store
  }

  commitFlowDirectionTable(table: FlowDirectionTable) {
    this.store.commit('setFlowDirectionTable', table)
  }
}
