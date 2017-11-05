/**
 * Created by tozawa on 2017/07/12.
 */
import logger from "src/logging";
import {DetectionState} from "src/lib/parts/primitives/DetectablePart";
import {Gap} from "./Gap";
import {Joint} from "./Joint";
import {Path} from "paper";
import {DetectableRectPart} from "./primitives/DetectableRectPart";
import {createCirclePath} from "./primitives/CirclePart";

let log = logger("GapSocket");

/**
 * ギャップの接続状態
 */
export enum GapConnectionState {
  OPEN = 0,       // ギャップ未接続
  CONNECTING,     // ギャップ接続中
  CONNECTED       // ギャップ接続後
}


/**
 * ギャップジョイナーは、プログラム上下記のように表現される。
 *   - ジョイントに仮想的なギャップ差込口(GapSocket)を仮定する
 *   - ギャップ差込口にギャップ(Gap)が差し込まれたジョイントをギャップジョイナーとする
 * 本クラスはこのギャップ差込口を表す。
 * ジョイントが接続された状態では、ギャップジョイナーとギャップは重なり合う状態になる。
 * この時、
 */
export class GapSocket extends DetectableRectPart {

  static WIDTH = 6;
  static HEIGHT = 20;
  static HIT_RADIUS = 20;
  static FILL_COLORS = ["red", "deepskyblue", "red"];
  static OPACITIES = [0.4, 0.4];

  private _joint: Joint;                        // 所属するジョイント
  private _connectedGap: Gap;                   // 接続されたギャップオブジェクト
  private _connectionState: GapConnectionState; // ギャップの接続状態

  /**
   * ジョイントに仮想的なギャップの差込口をセットする。
   * @param {Joint} joint
   */
  constructor(joint: Joint) {
    let detector = createCirclePath(GapSocket.HIT_RADIUS)
    // let base = new CirclePart(joint.position, 0, 5, 'black');
    // let detection = new CirclePart(joint.position, 0, GapSocket.HIT_RADIUS, GapSocket.FILL_COLORS[0]);
    super(joint.position, joint.angle, GapSocket.WIDTH, GapSocket.HEIGHT, detector, GapSocket.FILL_COLORS, GapSocket.OPACITIES, false)

    this._joint = joint;
    this._connectedGap = null;

    // 最初は無効で未接続状態
    this.enabled = true
    this.connectionState = GapConnectionState.OPEN
    this.enabled = false
  }

  /**
   * このギャップソケットが属するジョイント
   * @returns {}
   */
  get joint(): Joint { return this._joint; }
  set joint(value: Joint) { this._joint = value; }

  /**
   * 接続されているフィーダーオブジェクト
   * @returns {Gap}
   */
  get connectedGap(): Gap { return this._connectedGap; }
  set connectedGap(value: Gap) { this._connectedGap = value; }

  /**
   * ギャップ接続状態
   * @returns {GapConnectionState}
   */
  get connectionState() { return this._connectionState; }
  set connectionState(gapState: GapConnectionState) {
    if (this._enabled) {
      switch(gapState) {
        case GapConnectionState.OPEN:
          this.detectionState = DetectionState.BEFORE_DETECT;
          break;
        case GapConnectionState.CONNECTING:
          this.detectionState = DetectionState.DETECTING;
          break;
        case GapConnectionState.CONNECTED:
          this.detectionState = DetectionState.AFTER_DETECT;
          break;
      }
      // 接続されたギャップがあれば同じ状態に変更する
      if (this._connectedGap) {
        this._connectedGap.state = gapState;
      }
      this._connectionState = gapState;
    }
    this.showInfo();
  }

  get enabled() { return this._enabled; }
  set enabled(isEnabled: boolean) {
    super.enabled = isEnabled;
    // 現在のギャップ接続状態を再設定しておく
    if (isEnabled) {
      this.connectionState = this._connectionState
    }
    // 接続されたギャップがあれば同じ状態に変更する
    // if (this.connectedGap) {
    //     this.connectedGap.visible = isEnabled;
    // }
  }

  /**
   * このソケットにギャップを接続する。
   * @param isDryRun
   */
  connect(isDryRun: boolean = false) {
    if (!this.isConnected()) {
      this._connectedGap = new Gap(this);
    }

    if (isDryRun) {
      this.connectionState = GapConnectionState.CONNECTING
    } else {
      this.connectionState = GapConnectionState.CONNECTED
    }
  }

  /**
   * このソケットからギャップを削除する。
   */
  disconnect() {
    if (! this.isConnected()) {
      return;
    }
    this._connectedGap.remove();
    this.connectionState = GapConnectionState.OPEN
    this._connectedGap = null;
  }

  /**
   * ギャップが接続されているか否かを返す。
   * @returns {boolean}
   */
  isConnected(): boolean {
    return !!this._connectedGap;
  }

  /**
   * 指定のパスを含むか否かを返す。
   * ソケットにギャップが接続されている場合、ギャップにも含まれているか調べる。
   * @param {"paper".Path} path
   * @returns {boolean}
   */
  containsPath(path: Path): boolean {
    if (this.isConnected()) {
      return super.containsPath(path) || this._connectedGap.containsPath(path);
    } else {
      return super.containsPath(path);
    }
  }


  showInfo() {
    log.info(`GapSocket @${this._joint.name}: enabled=${this.enabled}, state=${this.connectionState}, detect=${this.detectionState}`);
  }
}
