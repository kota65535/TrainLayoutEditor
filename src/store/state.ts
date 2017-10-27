import {LayoutData} from "../lib/LayoutManager";

export interface State {
  paletteItem: any|null
  layoutData: LayoutData
  fileInfo: FileInfo
  // authContext: AuthContext
  isSignedIn: boolean
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
