/**
 * Created by tozawa on 2017/07/03.
 */

import {PartBase} from "./PartBase";
import {Color, Path, Point, Rectangle, Size, PointText, Group} from "paper";

/**
 * 矩形パーツの基底クラス。
 */
export class TooltipPart extends PartBase {

    width: number;
    height: number;
    _text: PointText;
    group: Group;


    get text(): PointText { return this._text; }
    set text(_text: PointText) { this._text = _text; }

    /**
     * 矩形パーツを指定の位置・角度で作成する。
     * @param {Point} position  中心点の位置
     * @param {number} angle    X軸に対する絶対角度
     * @param {number} width    幅
     * @param {number} height   高さ
     * @param {Color} fillColor 色
     */
    constructor(position: Point, angle: number , width: number, height: number, round: number, fillColor: string,
                text: string, textColor: string, textFontSize: number) {
        super();
        this.angle = 0;
        this.width = width;
        this.height = height;

        //　テキストアイテムの生成
        this._text = new PointText(new Point(0, 0));
        this._text.justification = 'center';
        this._text.fillColor = textColor;
        this._text.fontSize = textFontSize;
        this._text.content = text;

        let rectangle;
        if (width === 0 && height === 0) {
            // テキストアイテムのBoundsより少し大きいサイズの四角形を生成
            rectangle = new Rectangle(
                this.text.bounds.topLeft.subtract(new Point(10, 8)),
                this.text.bounds.bottomRight.add(new Point(10, 8)));
        } else {
            // 与えられたWidthとHeightで四角形を生成
            rectangle = new Rectangle(new Point(-width/2, -height/2), new Point(width/2, height/2));
        }
        this.path = (<any>Path).RoundRectangle(rectangle, new Size(round, round));
        this.path.fillColor = fillColor;

        this.group = new Group();
        this.group.addChild(this.path);
        this.group.addChild(this.text);

        this.move(position, this._path.position);
        this.rotate(angle, this._path.position);
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
     * 上辺の中点を返す。
     * @returns point
     */
    getCenterOfTop(): Point {
        return this._path.curves[1].getLocationAt(this._path.curves[1].length/2).point;
    }

    /**
     * 下辺の中点を返す。
     * @returns point
     */
    getCenterOfBottom(): Point {
        return this._path.curves[4].getLocationAt(this._path.curves[4].length/2).point;
    }

    /**
     * 左辺の中点を返す。
     * @returns point
     */
    getCenterOfLeft(): Point {
        return this._path.segments[0].point
    }

    /**
     * 右辺の中点を返す。
     * @returns point
     */
    getCenterOfRight(): Point {
        return this._path.segments[3].point
    }
}
