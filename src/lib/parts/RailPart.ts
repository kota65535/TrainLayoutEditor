/**
 * Created by tozawa on 2017/07/03.
 */
import {sprintf} from "sprintf-js";
import {FeederSocket} from "./FeederSocket";
import logger from "src/logging";
import {Path, Point} from "paper";
import {DetectablePart} from "src/lib/parts/primitives/DetectablePart";
import {Joint} from "./Joint";
import {Rail} from "../rails/Rail";

let log = logger("RailPart");

/**
 * レールパーツのコンストラクタでアンカー点を指定するための識別子。
 * 始点または終点が指定可能。
 * @type {{START: Symbol, END: Symbol}}
 */
export enum RailPartAnchor {
  START,
  END
}

export enum FlowDirection {
  NONE,
  START_TO_END,
  END_TO_START,
  ILLEGAL
}


/**
 * レールパーツの基底クラス。全てのレールは複数のレールパーツとジョイントにより構成される。
 * 単独ではなく、継承されて使用される想定。
 * 検出領域は四角形（y軸方向のみ）
 */
export abstract class RailPart extends DetectablePart {
  static WIDTH = 15;
  static MARGIN = 6;
  static FLOW_COLOR_1 = "royalblue";
  static FLOW_COLOR_2 = "greenyellow";
  static ANIMATION_MAX = 30
  static ANIMATION_MIN = 60
  static FILL_COLORS = [ 'black', 'deepskybule', 'black']
  static OPACITIES = [0.5, 0.5, 0]

  private _hasFeederSocket: boolean;
  private _flowDirection: FlowDirection;

  // 後から設定される
  private _rail: Rail;
  private _joints: Joint[];
  private _feederSocket: FeederSocket;


  /**
   * レールパーツの初期化。基底クラスでは特に重要な処理は行わない。
   * 子クラスで必ず移動、回転を行うこと。
   * @param {boolean} hasFeederSocket
   */
  constructor(point: Point, angle: number, path: Path, detectionPath: Path, hasFeederSocket: boolean) {
    super(point, angle, path, detectionPath, RailPart.FILL_COLORS, RailPart.OPACITIES, true)
    this.startAngle = 0;

    this._hasFeederSocket = hasFeederSocket;
    this._flowDirection = FlowDirection.NONE;
    this._joints = [];
    this._feederSocket = null;
  }

  /**
   * フィーダーソケットを有するか否か
   * @returns {boolean}
   */
  get hasFeederSocket(): boolean { return this._hasFeederSocket; }

  /**
   * このレールパーツが属するレール
   * @returns {Rail}
   */
  get rail(): Rail { return this._rail; }
  set rail(value: Rail) { this._rail = value; }

  /**
   * このレールパーツに接続されているジョイント
   * @returns {Joint[]}
   */
  get joints(): Joint[] { return this._joints; }

  /**
   * このレールパーツに接続されているジョイント
   * @returns {FeederSocket}
   */
  get feederSocket(): FeederSocket { return this._feederSocket; }
  set feederSocket(value: FeederSocket) { this._feederSocket = value; }

  /**
   * レールパーツの始点。Read Only
   * @returns {"paper".Point}
   */
  get startPoint(): Point { return this.path.segments[0].point; }

  /**
   * レールパーツの中間点。Read Only
   * @returns {"paper".Point}
   */
  get middlePoint(): Point {
    let centerOfOuterCurve = this.path.curves[1].getLocationAt(this.path.curves[1].length/2).point;
    let centerOfInnerCurve = this.path.curves[4].getLocationAt(this.path.curves[4].length/2).point;
    return centerOfOuterCurve.add(centerOfInnerCurve).divide(2);
  }

  /**
   * レールパーツの終点。Read Only
   * @returns {"paper".Point}
   */
  get endPoint(): Point { return this.path.segments[3].point; }

  /**
   * レールパーツの始点の角度
   * @returns {number}
   */
  get startAngle(): number { return this.angle };
  set startAngle(angle: number) { this.angle = angle };

  /**
   * レールパーツの終点の角度
   * @returns {number}
   */
  get endAngle(): number { return this.angle };

  /**
   * レールパーツを流れる電流の方向
   * @returns {FlowDirection._flowDirection}
   */
  get flowDirection() { return this._flowDirection; }
  set flowDirection(flowDirection: FlowDirection) { this._flowDirection = flowDirection; }

