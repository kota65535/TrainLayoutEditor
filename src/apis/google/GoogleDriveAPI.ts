import FileResource = gapi.client.drive.FileResource;
import HttpRequest = gapi.client.HttpRequest;
import FileListResource = gapi.client.drive.FileListResource;

export class GoogleDriveAPI {

    apiKey: string;
    accessToken: string|null

    constructor(apiKey: string, accessToken: string|null) {
        this.apiKey = apiKey;
        this.accessToken = accessToken;

    }

    init() {
      return new Promise((resolve, reject) => {
        gapi.load('picker', () => {
          resolve()
        });
      })
    }

    setAccessToken(accessToken: string) {
        this.accessToken = accessToken;
    }

    /**
     * フォルダーの表示・選択が可能なPickerを表示する。
     * @param parent
     * @param callback
     */
    showFolderPicker(parent: string, callback: Function) {
        let foldersOnlyView = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
            .setParent(parent)      // これを付けないと全ての階層のフォルダが列挙される
            .setIncludeFolders(true)
            .setSelectFolderEnabled(true);

        let pickerBuilder = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.MINE_ONLY)
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .addView(foldersOnlyView)
            .setTitle('Select a folder')
            .setOAuthToken(this.accessToken!)
            .setDeveloperKey(this.apiKey)
            .setCallback(callback);


        let pickerInstance = pickerBuilder.build();

        pickerInstance.setVisible(true);
    }

    /**
     * ドキュメントの表示・選択が可能なPickerを表示する。
     * @param parent
     * @param callback
     */
    showFilePicker(parent: string|null, callback: Function) {
        // ファイルとフォルダー両方を表示し、ファイルの選択が可能なビュー
        let docsView = new google.picker.DocsView()
            .setIncludeFolders(true)

        // ファイルとフォルダー両方の表示・選択が可能なビュー
        // let docsView= new google.picker.DocsView()
        //     .setIncludeFolders(true)
        //     .setSelectFolderEnabled(true);

        if (parent) {
            docsView.setParent(parent);
        }

        let pickerBuilder = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.MINE_ONLY)
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            // .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            .addView(docsView)
            // .addView(docsAndFoldersView)
            .setOAuthToken(this.accessToken!)
            .setDeveloperKey(this.apiKey)
            .setCallback(callback);


        let pickerInstance = pickerBuilder.build();

        pickerInstance.setVisible(true);
    }

    /**
     * ファイルのリストを取得する。
     * @returns {Promise}
     * @see https://developers.google.com/drive/v3/reference/files/list
     */
    listFiles(): HttpRequest<FileListResource> {
        return gapi.client.drive.files.list({
            'pageSize': 10,
            'fields': "nextPageToken, files(id, name)"
        })
    }

    /**
     * ファイル情報を取得する。
     * @param {String} fileId
     * @param {String} fields
     * @returns {Promise}
     * @see https://developers.google.com/drive/v3/reference/files/get
     */
    getFile(fileId: string, fields: string): HttpRequest<FileResource> {
        return gapi.client.drive.files.get({
            fileId: fileId,
            fields: fields
        })
    }

    /**
     * ファイルをダウンロードする。
     * @param {string} fileId
     * @returns {Promise}
     */
    downloadFile(fileId: string): HttpRequest<FileResource> {
        return gapi.client.drive.files.get({
            fileId: fileId,
            alt: "media"
        })
    }


    /**
     * 指定されたファイル・フォルダのRootに対する階層を取得する。
     * Google Driveでは同一フォルダに同名のファイル・フォルダが存在でき、一意なパスというものは無いため
     * あくまでParentをRootまで辿っていった階層であることに留意。
     * @param {string} fileId
     * @returns {Promise}
     */
    getFilePath(fileId: string): Promise<string> {
        let loop = (fid: string, result: string[]): Promise<string> => {
            return this.getFile(fid, "id,name,parents")
                .then(resp => {
                    result.unshift(resp.result.name);
                    if (resp.result.parents) {
                        return loop(resp.result.parents[0], result);
                    } else {
                        return resp.result.name;
                    }
                })
        };
        let titles: string[] = [];
        return new Promise((resolve, reject) => {
            loop(fileId, titles)
                .then(() => {
                    resolve(titles.join("/"));
                });
                // .catch(() => {
                //     reject();
                // })
        });
    }


    /**
     * 既存のファイルの内容を更新する。
     * @param {string} fileId
     * @param {string} content
     * @returns {Promise}
     */
    updateFile(fileId: string, content: string): HttpRequest<any> {
        return gapi.client.request({
            path: '/upload/drive/v3/files/' + fileId,
            method: 'PATCH',
            params: {
                uploadType: 'media'
            },
            body: content
        })
    }

    /**
     * 空のファイルを作成する。
     * ファイルの中身を更新するにはupdateFileを呼ぶ必要がある。
     * @param {string} fileName
     * @param {string} mimeType
     * @param {Array<string>} parents
     * @returns {Promise}
     */
    createFile(fileName: string, mimeType: string, parents: string[]) {
        let metadata = <any>{
            mimeType: mimeType,
            name: fileName,
            fields: 'id'
        };

        if (parents) {
            (<any>metadata).parents = parents;
        }

        return gapi.client.drive.files.create({
            resource: metadata
        })
    }


    createFolder(folderName: string, parents: string[]) {
        return this.createFile(folderName, 'application/vnd.google-apps.folder', parents);
    }

    /**
     * リクエストを作成する
     * @param method
     * @param url
     * @returns {Promise}
     * @private
     */
    _makeRequest (method: string, url: string) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            let status: number;
            xhr.open(method, url);
            xhr.setRequestHeader('Authorization', 'Bearer ' + this.accessToken);
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.onload = () => {
                if (status >= 200 && status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = () => {
                reject({
                    status: status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
    }
}

