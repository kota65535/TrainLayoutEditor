<template>
  <section>
    <span class="sidebar-nav">{{ name }}</span>
    <b-row>
      <b-col cols=6 class="palette-item" v-for="item in items">
        <button type="button" class="btn btn-primary btn-block" @click="onItemClicked(item)">
          <div class="item-icon">
            <canvas class="button-canvas" :ref="`${item.id}-canvas`" :id="`${item.id}-canvas`"></canvas>
          </div>
          <div class="item-title">{{ item.name }}</div>
        </button>
      </b-col>
    </b-row>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import {Prop} from 'vue-property-decorator'
  import {State} from "vuex-class"
  import {PaletteItem, EditorMode} from '../lib/PaletteItem'
  import logger from '../logging'
  import {RailFactory} from "src/lib/RailFactory"
  import paper, {Point} from "paper"

  @Component
  export default class BuilderPaletteSection extends Vue {
    @Prop()
    name: string
    @Prop()
    items: PaletteItem[]

    @State
    selectedItem: PaletteItem

    mounted () {
      let factory = new RailFactory();
      // 各パレットアイテムのアイコン描画
      this.items.forEach(item => {
        let target = `${item.id}-canvas`
        paper.setup(target);
        let canvas = this.$refs[target][0]

        switch (item.mode) {
          case EditorMode.RAIL:
            let rail = factory[item.id]();
            let bounds = rail.getBounds();
            let center = new Point((<any>canvas).clientWidth / 2, (<any>canvas).clientHeight / 2);
            rail.move(center, bounds.center);
            rail.scale(0.4, 0.4, center);
            break;
        }
      });
    }

    onItemClicked (item: PaletteItem) {
      this.$store.dispatch('setPaletteItem', item)
    }
  }
</script>

<style lang="scss" scoped>
  @import "../css/app.scss";

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
