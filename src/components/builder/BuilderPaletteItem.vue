<template>
  <button type="button" class="btn btn-primary btn-block" @click="onItemClicked(item)">
    <div class="item-icon">
      <canvas class="button-canvas" :ref="`${item.id}-canvas`" :id="`${item.id}-canvas`"></canvas>
    </div>
    <div class="item-title">{{ item.name }}</div>
  </button>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import {Prop} from 'vue-property-decorator'
  import {State} from "vuex-class"
  import {PaletteItem, EditorMode} from '../../lib/PaletteItem'
  import logger from '../../logging'
  import RailFactory from "src/lib/RailFactory"
  import paper, {Point} from "paper"
  import {Rail} from "../../lib/rails/Rail";

  @Component
  export default class BuilderPaletteItem extends Vue {
    @Prop()
    item: PaletteItem

    mounted () {
      // 現在のProjectを取得しておく
      let currentProjectIndex = null
      if (paper.project) {
        currentProjectIndex = paper.project.index
      }

      let target = `${this.item.id}-canvas`
      paper.setup(target);
      let canvas = this.$refs[target]

      switch (this.item.mode) {
        case EditorMode.RAIL:
          let rail: Rail = RailFactory[this.item.id]();
          let center = new Point((<any>canvas).clientWidth / 2, (<any>canvas).clientHeight / 2);
          rail.move(center, rail.bounds.center);
          rail.scale(0.4, 0.4, center);
          rail.enableJoints(false)
          break;
      }

      // 現在のProjectを元に戻す
      if (currentProjectIndex) {
        paper.projects[currentProjectIndex].activate()
      }
    }

    onItemClicked (item: PaletteItem) {
      this.$store.dispatch('setPaletteItem', item)
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../css/app";

  /* for debug */
  [class*="col-"] {
    border: 1px solid #ddd;
  }

  .sidebar-nav > .sidebar-brand a {
    color: #999999;
  }

  .sidebar-nav > .sidebar-brand a:hover {
    color: #fff;
    background: none;
  }

  .palette-item {
    height: $palette-width / 2;
    background: #eee;
    padding: 10px;
  }

  .palette-item button {
    height: 100%;
  }

  .button-canvas {
    height: 100%;
    width: 100%;
  }
</style>
