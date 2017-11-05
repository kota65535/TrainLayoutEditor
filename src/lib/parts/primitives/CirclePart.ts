import {sprintf} from "sprintf-js";
import {Color, Path, Point} from "paper";
import {SinglePart} from "./SinglePart";


export function createCirclePath(radius: number) {
  let pathData = sprintf("M 0 0 A %f,%f 0 0,1 %f %f A %f %f 0 0,1 %f %f Z",
    radius, radius,
    2 * radius, 0,
    radius, radius,
    0, 0);
  let path = new Path(pathData)
  path.position = path.position.subtract(new Point(radius, 0))
  return path
}


/**
 * 円形パーツの基底クラス。
 */
export class CirclePart extends SinglePart {

  radius: number;

  /**
   * 円形パーツを指定の位置・角度で作成する。
   * @param {Point} position  中心点の位置
   * @param {number} angle    X軸に対する絶対角度
   * @param {number} radius   半径
   * @param {Color} fillColor 色
   */
  constructor(position: Point, angle: number, radius: number, fillColor: string) {
    let path = createCirclePath(radius)
    super(position, angle, path);

    this.radius = radius;
    this.path.fillColor = fillColor;

    this.move(position, this.position);
    this.rotate(angle, this.position);
  }

  // TODO: 必要になったら作る
  // getCenterOfTop() {
  //     return this.path.curves[1].getLocationAt(this.path.curves[1].length/2).point;
  // }
  //
  // getCenterOfBottom() {
  //     return this.path.curves[4].getLocationAt(this.path.curves[4].length/2).point;
  // }
  //
  // getCenterOfLeft() {
  //     return this.path.segments[0].point
  // }
  //
  // getCenterOfRight() {
  //     return this.path.segments[3].point
  // }
}
