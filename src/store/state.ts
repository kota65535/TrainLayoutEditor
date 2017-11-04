import {LayoutData} from "../lib/LayoutManager";
import {PaletteItem, BuilderPaletteData, EditorMode} from "../lib/PaletteItem";
import {FeederSocket, FeederDirection, FeederStoreState} from "../lib/rails/parts/FeederSocket";
import {RailStoreState} from "../lib/rails/Rail";
import {FlowDirectionTable} from "../lib/LayoutSimulator";

export interface State {
  paletteItemId: string|null
  editorMode: EditorMode|null
  layoutData: LayoutData
  fileInfo: FileInfo
  // authContext: AuthContext
  isSignedIn: boolean
  currentPalette: string
  permitRailIntersection: boolean
  railAngle: number
  builderPaletteData: BuilderPaletteData

  rails: RailStoreState[];            // レイアウトを構成するレールのID
  feederSockets: FeederStoreState[];  // フィーダーがささっている差込口のID
  gapSockets: string[];               // ギャップがささっている差込口
  powerPacks: PowerPackState[]

  selectedFeederSocket: FeederStoreState
  selectedRailName: string
  currentPowerPack: PowerPackState

  flowDirectionTable: FlowDirectionTable

  switchers: SwitcherState[]
  currentSwitcher: string
}


export interface FileInfo {
  fileName: string;
  fileId: string;
  folderName: string;
  folderId: string;
}

export interface AuthContext {
  userName: string
  accessToken: string
}

export interface PowerPackState {
  id: number
  name: string
  power: number
  direction: boolean
  feeders: FeederStoreState[]
}

export interface SwitcherState {
  id: number
  name: string
  direction: number
  stateMap: Array<Array<number>>
  turnouts: RailStoreState[]
}
