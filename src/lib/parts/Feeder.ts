/**
 * Created by tozawa on 2017/07/03.
 */

import {FeederSocket} from "./FeederSocket";
import logger from "src/logging";
import {DetectableTrianglePart} from "src/lib/parts/primitives/DetectableTrianglePart";
import {createTrianglePath} from "./primitives/TrianglePart";

let log = logger("Feeder");

/**
 * フィーダークラス。
 * このクラスはエディタ上の表示とイベントハンドリングのために存在し、フィーダーの実際の機能はFeederSocketクラスに集約している。
 * 検出領域は三角形
 */
export class Feeder extends DetectableTrianglePart {
  static WIDTH = 30
  static HEIGHT = 30
  static MARGIN_WIDTH = 10
  static MARGIN_HEIGHT = 10
  static OPACITIES = [0.5, 0.5]

  private _feederSocket: FeederSocket;

  /**
   * フィーダーを指定のフィーダーソケットに作成する。
   * @param {FeederSocket} feederSocket
   */
  constructor(feederSocket: FeederSocket) {
    let detector = createTrianglePath(Feeder.WIDTH + Feeder.MARGIN_WIDTH, Feeder.HEIGHT + Feeder.MARGIN_HEIGHT)
    super(feederSocket.feederPosition, feederSocket.angle, Feeder.WIDTH, Feeder.HEIGHT,
      detector, FeederSocket.FILL_COLORS, Feeder.OPACITIES, true)

    this._feederSocket = feederSocket;

    // フィーダーソケットのパスグループに追加
    // feederSocket.pathGroup.addChild(this.path);

    this.move(feederSocket.feederPosition, this.getCenterOfTop());

    // 有効化
    this.visible = true;
  }

  get feederSocket(): FeederSocket { return this._feederSocket; }

  set feederSocket(value: FeederSocket) {
    this._feederSocket = value;
  }

  // デバッグ用に定義
  // get visible() { return super.visible; }
  // set visible(isVisible: boolean) {
  //   super.visible = isVisible;
  //   log.debug(`Feeder @${this._feederSocket ? this._feederSocket.name : null}: visible=${this.visible}`);
  // }
}
