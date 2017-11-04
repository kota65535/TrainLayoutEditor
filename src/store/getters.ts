import {GetterTree} from "vuex";
import {State} from "./state";
import {BuilderPaletteData, RunnerPaletteData} from "../lib/PaletteItem";
import {RailStoreState} from "../lib/rails/Rail";



export default ({
  getBuilderPaletteData (state: State): BuilderPaletteData {
    return state.builderPaletteData
  },
  getRunnerPaletteData (state: State): RunnerPaletteData {
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
  },
  selectedRail (state: State): RailStoreState {
    let rail = state.rails.find(r => r.name === state.selectedRailName)
    if (rail) {
      return rail
    } else {
      return {
        name: "",
        conductionState: 0,
        conductionTable: []
      }
    }
  }
}) as GetterTree<State, any>
