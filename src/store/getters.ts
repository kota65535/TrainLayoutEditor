import {GetterTree} from "vuex";
import {State} from "./state";
import {BuilderPaletteData, RunnerPaletteData} from "../lib/PaletteItem";

export const getBuilderPaletteData = (state: State): BuilderPaletteData => {
  return state.builderPaletteData
}

export const getRunnerPaletteData =  (state: State): RunnerPaletteData => {
  return {
    feeders: state.feederSockets,
    turnouts: state.rails.filter(r => r.conductionTable.length > 1).map(t => {
      return {
        name: t.name,
        conductionState: t.conductionState,
        options: (t.conductionTable).map(ind => {
          return {
            text: `${ind}`,
            value: ind
          }
        })
      }
    }),
    powerPacks: state.powerPacks,
    switchers: state.switchers
  }
}


export default ({
  getBuilderPaletteData,
  getRunnerPaletteData
}) as GetterTree<State, any>
