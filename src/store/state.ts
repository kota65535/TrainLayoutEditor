import {LayoutData} from "../lib/LayoutManager";
import {PaletteItem, BuilderPaletteData, PaletteItemType} from "../lib/PaletteItem";
import {FeederStoreState, RailStoreState} from "../lib/LayoutEditorStoreProxy";
import {FeederSocket, FlowDirection} from "../lib/rails/parts/FeederSocket";

export interface State {
  paletteItem: PaletteItem|null
  editorMode: PaletteItemType
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
  name: string
  power: number
  direction: FlowDirection
  feeders: FeederSocket[]
}
