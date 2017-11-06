/**
 * Created by tozawa on 2017/07/03.
 */
import {sprintf} from "sprintf-js";
import {RailPart, RailPartAnchor} from "./RailPart";
import {Point} from "paper";
import {createRectPath} from "./primitives/RectPart";

/**
 * 直線レールパーツ。
 */
export class StraightRailPart extends RailPart {

  length: number;

  /**
   * 指定された始点、始点角度、長さで直線レールパーツを生成する。
   * @param {Point} point the point where the rail parts begin
   * @param {number} angle
   * @param {number} length
   * @param {RailPartAnchor} anchorType
   * @param {boolean} hasFeederSocket
   */
  constructor(point: Point, angle: number, length: number, anchorType: RailPartAnchor, hasFeederSocket: boolean) {
    let main = createRectPath(length, RailPart.WIDTH)
    let detector = createRectPath(length, RailPart.WIDTH + RailPart.MARGIN)
    super(main, detector, hasFeederSocket);

    this.length = length;

    // 移動・回転
    let anchor = this.getAnchorFromType(anchorType);
    this.move(point, anchor);
    this.rotate(angle, anchor);
  }
}
