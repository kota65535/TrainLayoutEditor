import {Path, Point, Rectangle} from "paper";

export abstract class Part {

  abstract get path(): Path
  abstract set path(value: Path)

  abstract get angle(): number
  abstract set angle(value: number)

  abstract get name(): string
  abstract set name(name: string)

  abstract get visible(): boolean
  abstract set visible(value: boolean)

  abstract get opacity(): number
  abstract set opacity(value: number)

  /**
   * このパーツを代表する位置を返す。
   * デフォルトでは path.position === path.bounds.center を指す。
   * 変更したい場合はオーバーライドすること
   * @returns {"paper".Point}
   */
  abstract get position(): Point
  abstract get bounds(): Rectangle

  /**
   * 現在位置からの相対座標で移動する。
   * @param difference
   */
  abstract moveRelatively(difference: Point)

  /**
   * 基準点の絶対座標で移動する。
   * @param position 移動先の座標
   * @param anchor 基準点。デフォルトは現在位置
   */
  abstract move(position: Point, anchor: Point)

  /**
   * Y軸から時計回りで現在からの相対角度で回転する。
   * @param difference
   * @param anchor 回転の中心点。デフォルトは現在位置
   */
  abstract rotateRelatively(difference: number, anchor: Point)

  /**
   * Y軸から時計回りの絶対角度で回転する。
   * @param angle
   * @param anchor 回転の中心点。デフォルトは現在位置
   */
  abstract rotate(angle: number, anchor: Point)

  /**
   * パスを削除する。
   */
  abstract remove()

  /**
   * 指定されたパスがこのパーツに属するか否かを返す。
   * @param path
   * @returns if this part contains given path
   */
  abstract containsPath(path: Path): boolean

  /**
   * 拡大・縮小する。
   * @param hor
   * @param ver
   * @param {"paper".Point} center
   */

  abstract scale(hor: number, ver: number, center: Point)
}
