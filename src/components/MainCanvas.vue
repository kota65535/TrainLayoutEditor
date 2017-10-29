<template>
  <div class="main-canvas">
    <div class="container" id="editor-content-wrapper">
      <canvas id="editor-canvas" resize></canvas>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import * as paper from 'paper'
  import logger from "../logging";
  import {GridPaper} from '../lib/GridPaper'
  import {LayoutEditor} from '../lib/LayoutEditor'
  import {LayoutEditorStoreProxy} from '../lib/LayoutEditorStoreProxy'
  import {PaletteItem, PaletteItemType} from "../lib/PaletteItem";
  import {Point} from "paper";
  import {StraightRail} from "../lib/rails/StraightRail";
  import {RectPart} from "../lib/rails/parts/primitives/RectPart";
  import {Watch} from "vue-property-decorator";
  import {State} from "vuex-class"
  import {LayoutData} from "../lib/LayoutManager";
  let log = logger('MainCanvas')

  const BOARD_WIDTH = 6000;     // ボード幅
  const BOARD_HEIGHT = 4000;    // ボード高さ
  const GRID_SIZE = 70;
  const INITIAL_ZOOM = 0.7;
  const ZOOM_UNIT = 0.002;
  const AVAILABLE_ZOOM_MIN = 0.2;
  const AVAILABLE_ZOOM_MAX = 5;

  @Component
  export default class MainCanvas extends Vue {

    grid: GridPaper
    editor: LayoutEditor

    @State
    paletteItem: PaletteItem
    @State
    permitRailIntersection: boolean
    @State
    railAngle: number
    @State
    currentPalette: string

    @Watch('paletteItem')
    onSetPaletteItem () {
      this.editor.selectPaletteItem(this.paletteItem)
    }

    @Watch('permitRailIntersection')
    onSetPermitIntersection () {
      this.editor.permitRailIntersection = this.permitRailIntersection
    }

    @Watch('railAngle')
    onSetRailAngle (angle: number) {
      // 角度は左回りとする
      this.editor.gridJointsAngle = this.railAngle
    }

    @Watch('currentPalette')
    onSetPalette (palette: string) {
      if (palette === "runner-palette") {
      }
    }

    mounted () {
      paper.setup("editor-canvas")

      // レイヤー１にグリッドを描画
      this.grid = new GridPaper("editor-canvas", BOARD_WIDTH, BOARD_HEIGHT, GRID_SIZE,
        INITIAL_ZOOM, ZOOM_UNIT, AVAILABLE_ZOOM_MIN, AVAILABLE_ZOOM_MAX);

      // レイヤー２に切り替え
      new paper.Layer();

      this.editor = new LayoutEditor(this.grid, new LayoutEditorStoreProxy(this.$store));

      // 各種ハンドラの登録
      let tool = new paper.Tool();
      tool.onMouseMove = (event) => {
        this.editor.handleMouseMove(event);
        // マウスカーソル位置を通知
//        riot.control.trigger(riot.VE.EDITOR.CURSOR_POSITION_CHANGED, event.point);
      };

      tool.onMouseDown = (event) => {
        this.grid.paperOnMouseDown(event);
        this.editor.handleMouseDown(event);
      };

      tool.onMouseUp = (event) => {
        this.grid.paperOnMouseUp(event);
      };

      tool.onKeyDown = (event) => {
        this.editor.handleKeyDown(event);
      };

      tool.onKeyUp = (event) => {
        this.editor.handleKeyUp(event);
      };

      tool.onMouseDrag = (event) => {
        this.grid.paperOnMouseDrag(event);
      };

      paper.view.onFrame = (event) => {
        this.editor.handleOnFrame(event);
      };

      window.addEventListener('mousemove', (e) => {
        this.grid.windowOnMouseMove(e);
      });

      window.addEventListener('mousewheel', (e) => {
        this.grid.windowOnMouseWheel(e);
//            return false;
      }, false);

      // 子コンポーネントがマウントされてから実行する
      this.$nextTick(() => {

        this.$store.commit('SET_PERMIT_RAIL_INTERSECTION', true)
      })
    }



  }
</script>

<style lang="scss">
  #editor-content-wrapper{
    position: fixed;
    top: 50px;                  /* height of toolbar */
    left: 240px;                /* width of palette */
    max-width: 3000px;
    width: calc(100% - 240px);
    height: calc(100% - 50px);
    z-index: 9900;              /* behind of palette */
    overflow: auto;
  }
  canvas[resize] {
    width: 100%;
    height: 100%;
  }

  /*#editor-canvas {*/
    /*background: rgba(0,0,0, .2);*/
  /*}*/
</style>
