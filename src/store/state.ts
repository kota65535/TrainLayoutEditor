import {LayoutData} from "../lib/LayoutManager";
import {PaletteItem, BuilderPaletteData} from "../lib/PaletteItem";
import {FeederStoreState, RailStoreState} from "../lib/LayoutEditorStoreProxy";

export interface State {
  paletteItem: PaletteItem|null
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
