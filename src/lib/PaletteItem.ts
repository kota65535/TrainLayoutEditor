/**
 * Created by tozawa on 2017/07/03.
 */
import {FeederStoreState} from "./LayoutEditorStoreProxy";
import {PowerPackState} from "../store/state";

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

export enum PaletteItemType {
    RAIL,
    FEEDER,
    GAP_JOINER
}

export interface PaletteItem {
    type: PaletteItemType;
    id: string;
    name: string;
}

