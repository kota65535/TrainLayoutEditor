import {Path, Point, Rectangle} from "paper";
import {Part} from "./Part";

export abstract class SinglePart implements Part {

  _path: Path;
  _angle: number;

  get path(): Path { return this._path; }
  set path(path: Path) { this._path = path; }

  get angle(): number { return this._angle; }
  set angle(_angle: number) { this._angle = _angle; }

  get name(): string { return this.path.name };
  set name(name: string) {  this.path.name = name };

  get visible(): boolean { return this.path.visible; }
  set visible(isVisible: boolean) { this.path.visible = isVisible; }

  get opacity(): number { return this.path.opacity; }
  set opacity(value: number) { this.path.opacity = value; }

  /**
   * このパーツを代表する位置を返す。
   * デフォルトでは path.position === path.bounds.center を指す。
   * 変更したい場合はオーバーライドすること
   * @returns {"paper".Point}
   */
  get position(): Point { return this.path.position; }
  get bounds(): Rectangle { return this.path.bounds }


  constructor(position: Point, angle: number, path: Path) {
    this._angle = 0

    this.path = path

    // このクラスを継承した時、これは継承先のメソッドの呼び出しになる
    // この時未初期化のメンバ変数を参照する可能性があるため、これを避ける
    // this.move(position, this.path.position);
    // this.rotate(angle, this.path.position);
  }

  /**
   * 現在位置からの相対座標で移動する。
   * @param difference
   */
  moveRelatively(difference: Point) {
    this.path.position = this.path.position.add(difference);
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
  }

  /**
   * 指定されたパスがこのパーツに属するか否かを返す。
   * @param path
   * @returns if this part contains given path
   */
  containsPath(path: Path): boolean {
    return path.id === this.path.id;
  }

  /**
   * 拡大・縮小する。
   * @param hor
   * @param ver
   * @param {"paper".Point} center
   */
  scale(hor, ver, center = this.path.position) {
    this.path.scale(hor, ver, center);
  }
}
