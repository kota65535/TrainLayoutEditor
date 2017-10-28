import {LayoutData} from "../lib/LayoutManager";
import {PaletteItem} from "../lib/PaletteItem";

export interface State {
  paletteItem: PaletteItem|null
  layoutData: LayoutData
  fileInfo: FileInfo
  // authContext: AuthContext
  isSignedIn: boolean
  currentPalette: string
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
