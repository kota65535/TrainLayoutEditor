<template>
  <b-modal v-model="visible"
           :title="title"
           @ok="handleOK"
  >

    <b-form-group label="Save As:" label-for="file-name">
      <b-form-input id="file-name"
                    type="text"
                    placeholder="Enter file name"
                    v-model="fileName">
      </b-form-input>
    </b-form-group>

    <b-form-group label="Where:" label-for="folder-name">
      <b-row>
        <b-col cols=10>
          <input type="text"
                 class="form-control"
                 id="folder-name"
                 :value="folderName"
                 @focus="onSelectFolder"
                 placeholder="Click to select folder"
          >
        </b-col>
        <b-col cols=2>
          <button id="reset-folder" type="button" class="btn btn-primary" @click="onResetFolder"><i class="fa fa-home" aria-hidden="true"></i></button>
        </b-col>

      </b-row>
    </b-form-group>

  </b-modal>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import {Model, Prop, Watch} from 'vue-property-decorator'
  import GoogleAPI from '../apis/google'

  @Component
  export default class FileSaveDialog extends Vue {
    fileName: string = "";
    folderId: string = "root";
    folderName: string = "My Drive";

    @Model('change')
    visible: boolean

    @Prop()
    title: string

    @Prop()
    onOK: (any) => void;

    show() {
      this.visible = true;
    }

    hide() {
      this.visible = false;
    }

    private onSelectFolder () {
      GoogleAPI.showFolderPicker((pickerEvent) => {
        if (pickerEvent.action === "picked") {
          this.folderId = pickerEvent.docs[0].id;

          // 擬似的なファイルパスを取得する
          GoogleAPI.getFilePath(this.folderId)
            .then(path => {
              this.folderName = path
            });
        }
      });
    }

    private onResetFolder() {
      this.folderId = "root"
      this.folderName = "My Drive"
    }

    private handleOK() {
      this.onOK({
        fileName: this.fileName,
        folderId: this.folderId,
        folderName: this.folderName
      })
    }
  }
</script>
