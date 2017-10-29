<template>
  <section class="tool-bar">
    <b-navbar toggleable="md" type="dark" variant="info" fixed="bottom">

      <b-nav is-nav-bar>
        <b-button type="button" class="navbar-btn" @click="openBuildPalette">Build</b-button>
        <b-button type="button" class="navbar-btn" @click="openRunPalette">Run</b-button>
      </b-nav>

      <b-nav-form id="angle-form">
        <label class="ml-2 mr-1">Angle: </label>
        <b-form-input class="col-6" type="text" v-model="angle"></b-form-input>
      </b-nav-form>

      <b-nav-text class="cursor-position">X: {{ 140 }} </b-nav-text>
      <b-nav-text class="cursor-position">Y: {{ 200 }} </b-nav-text>

    </b-navbar>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import {Prop, Watch} from 'vue-property-decorator'
  import FileSaveDialog from './FileSaveDialog.vue'
  import GoogleAPI from '../apis/google'
  import {FileInfo} from "../store/state"
  import {Action, Getter, State} from "vuex-class"

  @Component
  export default class ToolBar extends Vue {

    angle: number = 0

    @Watch('angle')
    onAngleChanged (value: string) {
      let intValue = parseInt(value)
      if (intValue) {
        this.$store.commit('SET_RAIL_ANGLE', intValue)
      }
    }

    openBuildPalette () {
      this.$store.commit('SET_PALETTE', "builder-palette")
    }

    openRunPalette () {
      this.$store.commit('SET_PALETTE', "runner-palette")
    }
  }

</script>

<style type="scss">
  @import "../css/app.scss";
  @import "../css/editor-view.scss";

  .tool-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    /*height: $editor-nav-height;*/
  }

  .navbar-btn {
    margin-right: 10px;
  }

  #angle-form {
    width: 150px !important;
  }

  .navbar-text.cursor-position {
    margin-right: 5px;
    margin-left: 5px;
    width: 70px;
  }

</style>
