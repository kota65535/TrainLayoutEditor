/**
 * Created by tozawa on 2017/07/12.
 */
import {FeederSocket, FeederState, FlowDirection} from "./rails/parts/FeederSocket";
import {Rail} from "./rails/Rail";
import logger from "../logging";
import {GapSocket, GapState} from "./rails/parts/GapSocket";
import {Store} from "vuex";
import {State} from "../store/state";

let log = logger("LayoutEditorStoreProxy");

export interface RailStoreState {
  name: string
  conductionState: number
  conductionStateSize: number
}

export interface FeederStoreState {
  name: string
  power: number
  direction: FlowDirection
}


export class LayoutEditorStoreProxy {
  store: Store<State>

  constructor(store: Store<State>) {
    this.store = store
  }

  commitRails (rails: Rail[]) {
    this.store.commit('SET_RAIL', rails.map(r => {
      return {
        name: r.name,
        conductionState: r.conductionState,
        conductionStateSize: r.conductionMap.length
      } as RailStoreState
    }))
  }

  commitFeeders (feeders: FeederSocket[]) {
    this.store.commit('SET_FEEDER', feeders.map( f => {
      return {
        name: f.name,
        // TODO: set power
        power: 0,
        direction: f.flowDirection
      } as FeederStoreState
    }))
  }

  commitFeedersSelected (feeder: FeederSocket) {
    this.store.commit('SELECT_FEEDER', {
      name: feeder.name,
      // TODO: set power
      power: 0,
      direction: feeder.flowDirection
    } as FeederStoreState)
  }

  commitGaps(gaps: GapSocket[]) {
    // this.store
  }
}
