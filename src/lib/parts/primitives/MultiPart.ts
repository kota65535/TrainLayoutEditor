import {Group, Path, Point, Rectangle} from "paper";
import {Part} from "./Part";

export abstract class MultiPart implements Part {

  _path: Path
  _group: Group;
  _angle: number;

  get path(): Path { return this._path; }
  set path(path: Path) { this._path = path; }

  get group(): Group { return this._group; }
  set group(value: Group) { this._group = value; }

  get angle(): number { return this._angle; }
  set angle(_angle: number) { this._angle = _angle; }

  get name(): string { return this._group.name }
  set name(value: string) { this._group.name = value }

  get visible(): boolean { return this._group.visible; }
  set visible(value: boolean) { this._group.visible = value; }

  get opacity(): number { return this._group.opacity; }
  set opacity(value: number) { this._group.opacity = value; }

  get position(): Point { return this._group.position; }
  get bounds(): Rectangle { return this._group.bounds }


  constructor(position: Point, angle: number, paths: Path[]) {
    this._angle = 0
    this._path = paths[0]
    this._group = new Group();
    this._group.addChildren(paths)

    this.move(position, this.position)
    this.rotate(angle, this.position)
  }

  /**
   * 現在位置からの相対座標で移動する。
   * @param difference
   */
  moveRelatively(difference: Point) {
    this.group.position = this.group.position.add(difference);
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
    this.group.rotate(difference, anchor);
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
    this.group.remove();
  }

  /**
   * 指定されたパスがこのパーツに属するか否かを返す。
   * @param path
   * @returns if this part contains given path
   */
  containsPath(path: Path): boolean {
    return this.group.children.map(item => item.id).includes(path.id)
  }

  /**
   * 拡大・縮小する。
   * @param hor
   * @param ver
   * @param {"paper".Point} center
   */
  scale(hor, ver, center = this.group.position) {
    this.group.scale(hor, ver, center);
  }
}
