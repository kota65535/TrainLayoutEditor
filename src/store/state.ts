import {LayoutData} from "../lib/LayoutManager";
import {PaletteItem, BuilderPaletteData, EditorMode} from "../lib/PaletteItem";
import {FeederStoreState, RailStoreState} from "../lib/LayoutEditorStoreProxy";
import {FeederSocket, FeederDirection} from "../lib/rails/parts/FeederSocket";

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

  rails: RailStoreState[];          // レイアウトを構成するレールのID
  feederSockets: FeederStoreState[];  // フィーダーがささっている差込口のID
  gapSockets: string[];     // ギャップがささっている差込口
  powerPacks: PowerPackState[]

  selectedFeederSocket: FeederStoreState
  currentPowerPack: PowerPackState
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
  direction: FeederDirection
  feeders: FeederStoreState[]
}
