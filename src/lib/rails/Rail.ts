/**
 * Created by tozawa on 2017/07/03.
 */
import {sprintf} from "sprintf-js";
import {Joint, JointDirection} from "src/lib/parts/Joint";
import {FeederSocket} from "src/lib/parts/FeederSocket";
import logger from "../../logging";
import {Group, Point, Rectangle} from "paper";
import {RailPart} from "src/lib/parts/RailPart";
import {GapSocket} from "src/lib/parts/GapSocket";
import {Storable} from "./Storable";

const log = logger("Rail");

export interface RailStoreState {
  name: string
  conductionState: number
  conductionTable: Array<Array<number>>
}

/**
 * レールの基底クラス。レールはレールパーツとジョイントにより構成される。
 * 単独ではなく、継承されて使用される想定。
 */
export class Rail implements Storable<RailStoreState> {

  // レール間の間隔
  static SPACE = 38;
  // ジョイントの位置とレールパーツの両端の位置の間で許される誤差
  static JOINT_TO_RAIL_PART_TOLERANCE = 0.1;

  private _angle: number;
  private _pathGroup: Group;

  private _railParts: RailPart[] = [];
  // private joints: Joint[] = [];
  // private feederSockets: FeederSocket[] = [];
  // private gapSockets: GapSocket[] = [];

  private _conductionTable: Array<Array<number>> = [
    [0]
  ]
  // 現在の導電状態
  private _conductionState: number = 0;


  /**
   * レールの初期化。基底クラスでは特に重要な処理は行わない。
   * 子クラスではここでレールパーツの追加と移動・回転を行う。
   * @param {RailPart} railParts
   * @param {string} name
   */
  constructor(railParts: RailPart[], name: string) {
    this._angle = 0;
    this._pathGroup = new Group()

    railParts.forEach((part, i) => this.addRailPart(part, i));

    // IDを設定
    this.name = name;
    this.enableJoints()
    this.enableFeederSockets(false)
    this.enableGapSockets(false)
  }

  get angle(): number {
    return this._angle;
  }

  get pathGroup(): Group {
    return this._pathGroup;
  }

  set pathGroup(value: Group) {
    this._pathGroup = value;
  }

  /**
   * 通電状態と通電しているレールパーツのインデックスのリストをエントリとするテーブル。
   * @returns {Array<Array<number>>}
   */
  get conductionTable(): Array<Array<number>> {
    return this._conductionTable;
  }

  set conductionTable(value: Array<Array<number>>) {
    this._conductionTable = value;
  }

  /**
   * 通電状態
   * @returns {number}
   */
  get conductionState(): number {
    return this._conductionState;
  }

  set conductionState(value: number) {
    this._conductionState = value;
  }

  /**
   * このレールを構成するレールパーツのリスト
   * @returns {RailPart[]}
   */
  get railParts(): RailPart[] {
    return this._railParts;
  }

  /**
   * ジョイントのリスト
   * @returns {Joint[]}
   */
  get joints(): Joint[] {
    let joints = this.railParts.flatMap(part => part.joints)
    return joints.filter((item, pos) => joints.indexOf(item) == pos)
  }

  /**
   * フィーダーソケットのリスト
   * @returns {FeederSocket[]}
   */
  get feederSockets(): FeederSocket[] {
    return this.railParts.map(part => part.feederSocket).filter(Boolean)
  }

  /**
   * ギャップソケットのリスト
   * @returns {GapSocket[]}
   */
  get gapSockets(): GapSocket[] {
    return this.joints.map(j => j.gapSocket)
  }

  /**
   * このレールオブジェクトに付けられる一意の名前。IDと同じ。
   * レールを構成する各パーツにも設定する。
   * @returns {string}
   */
  get name() {
    return this._pathGroup.name;
  }
  set name(name: string) {
    this._pathGroup.name = name;
    this.railParts.forEach((part, i) => part.name = `${this.name}p${i}`);
    this.joints.forEach((j, i) => j.name = `${this.name}j${i}`);
    this.feederSockets.forEach((f, i) => f.name = `${this.name}f${i}`);
    this.gapSockets.forEach((g, i) => g.name = `${this.name}g${i}`);
  }

