/**
 * Created by tozawa on 2017/07/03.
 */
import {FeederStoreState} from "./LayoutEditorStoreProxy";

export interface RunnerPaletteData {
  turnouts: any[]
  feeders: FeederStoreState[]
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

