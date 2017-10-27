<template>
  <section class="menu-bar">
    <b-navbar toggleable="md" type="dark" variant="info">

      <b-nav-toggle target="nav_collapse"></b-nav-toggle>

      <b-collapse is-nav id="nav_collapse">
        <b-nav is-nav-bar>
          <b-nav-item-dropdown text="File">
            <b-dropdown-item @click="onFileNew">New</b-dropdown-item>
            <b-dropdown-item @click="onFileOpen">Open</b-dropdown-item>
            <b-dropdown-item @click="onFileSaveAs">Save As...</b-dropdown-item>
            <b-dropdown-item @click="onFileSave" v-show="this.fileInfo.fileId">Save</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-nav>

        <b-nav is-nav-bar>
          <b-nav-item-dropdown text="Edit">
            <b-dropdown-item @click="onFileNew">New</b-dropdown-item>
            <b-dropdown-item @click="onFileOpen">Open</b-dropdown-item>
            <b-dropdown-item @click="onFileSaveAs">Save As...</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-nav>

        <!-- Right aligned nav items -->
        <b-nav is-nav-bar class="ml-auto">
          <b-nav-item v-if="!this.isSignedIn" @click="signIn" href="#">Login</b-nav-item>
          <b-nav-item v-else @click="signOut" href="#">Logout</b-nav-item>
        </b-nav>

      </b-collapse>
    </b-navbar>

    <file-save-dialog ref="file-new" title="New File" :onOK="onFileNewOK"></file-save-dialog>
    <file-save-dialog ref="file-save-as" title="Save File" :onOK="onFileSaveAsOK"></file-save-dialog>

  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import {Prop, Watch} from 'vue-property-decorator'
  import FileSaveDialog from './FileSaveDialog'
  import GoogleAPI from '../apis/google'
  import {FileInfo} from "../store/state"
  import {Action, Getter, State} from "vuex-class"

  @Component({
    components: {
      FileSaveDialog
    },
  })
  export default class MenuBar extends Vue {

    get text() {
      return this.$store.state.fileContent
    }
    set text(value) {
      this.$store.dispatch('setFileContent', value)
    }

    @State('fileInfo')
    fileInfo: FileInfo

    @State('isSignedIn')
    isSignedIn: boolean

    onFileNew() {
      (<FileSaveDialog>this.$refs['file-new']).show();
    }

    onFileNewOK(fileInfo: FileInfo) {
      GoogleAPI.createFile(fileInfo.fileName, [fileInfo.folderId])
        .then(resp => {
          this.$store.dispatch('setFileInfo', {
            fileId: resp.result.id,
            fileName: resp.result.name,
            folderId: fileInfo.folderId,
            folderName: fileInfo.folderName
          })
        });
    }

    onFileOpen() {
      GoogleAPI.showFilePicker((pickerEvent) => {
        if (pickerEvent.action === "picked") {
          let file = pickerEvent.docs[0];
          GoogleAPI.downloadFile(file.id)
            .then(resp => {
              this.$store.dispatch('setFileContent', resp.body)
            }, resp => {
              console.log('Failed')
            });
          GoogleAPI.getFilePath(file.parentId)
            .then(path => {
              this.$store.dispatch('setFileInfo', {
                fileId: file.id,
                fileName: file.name,
                folderId: file.parentId
              })
            });
        }
      })
    }

    onFileSaveAs() {
      (<FileSaveDialog>this.$refs['file-save-as']).show();
    }

    onFileSaveAsOK(fileInfo: FileInfo) {
      GoogleAPI.createFile(fileInfo.fileName, [fileInfo.folderId])
        .then(resp => {
          GoogleAPI.updateFile(resp.result.id, this.text)
            .then(resp => {
              this.$store.dispatch('setFileInfo', {
                fileId: resp.result.id,
                fileName: resp.result.name,
                folderId: fileInfo.folderId,
                folderName: fileInfo.folderName
              })
            }, resp => {
            })

        });
    }

    onFileSave() {
      GoogleAPI.updateFile(this.fileInfo.fileId, this.text)
        .then(resp => {
          console.log("Saved")
        }, resp => {
        })
    }

    signIn() {
      GoogleAPI.signIn(null);
    }

    signOut() {
      GoogleAPI.signOut();
    }

  }

</script>

<style type="scss">
  @import "../css/app.scss";

  .form1 {
    margin-top: 100px;
  }
</style>
