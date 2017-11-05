/**
 * Created by tozawa on 2017/07/12.
 */
import {Feeder} from "./Feeder";
import logger from "src/logging";
import {DetectionState} from "src/lib/parts/primitives/DetectablePart";
import {createCirclePath} from "src/lib/parts/primitives/CirclePart";
import {FlowDirection, RailPart} from "./RailPart";
import {Path, Point} from "paper";
// import {Storable} from "Storable";
import {DetectableRectPart} from "src/lib/parts/primitives/DetectableRectPart";
import {Storable} from "../rails/Storable";

let log = logger("FeederSocket");

/**
 * フィーダーの接続状態
 */
export enum FeederConnectionState {
  OPEN = 0,           // フィーダー未接続
  CONNECTING,     // フィーダー接続中
  CONNECTED       // フィーダー接続後
}

/**
 * フィーダーソケットの電流の向き
 */
export enum FeederDirection {
  START_TO_END,
  END_TO_START,
}

/**
 * Storeに格納するためのフィーダーソケットの状態
 */
export interface FeederStoreState {
  name: string
  power: number
  flowDirection: boolean
}


/**
 * レールの両端の中点に存在するフィーダー差し込み口を表すクラス。
 */
export class FeederSocket extends DetectableRectPart implements Storable<FeederStoreState> {
  static WIDTH = 8;
  static HEIGHT = 15;
  static HIT_RADIUS = 20;
  static FILL_COLORS = ["limegreen", "deepskyblue", "limegreen"];
  static OPACITIES = [0.4, 0.6];
  static TO_FLOW_DIR = {
    [FeederDirection.START_TO_END]: [
      FlowDirection.END_TO_START,
      FlowDirection.START_TO_END
    ],
    [FeederDirection.END_TO_START]: [
      FlowDirection.START_TO_END,
      FlowDirection.END_TO_START
    ]
  }

  private _railPart: RailPart;             // 所属するレールパーツ
  private _connectedFeeder: Feeder;        // 接続されたフィーダーオブジェクト
  private _direction: FeederDirection;              // フィーダーの向き
  private _polarity: boolean
  private _connectionState: FeederConnectionState;  // フィーダー接続状態
  private _power: number

  /**
   * レールパーツにフィーダー差し込み口をセットする。
   * @param {RailPart} railPart
   * @param {FeederDirection} direction
   */
  constructor(railPart: RailPart, direction: FeederDirection = FeederDirection.START_TO_END) {
    let angle = (railPart.startAngle + railPart.endAngle) / 2;
    let detector = createCirclePath(FeederSocket.HIT_RADIUS)
    super(railPart.middlePoint, angle, FeederSocket.WIDTH, FeederSocket.HEIGHT, detector, FeederSocket.FILL_COLORS, FeederSocket.OPACITIES, true);

    this._railPart = railPart
    this._direction = direction
    this._polarity = true
    this._power = 0
    this._connectedFeeder = null

    // 最初は無効で未接続状態
    this.enabled = true;
    this.connectionState = FeederConnectionState.OPEN;
    this.enabled = false;

    // console.log("FeederSocket", this.railPart.path.position);
  }

  /**
   * このフィーダーソケットが属するレールパーツ
   * @returns {RailPart}
   */
  get railPart(): RailPart { return this._railPart; }

  /**
   * 接続されているフィーダーオブジェクト
   * @returns {Feeder}
   */
  get connectedFeeder(): Feeder { return this._connectedFeeder; }
  set connectedFeeder(value: Feeder) { this._connectedFeeder = value; }

  /**
   * 接続されているフィーダーオブジェクトの向き
   * @returns {FeederDirection}
   */
  get direction(): FeederDirection { return this._direction }
  set direction(value: FeederDirection) { this._direction = value }

  /**
   * 電流の極性
   * @returns {boolean}
   */
  get polarity(): boolean { return this._polarity; }
  set polarity(value: boolean) { this._polarity = value; }

