import {GetterTree} from "vuex";
import {State} from "./state";
import {BuilderPaletteData, RunnerPaletteData} from "../lib/PaletteItem";
import * as _ from 'lodash'

export const getBuilderPaletteData = (state: State): BuilderPaletteData => {
  return state.builderPaletteData
}

export const getRunnerPaletteData =  (state: State): RunnerPaletteData => {
  return {
    feeders: state.feederSockets,
    turnouts: state.rails.filter(r => r.conductionStateSize > 1).map(t => {
      return {
        name: t.name,
        conductionState: t.conductionState,
        options: _.range(t.conductionStateSize).map(ind => {
          return {
            text: `${ind}`,
            value: ind
          }
        })
      }
    })
  }
}


export default ({
  getBuilderPaletteData,
  getRunnerPaletteData
}) as GetterTree<State, any>