  /**
   * レールの開始点
   * @returns {"paper".Point}
   */
  get startPoint(): Point { return this.railParts[0].startPoint; }

  /**
   * レールの開始点のジョイント
   * @returns {Joint}
   */
  get startJoint(): Joint {
    return this.railParts[0].joints[0];
  }

  /**
   * レール全体のバウンディングボックス
   * @returns {Rectangle}
   */
  get bounds(): Rectangle {
    return this._pathGroup.bounds
  }


  /**
   * このレールの透明度を設定する
   * @param {number} value
   */
  set opacity(value: number) {
    // this.pathGroup.opacity = value
    this.railParts.forEach(e => e.opacity = value);
    this.joints.forEach(e => e.opacity = value);
    this.feederSockets.forEach(e => e.opacity = value);
    this.gapSockets.forEach(e => e.opacity = value);
  }

  /**
   * このレールの表示・非表示を設定する。
   * @param {boolean} value
   */
  set visible(value: boolean) {
    // this.pathGroup.visible = value
    this.railParts.forEach(e => e.visible = value);
    this.joints.forEach(e => e.visible = value);
    // TODO: FeederとGapの扱いはこれでいいか
    // this.feederSockets.forEach(e => e.visible = value);
    // this.gapSockets.forEach(e => e.visible = value);
  }

  get storeState(): RailStoreState {
    return {
      name: this.name,
      conductionState: this._conductionState,
      conductionTable: this._conductionTable
    }
  }

  set storeState(state: RailStoreState) {
    if (this.name !== state.name) {
      throw new Error('Rail name does not match')
    }
    this._conductionState = state.conductionState
    this._conductionTable = state.conductionTable
  }


  /**
   * 任意のジョイントを基準に、絶対座標で移動する。
   * @param {Point} point 移動先の座標
   * @param {Point,Joint} anchor 基準とする座標またはジョイント
   */
  move(point: Point, anchor: Point|Joint) {
    if (anchor instanceof Joint) {
      anchor = anchor.position;
    }
    let difference = point.subtract(anchor);
    this.moveRelatively(difference);
  }

  /**
   * 現在からの相対座標で移動する。
   * @param {Point} difference 移動先の現在位置に対する相対座標
   */
  moveRelatively(difference: Point) {
    this.railParts.forEach(part => {
      part.moveRelatively(difference);
    });
    this.joints.forEach(joint => {
      joint.moveRelatively(difference);
    });
    this.feederSockets.forEach(feeder => {
      feeder.moveRelatively(difference);
    });
    this.gapSockets.forEach(gap => {
      gap.moveRelatively(difference);
    });
  }

  /**
   * 任意のジョイントを中心に、X軸から時計回りの絶対角度で回転する。
   * @param {number} angle 回転角度
   * @param {Point,Joint} anchor 基準とするジョイント
   */
  rotate(angle: number, anchor: Point|Joint) {
    if (anchor instanceof Joint) {
      anchor = anchor.position;
    }
    let relAngle = angle - this._angle;
    this.rotateRelatively(relAngle, anchor);
  }

  /**
   * 任意のジョイントを中心に、X軸から時計回りで現在からの相対角度で回転する。
   * @param {number} angle 回転角度
   * @param {Point,Joint} anchor 基準とするジョイント
   */
  rotateRelatively(angle: number, anchor: Point|Joint) {
    if (anchor instanceof Joint) {
      anchor = anchor.position;
    }
    this.railParts.forEach(part => {
      part.rotateRelatively(angle, <Point>anchor)
    });
    this.joints.forEach(j => {
      j.rotateRelatively(angle, <Point>anchor);
    })
    this.feederSockets.forEach(f => {
      f.rotateRelatively(angle, <Point>anchor);
    })
    this.gapSockets.forEach(g => {
      g.rotateRelatively(angle, <Point>anchor);
    })
    this._angle += angle;
  }

