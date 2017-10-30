/**
 * Created by tozawa on 2017/07/03.
 */
import {PowerPackState} from "../store/state";
import {FeederStoreState} from "./rails/parts/FeederSocket";

export interface RunnerPaletteData {
  turnouts: any[]
  feeders: FeederStoreState[]
  powerPacks: PowerPackState[]
  // turnoutData: Turnout[]
}


export interface BuilderPaletteData {
  sections: BuilderPaletteSectionData[]
}

export interface BuilderPaletteSectionData {
  name: string;
  items: PaletteItem[];
}

export enum EditorMode {
  RAIL,
  FEEDER,
  GAP_JOINER,
  FEEDER_SELECTING
}

export interface PaletteItem {
  mode: EditorMode;
  id: string;
  name: string;
}