  /**
   * フィーダー接続状態
   * @returns {FeederConnectionState._connectionState}
   */
  get connectionState() { return this._connectionState; }
  set connectionState(feederState: FeederConnectionState) {
    if (this._enabled) {
      switch(feederState) {
        case FeederConnectionState.OPEN:
          this.detectionState = DetectionState.BEFORE_DETECT;
          break;
        case FeederConnectionState.CONNECTING:
          this.detectionState = DetectionState.DETECTING;
          break;
        case FeederConnectionState.CONNECTED:
          this.detectionState = DetectionState.AFTER_DETECT;
          break;
      }
      // 接続されたフィーダーがあれば同じ状態に変更する
      if (this._connectedFeeder) {
        this._connectedFeeder.state = feederState;
      }
      this._connectionState = feederState;
    }
    // this.showInfo();
  }

  get power(): number { return this._power; }
  set power(value: number) { this._power = value; }

  get enabled() { return this._enabled; }
  set enabled(isEnabled: boolean) {
    super.enabled = isEnabled;
    // 現在のフィーダー接続状態を再設定しておく
    if (isEnabled) {
      this.connectionState = this._connectionState;
    }
    // 接続されたフィーダーがあれば同じ状態に変更する
    // if (this.connectedFeeder) {
    //     this.connectedFeeder.visible = isEnabled;
    // }
  }

  /**
   * フィーダーオブジェクトの接続点
   * @returns {"paper".Point}
   */
  get feederPosition() {
    switch(this._direction) {
      case FeederDirection.START_TO_END:
        return this.getCenterOfBottom();
      case FeederDirection.END_TO_START:
        return this.getCenterOfTop();
    }
    return this.getCenterOfBottom();
  }

  /**
   * フィーダーソケットの角度。フィーダーの向きによって180度変化する。
   * @returns {number}
   */
  get angle() {
    switch(this._direction) {
      case FeederDirection.START_TO_END:
        return this._angle;
      case FeederDirection.END_TO_START:
        return this._angle - 180;
      default:
        return this._angle
    }
  }
  set angle(value: number) { this._angle = value }  // getterをオーバーライドしたらsetterもしなきゃいけない

  /**
   * 接続しているレールパーツを流れる電流の方向
   * @returns {FlowDirection}
   */
  get flowDirection(): FlowDirection {
    return FeederSocket.TO_FLOW_DIR[this.direction][this.polarity ? 1 : 0]
  }

  get storeState(): FeederStoreState {
    return {
      name: this.name,
      power: this.power,
      flowDirection: this.polarity
    }
  }

  set storeState(state: FeederStoreState) {
    if (this.name !== state.name) {
      throw new Error(`FeederSocket name does not match (${this.name} !== ${state.name})`)
    }
    if (state.power !== null) this.power = state.power
    if (state.flowDirection !== null) this.polarity = state.flowDirection
  }


  /**
   * 電流方向をトグルする。
   */
  toggleDirection() {
    this.polarity = ! this.polarity
  }

  /**
   * このソケットにフィーダーを接続する。
   * @param isDryRun
   */
  connect(isDryRun: boolean = false) {
    if (!this.isConnected()) {
      this._connectedFeeder = new Feeder(this);
    }

    if (isDryRun) {
      this.connectionState = FeederConnectionState.CONNECTING
    } else {
      this.connectionState = FeederConnectionState.CONNECTED
    }
  }

  /**
   * このソケットからフィーダーを削除する。
   */
  disconnect() {
    if (! this.isConnected()) {
      return;
    }
    this._connectedFeeder.remove();
    this.connectionState = FeederConnectionState.OPEN;
    this._connectedFeeder = null;
  }

  /**
   * フィーダーが接続されているか否かを返す。
   * @returns {boolean}
   */
  isConnected(): boolean {
    return !!this._connectedFeeder;
  }

  /**
   * 指定のパスを含むか否かを返す。
   * ソケットにフィーダーが接続されている場合、フィーダーにも含まれているか調べる。
   * @param {"paper".Path} path
   * @returns {boolean}
   */
  containsPath(path: Path): boolean {
    if (this.isConnected()) {
      return super.containsPath(path) || this._connectedFeeder.containsPath(path);
    } else {
      return super.containsPath(path);
    }
  }

  showInfo() {
    log.debug(`FeederSocket @${this._railPart.name}: enabled=${this.enabled}, state=${this.connectionState}, detect=${this.detectionState}`)
  }
}