  /**
   * 任意のジョイントに対して接続する。
   * @param {Joint} fromJoint こちら側のジョイント
   * @param {Joint} toJoint 接続先のジョイント
   * @param {boolean} isDryRun
   */
  connect(fromJoint: Joint, toJoint: Joint, isDryRun: boolean = false) {

    this.move(toJoint.position, fromJoint);
    let angle = toJoint.direction - fromJoint.direction + 180;

    log.debug(sprintf("Rotate %.3f around (%.3f, %.3f)",
      angle, toJoint.position.x, toJoint.position.y));

    this.rotateRelatively(angle, toJoint);
    fromJoint.connect(toJoint, isDryRun);
  }

  /**
   * このレールに属する全てのジョイントを切断する。
   */
  disconnect() {
    this.joints.forEach(j => j.disconnect());
  }

  /**
   * このレールを削除する。
   */
  remove() {
    this.disconnect();
    this.railParts.forEach(elem => elem.remove());
    this.joints.forEach(elem => elem.remove());
    this.feederSockets.forEach(elem => elem.remove());
    this.gapSockets.forEach(elem => elem.remove());
  }

  /**
   * 指定されたパスがこのレールに属するものか否かを返す。
   * @param {Path} path
   * @returns {boolean}
   */
  containsPath(path) {
    return !!this.railParts.find(elem => elem.path.id === path.id)
      || !!this.joints.find(elem => elem.path.id === path.id);
    // this.railParts.forEach( elem => log.debug(elem.path.id + " " + path.id));
  }

  /**
   * 導電状態をトグルスイッチ的に変更する。
   */
  toggleSwitch() {
    let numStates = Object.keys(this._conductionTable).length;
    this._conductionState = (this._conductionState + 1) % numStates;
    this.switch(this._conductionState);
  }

  /**
   * 導電状態を変更する。
   * @param state
   */
  switch(state) {
    let numStates = Object.keys(this._conductionTable).length;
    if (state > numStates) {
      log.error("No conduction state", state);
      return;
    }
    this._conductionState = state;
  }

  /**
   * レールパーツの両端のジョイントを取得する。開始点、終了点の順に取得される。
   * @param {RailPart} railPart
   * @returns {Array<Joint>}
   */
  getJointsFromRailPart(railPart) {
    let ret = null;
    console.log(railPart.startPoint, railPart.endPoint);
    let startJoint = this.joints.find(j => this._isReasonablyClose(j.position, railPart.startPoint));
    let endJoint = this.joints.find(j => this._isReasonablyClose(j.position, railPart.endPoint));
    if (startJoint && endJoint) {
      return [startJoint, endJoint];
    }
  }

  /**
   * 現在の導電状態で導電しているレールパーツを取得する。
   * @returns {Array<RailPart>}
   */
  getConductiveRailParts(): RailPart[] {
    return this._conductionTable[this._conductionState].map(index => this.railParts[index])
  }

  /**
   * 現在の導電状態で導電しており、かつ指定のジョイントに接しているレールパーツを取得する。
   * @param {Joint} joint
   * @returns {RailPart}
   */
  getConductiveRailPartOfJoint(joint: Joint): RailPart {
    let ret = this.getConductiveRailParts().find(part => {
      return joint.position.isClose(part.startPoint, 0.1) || joint.position.isClose(part.endPoint, 0.1);
    });
    return ret;
  }

  /**
   * 拡大縮小を行う。
   * @param hor
   * @param ver
   */
  scale(hor, ver, center = this.bounds.center) {
    this.railParts.forEach(rp => rp.scale(hor, ver, center));
    this.joints.forEach(j => j.scale(hor, ver, center));
    this.feederSockets.forEach(f => f.scale(hor, ver, center));
    this.gapSockets.forEach(g => g.scale(hor, ver, center));
  }

  /**
   * 電流のアニメーションを行う。
   * @param event
   */
  animate(event) {
    this.railParts.forEach(rp => rp.animate(event));
  }

  /**
   * ジョイントの検出を有効化する。
   */
  enableJoints(value: boolean = true) {
    this.joints.forEach(j => j.visible = value)
    this.joints.forEach(j => j.enabled = value)
  }

