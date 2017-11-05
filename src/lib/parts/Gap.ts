/**
 * Created by tozawa on 2017/07/03.
 */

import logger from "src/logging";
import {GapConnectionState, GapSocket} from "./GapSocket";
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
  static HIT_RADIUS = 25
  static FILL_COLORS = ['black', 'black', 'black'];
  static OPACITIES = [0.5, 0.5, 0]

  gapSocket: GapSocket;

  /**
   * ギャップを指定のギャップソケットに作成する。
   * @param {GapSocket} gapSocket
   */
  constructor(gapSocket: GapSocket) {
    let detector = createCirclePath(Gap.HIT_RADIUS)
    super(gapSocket.position, gapSocket.angle, Gap.WIDTH, Gap.HEIGHT, detector, Gap.FILL_COLORS, Gap.OPACITIES, true)

    this.gapSocket = gapSocket;

    // フィーダーソケットのパスグループに追加
    // this.gapSocket.pathGroup.addChild(this.path);

    // this.move(joint.position, this.getCenterOfTop());

    // 有効化
    this.visible = true;
    this.state = gapSocket.connectionState;
  }

  // デバッグ用に定義
  get visible() { return super.visible; }
  set visible(isVisible: boolean) {
    super.visible = isVisible;
    log.debug(`Gap @${this.gapSocket ? this.gapSocket.name : null}: visible=${this.visible}`);
  }

  set state(state: GapConnectionState) {
    // ギャップソケットの色に合わせるだけ
    this.path.fillColor = this.gapSocket.fillColors[state];
  }


}
