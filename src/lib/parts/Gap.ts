/**
 * Created by tozawa on 2017/07/03.
 */

import logger from "src/logging";
import {GapSocket} from "./GapSocket";
import {DetectableRectPart} from "./primitives/DetectableRectPart";
import {createCirclePath} from "./primitives/CirclePart";

let log = logger("Gap");

/**
 * ギャップクラス
 * 検出領域は丸
 */
export class Gap extends DetectableRectPart {
  static WIDTH = 6;
  static HEIGHT = 30;
  static HIT_RADIUS = 20
  static OPACITIES = [0.5, 0.5]

  private _gapSocket: GapSocket;

  /**
   * ギャップを指定のギャップソケットに作成する。
   * @param {GapSocket} gapSocket
   */
  constructor(gapSocket: GapSocket) {
    let detector = createCirclePath(Gap.HIT_RADIUS)
    super(gapSocket.position, gapSocket.angle, Gap.WIDTH, Gap.HEIGHT, detector, GapSocket.FILL_COLORS, Gap.OPACITIES, true)

    this._gapSocket = gapSocket;

    // フィーダーソケットのパスグループに追加
    // this.gapSocket.pathGroup.addChild(this.path);

    // this.move(joint.position, this.getCenterOfTop());

    // 有効化
    this.visible = true;
  }

  get gapSocket(): GapSocket {
    return this._gapSocket;
  }

  set gapSocket(value: GapSocket) {
    this._gapSocket = value;
  }
  // デバッグ用に定義
  // get visible() { return super.visible; }
  // set visible(isVisible: boolean) {
  //   super.visible = isVisible;
  //   log.debug(`Gap @${this.gapSocket ? this.gapSocket.name : null}: visible=${this.visible}`);
  // }
}
