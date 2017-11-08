import {SinglePart} from "./SinglePart";
import {Path, Point} from "paper";

/**
 * 当たり判定による検出状態。
 */
export enum DetectionState {
  BEFORE_DETECT = 0,  // 検出前
  DETECTING,          // 検出中（カーソルが当たっている）
  AFTER_DETECT        // 検出後（クリックなどにより選択された）
}

/**
 * 可視領域以外に当たり判定を持つことができるパーツ。
 */
export abstract class DetectablePart extends SinglePart {
  protected _detectionPath: Path
  protected _detectionState: DetectionState;
  protected _enabled: boolean;
  protected _fillColors: string[];
  protected _opacities: number[];
  protected _isBasePartPersistent: boolean;

  /**
   *
   * @param {string[]} colors 3要素の、それぞれ BEFORE_DETECT, DETECTING, AFTER_DETECT 時の色を表す文字列の配列。
   * @param {number[]} opacities
   * @param {boolean} isBasePartPersistent
   */
  constructor(path: Path, detectionPath: Path,
              colors: string[], opacities: number[], isBasePartPersistent: boolean) {
    super(path)

    this._detectionPath = detectionPath
    this._fillColors = colors;
    this._opacities = opacities;
    this._isBasePartPersistent = isBasePartPersistent;

    // デフォルトで検出状態は無効
    this.enabled = true;
    this.detectionState = DetectionState.BEFORE_DETECT;
    this.enabled = false;
  }

  /**
   * 検出用のパス
   * @returns {"paper".Path}
   */
  get detectionPath(): Path { return this._detectionPath; }
  set detectionPath(value: Path) { this._detectionPath = value; }

  /**
   * 検出状態における主パーツ、検出用パーツの色のリスト
   * @returns {string[]}
   */
  get fillColors(): string[] { return this._fillColors; }
  set fillColors(value: string[]) { this._fillColors = value; }

  /**
   * BEFORE_DETECT, DETECTING 状態における検出用パーツの透過率のリスト
   * @returns {number[]}
   */
  get opacities(): number[] { return this._opacities; }
  set opacities(value: number[]) { this._opacities = value; }

  /**
   * 可視状態
   * @returns {boolean}
   */
  get visible(): boolean {
    return this.path.visible;
  }

  set visible(value: boolean) {
    this.path.visible = value;
    if (this.enabled) {
      this.detectionPath.visible = value;
    }
  }

  /**
   * 透過率
   * @returns {number}
   */
  get opacity(): number {
    return this.path.opacity;
  }

  set opacity(value: number) {
    this.path.opacity = value;
    this.detectionPath.opacity = value * this.opacities[this.detectionState]
  }

  /**
   * 検出の有効・無効状態。
   * 検出無効時には検出用パーツは表示されない。
   * 主パーツの表示は isBasePartPersistent の値による。
   *   - true : 表示される
   *   - false: 表示されない
   * @returns {boolean}
   */
  get enabled() { return this._enabled; }

  set enabled(value: boolean) {
    if (this.visible) {
      this.detectionPath.visible = value
      if (value) {
        // 有効ならば現在の状態を改めて設定
        this.detectionState = this._detectionState
      }
    }
    this._enabled = value
  }

  /**
   * 検出状態
   * @returns {DetectionState._detectionState}
   */
  get detectionState() { return this._detectionState; }
  set detectionState(state: DetectionState) {
    // 無効時はDetectionStateの変更は許可されない。
    if (this.visible && this.enabled) {
      switch (state) {
        case DetectionState.BEFORE_DETECT:
          // 当たり判定領域を半透明化
          this.detectionPath.visible = true;
          this.detectionPath.opacity = this._opacities[DetectionState.BEFORE_DETECT];
          this.detectionPath.fillColor = this.fillColors[DetectionState.BEFORE_DETECT];
          // 主パーツは色だけ変更
          this.path.fillColor = this.fillColors[DetectionState.BEFORE_DETECT];
          // 検出パーツを最前面に移動
          this.detectionPath.bringToFront();
          break;
        case DetectionState.DETECTING:
          // 当たり判定領域を半透明化
          this.detectionPath.visible = true;
          this.detectionPath.opacity = this._opacities[DetectionState.DETECTING];
          this.detectionPath.fillColor = this.fillColors[DetectionState.DETECTING];
          // 主パーツは色だけ変更
          this.path.fillColor = this.fillColors[DetectionState.DETECTING];
          // 検出パーツを最前面に移動
          this.detectionPath.bringToFront();
          break;
        case DetectionState.AFTER_DETECT:
          // 当たり判定領域を不可視（無効化）
          this.detectionPath.visible = false;
          // this.detectionPath.opacity = 0;
          this.detectionPath.fillColor = this.fillColors[DetectionState.AFTER_DETECT];
          // 主パーツは色だけ変更
          this.path.fillColor = this.fillColors[DetectionState.AFTER_DETECT];
          break;
      }
      this._detectionState = state;
    }
  }

  /**
   * 検出無効時に主パーツを表示するか否かのフラグ
   * @returns {boolean}
   */
  get isBasePartPersistent(): boolean { return this._isBasePartPersistent; }
  set isBasePartPersistent(value: boolean) { this._isBasePartPersistent = value; }

  /**
   * 現在位置からの相対座標で移動する。
   * @param difference
   */
  moveRelatively(difference: Point) {
    this.path.position = this.path.position.add(difference);
    this.detectionPath.position = this.detectionPath.position.add(difference);
  }

  /**
   * 基準点の絶対座標で移動する。
   * @param position 移動先の座標
   * @param anchor 基準点。デフォルトは現在位置
   */
  move(position: Point, anchor: Point = this.position): void {
    let difference = position.subtract(anchor);
    this.moveRelatively(difference);
  }

  /**
   * Y軸から時計回りで現在からの相対角度で回転する。
   * @param difference
   * @param anchor 回転の中心点。デフォルトは現在位置
   */
  rotateRelatively(difference: number, anchor: Point = this.position) {
    this.angle += difference;
    this.path.rotate(difference, anchor);
    this.detectionPath.rotate(difference, anchor);
  }

  /**
   * Y軸から時計回りの絶対角度で回転する。
   * @param angle
   * @param anchor 回転の中心点。デフォルトは現在位置
   */
  rotate(angle: number, anchor: Point = this.position) {
    let relAngle = angle - this.angle;
    this.rotateRelatively(relAngle, anchor);
  }

  /**
   * パスを削除する。
   */
  remove() {
    this.path.remove();
    this.detectionPath.remove();
  }

  /**
   * 指定されたパスがこのパーツに属するか否かを返す。
   * @param {"paper".Path} path
   * @returns {boolean}
   */
  containsPath(path: Path): boolean {
    return path.id === this.path.id || path.id === this.detectionPath.id
  }

  /**
   * 拡大・縮小する。
   * @param hor
   * @param ver
   * @param {"paper".Point} center
   */
  scale(hor, ver, center = this.path.position) {
    this.path.scale(hor, ver, center);
    this.detectionPath.scale(hor, ver, center);
  }
}
