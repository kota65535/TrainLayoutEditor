/**
 * Created by tozawa on 2017/07/12.
 */
import {RectPart} from "./primitives/RectPart";
import {Feeder} from "./Feeder";
import logger from "../../../logging";
import {DetectablePart, DetectionState} from "./primitives/DetectablePart";
import {CirclePart} from "./primitives/CirclePart";
import {RailPart} from "./RailPart";
import {Path} from "paper";
import {FeederStoreState} from "../../LayoutEditorStoreProxy";

let log = logger("FeederSocket");

/**
 * フィーダーの接続状態
 */
export enum FeederConnectionState {
  OPEN,           // フィーダー未接続
  CONNECTING,     // フィーダー接続中
  CONNECTED       // フィーダー接続後
}

/**
 * フィーダーソケットの電流の向き
 */
export enum FeederDirection {
  NONE,           // 電流なし。レールパーツに対して使用され、フィーダー自体には使用されない
  START_TO_END,
  END_TO_START,
  ILLEGAL
}


/**
 * レールの両端の中点に存在するフィーダー差し込み口を表すクラス。
 */
export class FeederSocket extends DetectablePart {
  // 定数
  static WIDTH = 6;
  static HEIGHT = 12;
  static HIT_RADIUS = 20;
  static FILL_COLORS = ["limegreen", "deepskyblue", "limegreen"];
  static OPACITIES = [0.2, 0.4];

  private _railPart: RailPart;             // 所属するレールパーツ
  private _connectedFeeder: Feeder;        // 接続されたフィーダーオブジェクト
  private _direction: FeederDirection;              // フィーダーの向き
  private _connectionState: FeederConnectionState;  // フィーダー接続状態
  private _power: number

  /**
   * レールパーツにフィーダー差し込み口をセットする。
   * @param {RailPart} railPart
   * @param {FeederDirection} direction
   */
  constructor(railPart: RailPart, direction: FeederDirection = FeederDirection.START_TO_END) {
    let angle = (railPart.startAngle + railPart.endAngle) / 2;
    let rect = new RectPart(railPart.middlePoint, angle,
      FeederSocket.WIDTH, FeederSocket.HEIGHT, FeederSocket.FILL_COLORS[0]);
    let circle = new CirclePart(railPart.middlePoint, angle, FeederSocket.HIT_RADIUS, FeederSocket.FILL_COLORS[0]);
    super(railPart.middlePoint, angle, rect, circle, FeederSocket.FILL_COLORS, FeederSocket.OPACITIES, false);

    this._railPart = railPart;
    this._direction = direction;
    this._connectedFeeder = null;

    // 最初は無効で未接続状態
    this.enabled = true;
    this.connectionState = FeederConnectionState.OPEN;
    this.enabled = false;
    // this._setFeederState(FeederState.OPEN);

    // console.log("FeederSocket", this.railPart.path.position);
  }

  get railPart(): RailPart { return this._railPart; }
  set railPart(value: RailPart) { this._railPart = value; }

  get connectedFeeder(): Feeder { return this._connectedFeeder; }
  set connectedFeeder(value: Feeder) { this._connectedFeeder = value; }

  get direction(): FeederDirection { return this._direction }
  set direction(value: FeederDirection) { this._direction = value }

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
    this.showInfo();
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

  // 主パーツはRectPartであることが分かっているのでキャストする
  get basePart(): RectPart { return <RectPart>this.parts[0]; }

  // フィーダー(Feederオブジェクトそのもの)の接続点
  get feederPosition() {
    switch(this._direction) {
      case FeederDirection.START_TO_END:
        return this.basePart.getCenterOfBottom();
      case FeederDirection.END_TO_START:
        return this.basePart.getCenterOfTop();
    }
    return this.basePart.getCenterOfBottom();
  }

  // フィーダーの向きによって角度は変わる
  get angle() {
    switch(this._direction) {
      case FeederDirection.START_TO_END:
        return this.basePart.angle;
      case FeederDirection.END_TO_START:
        return this.basePart.angle - 180;
    }
  }

  get storeState(): FeederStoreState {
    return {
      name: this.name,
      power: this.power,
      direction: this.direction
    }
  }

  set storeState(state: FeederStoreState) {
    if (this.name !== state.name) {
      throw new Error(`FeederSocket name does not match (${this.name} !== ${state.name})`)
    }
    if (state.power) this.power = state.power
    if (state.direction) this.direction = state.direction
  }


  /**
   * 電流方向をトグルする。
   */
  toggleDirection() {
    switch(this._direction) {
      case FeederDirection.START_TO_END:
        this._direction = FeederDirection.END_TO_START;
        break;
      case FeederDirection.END_TO_START:
        this._direction = FeederDirection.START_TO_END;
        break;
    }
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