  /**
   * フィーダーの検出を有効化する。
   */
  enableFeederSockets(value: boolean = true) {
    this.feederSockets.forEach(f => f.visible = value)
    this.feederSockets.forEach(f => f.enabled = value)
  }

  /**
   * ギャップの検出を有効化する。
   */
  enableGapSockets(value: boolean = true) {
    this.gapSockets.forEach(g => g.visible = value)
    this.gapSockets.forEach(g => g.enabled = value)
  }

  /**
   * レールを構成するレールパーツを追加し、さらにその両端にジョイントを追加する。
   * Constructorからのみ呼ばれることを想定。
   * @param {RailPart} railPart
   * @param {number} index
   */
  private addRailPart(railPart: RailPart, index: number) {
    // レールパーツをパスグループの一番下に追加する
    this._pathGroup.insertChild(0, railPart.path);

    // ジョイントが重複して存在しないか確認しつつ、レールパーツにジョイントを追加する
    // ジョイントにはギャップソケットを追加する
    // 始点のジョイント
    let startJoint = this._getJointAt(railPart.startPoint);
    if (!startJoint) {
      startJoint = new Joint(railPart.startPoint, railPart.startAngle, JointDirection.REVERSE_TO_ANGLE, this);
      startJoint.gapSocket = new GapSocket(startJoint)
    }
    railPart.joints.push(startJoint);

    // 終点のジョイント
    let endJoint = this._getJointAt(railPart.endPoint);
    if (!endJoint) {
      endJoint = new Joint(railPart.endPoint, railPart.endAngle, JointDirection.SAME_TO_ANGLE, this);
      endJoint.gapSocket = new GapSocket(endJoint)
    }
    railPart.joints.push(endJoint);

    // ジョイントはレールパーツの上に描画する
    this._pathGroup.addChild(startJoint.path)
    this._pathGroup.addChild(endJoint.path)

    // レールパーツにフィーダーソケットを追加する
    // FIXME: 多分これだとレールパーツが複数で一部がフィーダーソケットを持たないときにバグる
    if (railPart.hasFeederSocket) {
      railPart.feederSocket = new FeederSocket(railPart)
      this._pathGroup.addChild(railPart.feederSocket.path)
    }

    // レールオブジェクトの参照を入れておく
    railPart.rail = this;
    this._railParts.push(railPart);
  }

  /**
   * 与えられた座標にジョイントが存在するか否かを返す。
   * @param {Point} point
   * @returns {boolean}
   * @private
   */
  private _getJointAt(point: Point): Joint {
    return this.joints.find(jo => jo.position.isClose(point, 0.1));
  }

  /**
   * ジョイントのペアから、両者を繋ぐレールパーツを取得する。
   * @param {Joint} joint1
   * @param {Joint} joint2
   * @returns {*}
   * @private
   */
  private _getRailPartFromJoints(joint1, joint2) {
    let parts = this.railParts.filter(part => {
      return (joint1.position.isClose(part.startPoint, 0.1) && joint2.position.isClose(part.endPoint, 0.1))
        || (joint2.position.isClose(part.startPoint, 0.1) && joint1.position.isClose(part.endPoint, 0.1))
    });
    if (parts.length === 1) {
      return parts[0];
    } else if (parts.length > 1) {
      log.warn("Multiple rail part found on 2 joints");
    } else {
      log.warn("No rail part found on 2 joints");
    }
    return null;
  }

  /**
   * 2点が十分に近いことを示す。
   * ジョイントがレールパーツの両端のいずれかに存在するか調べるときに使う。
   * @param point1
   * @param point2
   * @return {Boolean}
   * @private
   */
  private _isReasonablyClose(point1, point2) {
    return point1.isClose(point2, Rail.JOINT_TO_RAIL_PART_TOLERANCE);
  }

  /**
   * ジョイント情報を表示する。デバッグ用。
   */
  showJoints() {
    this.joints.forEach(joint => {
      joint.showInfo();
    });
  }

}

