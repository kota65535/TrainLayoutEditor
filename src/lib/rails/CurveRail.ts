/**
 * Created by tozawa on 2017/07/03.
 */
import {Rail} from "./Rail";
import {RailPartAnchor} from "src/lib/parts/RailPart";
import {CurveRailPart} from "src/lib/parts/CurveRailPart";
import {Point} from "paper";


export class CurveRail extends Rail {

    radius: number;
    centerAngle: number;

    /**
     * カーブレールを生成する。
     * @param {Point} startPoint
     * @param {number} angle
     * @param {number} radius
     * @param {number} centerAngle
     * @param {string} name
     */
    constructor(startPoint: Point, angle: number, radius: number, centerAngle: number, hasFeederSocket: boolean, name?: string) {
        let parts = [
            new CurveRailPart(startPoint, 0, radius, centerAngle, RailPartAnchor.START, hasFeederSocket)
        ];
        super(startPoint, 0, parts, name);

        this.radius = radius;
        this.centerAngle = centerAngle;
        this.angle = 0;

        this.move(startPoint, this.joints[0]);
        this.rotate(angle, this.joints[0]);

        this.showJoints();
    }
}


export class DoubleCurveRail extends Rail {

    innerRadius: number;
    outerRadius: number;
    centerAngle: number;

    /**
     * 複線のダブルカーブレールを生成する。
     * @param {Point} startPoint
     * @param {number} angle
     * @param {number} outerRadius
     * @param {number} innerRadius
     * @param {number} centerAngle
     * @param {string} name
     */
    constructor(startPoint, angle, outerRadius, innerRadius, centerAngle, name?: string) {
        let parts = [
            new CurveRailPart(startPoint, 0, outerRadius, centerAngle, RailPartAnchor.START, true),
            new CurveRailPart(new Point(startPoint.x, startPoint.y + Rail.SPACE), 0, innerRadius, centerAngle, RailPartAnchor.START, true)
        ];
        super(startPoint, angle, parts, name);

        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.centerAngle = centerAngle;

        this.move(startPoint, this.joints[0]);
        this.rotate(angle, this.joints[0]);

        this.showJoints();
    }
}

