/**
 * Created by tozawa on 2017/08/06.
 */

import {GoogleAuthAPI} from "./GoogleAuthAPI";
import {GoogleDriveAPI} from "./GoogleDriveAPI";

var SCOPE = 'https://www.googleapis.com/auth/docs';
var API_KEY = 'AIzaSyB6Jfd-o3v5RafVjTNnkBevhjX3_EHqAlE';
var CLIENT_ID = '658362738764-9kdasvdsndig5tsp38u7ra31fu0e7l5t.apps.googleusercontent.com';
var DISCOVER_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];


export class GoogleAPIManager {

  authAPI: GoogleAuthAPI
  driveAPI: GoogleDriveAPI

  onSignInStatusChanged: ((isSignedIn: boolean) => void)

  accessToken: string | null;
  oneoffOnSignedIn: (() => void) | null;


  constructor() {
  }

  /**
   * Google API client library をロードし、初期化する。
   * @returns {Promise<any>}
   */
  init(onSignInStatusChanged: (isSignedIn: boolean) => void) {
    this.authAPI = new GoogleAuthAPI(
      API_KEY,
      CLIENT_ID,
      SCOPE,
      DISCOVER_DOCS,
      this._onSignInStatusChangedWrapper.bind(this)
    );
    this.driveAPI = new GoogleDriveAPI(
      API_KEY,
      null
    );

    this.onSignInStatusChanged = onSignInStatusChanged;
    this.accessToken = null;
    this.oneoffOnSignedIn = null;
    let self = this;
    return new Promise(
      (resolve, reject) => {
        (function waitForApi () {
          console.info('Loading Google API client...')
          if (gapi && gapi.client) {
            Promise.all([
              self.authAPI.init(),
              self.driveAPI.init()
            ]).then( () => {
              self._authorize();
              console.info('Loading Google API client finished!')
              resolve(self.isSignedIn());
            })
          } else {
            setTimeout(() => waitForApi(), 100)
            console.info('Waiting for google API client loaded...')
          }
        })()
      }
    )
  }

  /**
   * サインインする。
   * @param {function} onSignedIn サインイン成功時に呼ばれるコールバック
   */
  signIn(onSignedIn: () => void) {
    this.oneoffOnSignedIn = onSignedIn;
    this.authAPI.signIn();
  }

  signOut() {
    this.authAPI.signOut();
  }

  isSignedIn() {
    return this.authAPI.isSignedIn();
  }

  showFilePicker(callback: Function) {
    if (this.isSignedIn()) {
      this.driveAPI.showFilePicker("root", callback);
    } else {
      this.signIn(() => {
        this.driveAPI.showFilePicker("root", callback);
      })
    }
  }

  showFolderPicker(callback: Function) {
    if (this.isSignedIn()) {
      this.driveAPI.showFolderPicker("root", callback);
    } else {
      this.signIn(() => {
        this.driveAPI.showFolderPicker("root", callback);
      })
    }
  }

  getFilePath(fileId: string) {
    return this.driveAPI.getFilePath(fileId);
  }


  createFile(fileName: string, parents: Array<string>) {
    return this.driveAPI.createFile(fileName, "application/json", parents);
  }

  updateFile(fileId: string, content: string) {
    return this.driveAPI.updateFile(fileId, content);
  }

  downloadFile(fileId: string) {
    return this.driveAPI.downloadFile(fileId);
  }

  // withSignedIn(func, args) {
  //     if (this.isSignedIn()) {
  //         func.apply(args);
  //     } else {
  //         this.signIn(() => {
  //             func.apply(args);
  //         })
  //     }
  // }

  _onSignInStatusChangedWrapper(isSignedIn: boolean) {
    this._authorize();
    this.onSignInStatusChanged(isSignedIn);
    // サインイン時にコールバックが与えられていたら実行する
    if (this.oneoffOnSignedIn) {
      this.oneoffOnSignedIn();
      this.oneoffOnSignedIn = null;
    }
  }

  // 認証を行い、アクセストークンを取得する
  _authorize() {
    let user = this.authAPI.getCurrentUser();
    let isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
      console.log(user);
      this.driveAPI.setAccessToken(user.getAuthResponse().access_token);
    }
  }
}

export default new GoogleAPIManager();
