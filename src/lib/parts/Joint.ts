/**
 * Created by tozawa on 2017/07/03.
 */

import {createCirclePath} from "src/lib/parts/primitives/CirclePart";
import logger from "src/logging";
import {DetectionState} from "src/lib/parts/primitives/DetectablePart";
import {Point} from "paper";
import {GapSocket} from "./GapSocket";
import {DetectableRectPart} from "./primitives/DetectableRectPart";
import {Rail} from "../rails/Rail";

let log = logger("Joint");

/**
 * ジョイントの状態。
 */
export enum JointState {
  OPEN,               // 未接続
  CONNECTING_FROM,    // 接続試行中(こちらから)
  CONNECTING_TO,      // 接続試行中(相手から)
  CONNECTED           // 接続後
}

/**
 * 接続方向とジョイントの向きの関係を指定するための識別子。
 */
export enum JointDirection {
  SAME_TO_ANGLE,      // ジョイントの描画上の向きとジョイントの接続方向は同じ
  REVERSE_TO_ANGLE    // ジョイントの描画上の向きとジョイントの接続方向は逆
}

/**
 * レールのジョイントを表現するクラス
 * 検出領域は丸
 */
export class Joint extends DetectableRectPart {
  static WIDTH = 8;
  static HEIGHT = 16;
  static HIT_RADIUS = 20;
  static FILL_COLORS = ["darkorange", "deepskyblue", "grey"];
  static OPACITIES = [0.4, 0.6];
  static SHRINKING_RATE = 0.7;


  private _direction: JointDirection;     // 接続方向
  private _jointState: JointState;        // 接続状態
  connectedJoint: Joint | null;

  _currentScale: number;
  private _rail: Rail;
  private _gapSocket: GapSocket;


  get position() {
    switch (this._direction) {
      case JointDirection.SAME_TO_ANGLE:
        return this.getCenterOfRight();
      case JointDirection.REVERSE_TO_ANGLE:
        return this.getCenterOfLeft();
    }
    return this.getCenterOfRight();
  }

  get enabled() { return this._enabled; }
  set enabled(isEnabled: boolean) {
    super.enabled = isEnabled;
    // 現在のジョイント接続状態を再設定しておく
    if (isEnabled) {
      this.jointState = this._jointState;
    }
  }

  get rail(): Rail { return this._rail; }
  set rail(value: Rail) { this._rail = value; }

  get gapSocket(): GapSocket { return this._gapSocket; };
  set gapSocket(gapSocket: GapSocket) { this._gapSocket = gapSocket; };


  /**
   * 接続方向の角度を取得する。
   */
  get direction(): number {
    switch (this._direction) {
      case JointDirection.SAME_TO_ANGLE:
        return this.angle;
      case JointDirection.REVERSE_TO_ANGLE:
        return this.angle + 180;
    }
    return this.angle;
  }

  // ジョイントの接続状態。外部から変更する必要は殆ど無い。
  get jointState(): JointState { return this._jointState; }
  set jointState(state: JointState) { this._setJointState(state); }

  /**
   * ジョイントを指定の位置・角度で作成する。
   * @param {Point} position 位置
   * @param {number} angle X軸に対する絶対角度
   * @param {JointDirection} direction 接続方向
   * @param {Rail} rail ジョイントが属するレールオブジェクト
   */
  constructor(position: Point, angle: number, direction: JointDirection, rail: any) {
    let circlePosition = new Point(Joint.WIDTH/2, 0);
    switch (direction) {
      case JointDirection.SAME_TO_ANGLE:
        circlePosition = new Point(Joint.WIDTH/2, 0);
        break;
      case JointDirection.REVERSE_TO_ANGLE:
        circlePosition = new Point(-Joint.WIDTH/2, 0);
        break;
    }
    let detector = createCirclePath(Joint.HIT_RADIUS)
    detector.position = circlePosition
    super(position, angle, Joint.WIDTH, Joint.HEIGHT, detector, Joint.FILL_COLORS, Joint.OPACITIES, true);


    this._direction = direction;
    this.connectedJoint = null;
    this._rail = rail;
    this._jointState = JointState.OPEN;
    this._currentScale = 1;

    this._gapSocket = null;

    this.move(position, this.position);
    this.rotate(angle, this.position);

    // 最初は有効かつ未接続状態から開始
    this.enabled = true;
    this.disconnect();
  }

  // this.positionをオーバーライドしているので、これもオーバーライドする必要がある・・・
  move(position: Point, anchor: Point = this.position): void {
    super.move(position, anchor);
  }

  rotateRelatively(difference: number, anchor: Point = this.position) {
    super.rotateRelatively(difference, anchor);
  }

  rotate(angle: number, anchor: Point = this.position) {
    let relAngle = angle - this.angle;
    this.rotateRelatively(relAngle, anchor);
  }

  /**
   * 指定のジョイントと接続する。
   * @param joint
   * @param isDryRun
   */
  connect(joint: Joint, isDryRun: boolean = false) {
    this.connectedJoint = joint;
    joint.connectedJoint = this;
    if (isDryRun) {
      this.jointState = JointState.CONNECTING_FROM;
      joint.jointState = JointState.CONNECTING_TO;
    } else {
      this.jointState = JointState.CONNECTED;
      joint.jointState = JointState.CONNECTED;
    }
  }

  /**
   * 接続中のジョイントと切断する。
   */
  disconnect() {
    if (this.connectedJoint) {
      this.connectedJoint.jointState = JointState.OPEN;
      this.connectedJoint.connectedJoint = null;
    }
    this.jointState = JointState.OPEN;
    this.connectedJoint = null;
  }

  isConnected(): boolean {
    return !!this.connectedJoint;
  }

  /**
   * ジョイントを削除する。
   */
  remove() {
    this.disconnect();
    super.remove();
  }

  /**
   * 状態を設定し、ジョイントの色、サイズを変更する。
   * @param state
   * @private
   */
  private _setJointState(state: JointState) {
    switch(state) {
      case JointState.OPEN:
        this.detectionState = DetectionState.BEFORE_DETECT;
        this.unshrink();
        break;
      case JointState.CONNECTING_FROM:
        this.detectionState = DetectionState.DETECTING;
        this.unshrink();
        break;
      case JointState.CONNECTING_TO:
        this.detectionState = DetectionState.DETECTING;
        this.unshrink();
        break;
      case JointState.CONNECTED:
        this.detectionState = DetectionState.AFTER_DETECT;
        this.shrink();
        break;
    }
    this._jointState = state;

    this.showInfo();
  }

  /**
   * ジョイントに接続後、お互い接続方向に幅を縮める（合体するようなイメージ）
   */
  shrink() {
    if (this._currentScale === 1) {
      this._scaleHorizontally(Joint.SHRINKING_RATE);
      this._currentScale = Joint.SHRINKING_RATE;
    }
  }

  unshrink() {
    if (this._currentScale !== 1) {
      this._scaleHorizontally(1/Joint.SHRINKING_RATE);
      this._currentScale = 1;
    }
  }

  /**
   * angle=0 時の水平方向に拡大・縮小する。
   */
  private _scaleHorizontally(value: number) {
    let angle = this.angle;
    this.rotate(0, this.position);
    this.scale(value, 1, this.position);
    this.rotate(angle, this.position);
  }

  showInfo() {
    log.debug(`Joint @${this.name}: enabled=${this.enabled}, state=${this._jointState}, detect=${this.detectionState}`)
  }
}