  /**
   * このレールパーツが所属するレールオブジェクト
   * @returns {Rail}
   */
  // get rail(): Rail { return this._rail; }

  /**
   * アニメーション用のレシオ
   * @returns {number}
   */
  get animationRatio(): number {
    return RailPart.ANIMATION_MIN + (RailPart.ANIMATION_MAX - RailPart.ANIMATION_MIN) * this._feederSocket.power / 255
  }

  /**
   * 基準点の絶対座標で移動する。
   * @param position 移動先の座標
   * @param anchor 基準点。デフォルトは現在位置
   */
  move(position: Point, anchor: Point|RailPartAnchor = this.position): void {
    let anchorPoint = this.getAnchorFromType(anchor)
    let difference = position.subtract(anchorPoint)
    this.moveRelatively(difference);
  }

  /**
   * Y軸から時計回りで現在からの相対角度で回転する。
   * @param difference
   * @param anchor 回転の中心点。デフォルトは現在位置
   */
  rotateRelatively(difference: number, anchor: Point|RailPartAnchor = this.position) {
    let anchorPoint = this.getAnchorFromType(anchor)
    this.angle += difference
    this.path.rotate(difference, anchorPoint)
    this.detectionPath.rotate(difference, anchorPoint)
  }

  /**
   * Y軸から時計回りの絶対角度で回転する。
   * @param angle
   * @param anchor 回転の中心点。デフォルトは現在位置
   */
  rotate(angle: number, anchor: Point|RailPartAnchor = this.position) {
    let anchorPoint = this.getAnchorFromType(anchor)
    let relAngle = angle - this.angle;
    this.rotateRelatively(relAngle, anchorPoint);
  }

  /**
   * 電流のアニメーションを行う。
   * @param event
   */
  animate(event) {
    // let ratio = event.count % this.animationRatio / this.animationRatio;
    let ratio = event.count % 60 / 60
    let currentOrigin;
    let currentDestination: Point;

    switch (this.flowDirection) {
      case FlowDirection.NONE:
        // アニメーションしない場合はレール内の最後尾に移動
        this.path.fillColor = "black";
        this.path.sendToBack()
        return;
      case FlowDirection.START_TO_END:
        currentOrigin = this.startPoint.multiply(2 - ratio).add(this.endPoint.multiply(ratio - 1));
        currentDestination = currentOrigin.add(this.endPoint.subtract(this.startPoint).multiply(2));
        // log.debug("S to E : ", currentOrigin, "=>", currentDestination);
        break;
      case FlowDirection.END_TO_START:
        currentOrigin = this.startPoint.multiply(ratio + 1).add(this.endPoint.multiply(-ratio));
        currentDestination = currentOrigin.add(this.endPoint.subtract(this.startPoint).multiply(2));
        // log.debug("E to S : ", currentOrigin, "=>", currentDestination);
        break;
      case FlowDirection.ILLEGAL:
        this.path.fillColor = "red";
        return;
    }

    this.path.fillColor = <any>{
      gradient: {
        stops: [RailPart.FLOW_COLOR_1, RailPart.FLOW_COLOR_2, RailPart.FLOW_COLOR_1, RailPart.FLOW_COLOR_2, RailPart.FLOW_COLOR_1]
      },
      origin: currentDestination,
      destination: currentOrigin,
    };
  }

  /**
   * アンカータイプをもとにアンカー点を返す。
   * デフォルトは始点。
   * @param {AnchorType} anchorType
   * @private
   */
  protected getAnchorFromType(anchorType: RailPartAnchor|Point): Point {
    if (anchorType instanceof Point) return anchorType

    let anAnchorType = anchorType || RailPartAnchor.START;
    let anchor;
    switch (anAnchorType) {
      case RailPartAnchor.START:
        anchor = this.startPoint;
        break;
      case RailPartAnchor.END:
        anchor = this.startPoint;
        anchor = this.endPoint;
        break;
      default:
        anchor = this.startPoint;
        break;
    }
    return anchor;
  }

  /**
   * 始点・始点角度、終点・終点角度を表示する。デバッグ用。
   */
  showInfo() {
    log.debug(sprintf("%s: (%.3f, %.3f | %.3f) -> (%.3f, %.3f | %.3f)",
      this.constructor.name, this.startPoint.x, this.startPoint.y, this.startAngle, this.endPoint.x, this.endPoint.y, this.endAngle));
  }

}
