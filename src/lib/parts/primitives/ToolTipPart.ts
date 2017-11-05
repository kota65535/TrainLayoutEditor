/**
 * Created by tozawa on 2017/07/03.
 */

import {sprintf} from "sprintf-js";
import {Color, Point} from "paper";
import {MultiPart} from "./MultiPart";
import {createTrianglePath} from "./TrianglePart";
import {createRectPath} from "./RectPart";


export class ToolTipPart extends MultiPart {
  width: number;
  height: number;

  /**
   * ツールチップパーツを指定の位置・角度で作成する。
   * @param {Point} position  中心点の位置
   * @param {number} angle    X軸に対する絶対角度
   * @param {number} width    幅
   * @param {number} height   高さ
   * @param {Color} fillColor 色
   */
  constructor(position: Point, angle: number, width: number, height: number, fillColor: string) {
    let tri = createTrianglePath(width/2, height)
    tri.rotate(180)
    tri.position = new Point(width/2, height/2)
    let rect = createRectPath(width, height)
    super(position, angle, [tri, rect]);

    this.width = width;
    this.height = height;
    this.group.fillColor = fillColor;

    this.move(position, this.position);
    this.rotate(angle, this.position);
  }
}
