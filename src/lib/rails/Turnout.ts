/**
 * Created by tozawa on 2017/07/03.
 */
import { Rail } from "./Rail";
import {RailPart, RailPartAnchor} from "./parts/RailPart";
import { StraightRailPart } from "./parts/StraightRailPart";
import { CurveRailPart } from "./parts/CurveRailPart";
import {Point} from "paper";

/**
 * 分岐先の方向を指定するための識別子。
 */
export enum TurnoutDirection {
    LEFT,
    RIGHT
}

/**
 * TODO: ジョイントオーダーは左回りで統一すべきか、分岐方向で統一すべきか決める。
 */

export class SimpleTurnout extends Rail {

    length: number;
    radius: number;
    centerAngle: number;
    direction: TurnoutDirection;

    /**
     * 片開きのポイントを生成する。
     * @param {Point} startPoint
     * @param {number} length
     * @param {number} angle
     * @param {number} radius
     * @param {number} centerAngle
     * @param {TurnoutDirection} direction
     * @param {string} name
     */
    constructor(startPoint: Point, angle: number, length: number, radius: number, centerAngle: number,
                direction: TurnoutDirection, name?: string) {
        let parts: RailPart[] = [
            new StraightRailPart(startPoint, 0, length, RailPartAnchor.START, false)
        ];

        switch (direction) {
            case TurnoutDirection.LEFT:
                parts.push(new CurveRailPart(startPoint, -180, radius, centerAngle, RailPartAnchor.END, false));
                break;
            case TurnoutDirection.RIGHT:
                parts.push(new CurveRailPart(startPoint, 0, radius, centerAngle, RailPartAnchor.START, false));
                break;
        }

        super(startPoint, angle, parts, name);

        this.length = length;
        this.radius = radius;
        this.centerAngle = centerAngle;
        this.direction = direction;

        this.conductionTable = [
          [0],
          [1]
        ]

        this.move(startPoint, this.joints[0]);
        this.rotate(angle, this.joints[0]);

        this.showJoints();

        this.conductionState = 0;
    }
}

export class SymmetricalTurnout extends Rail {

    radius: number;
    centerAngle: number;

    /**
     * Y字ポイントを生成する。
     * @param {Point} startPoint
     * @param {number} angle
     * @param {number} radius
     * @param {number} centerAngle
     * @param {string} name
     */
    constructor(startPoint: Point, angle: number, radius: number, centerAngle: number, name?: string) {
        let parts: RailPart[] = [
            new CurveRailPart(startPoint, 0, radius, centerAngle, RailPartAnchor.START, false),
            new CurveRailPart(startPoint, 180, radius, centerAngle, RailPartAnchor.END, false)
        ];

        super(startPoint, angle, parts, name);

        this.radius = radius;
        this.centerAngle = centerAngle;


      this.conductionTable = [
        [0],
        [1]
      ]

        this.move(startPoint, this.joints[0]);
        this.rotate(angle, this.joints[0]);

        this.showJoints();
    }
}


export class CurvedTurnout extends Rail {

    innerRadius: number;
    outerRadius: number;
    centerAngle: number;
    direction: TurnoutDirection;

    /**
     * カーブポイントを生成する。
     * @param {Point} startPoint
     * @param {number} angle
     * @param {number} outerRadius
     * @param {number} innerRadius
     * @param {number} centerAngle
     * @param {TurnoutDirection} direction
     * @param {string} name
     */
    constructor(startPoint: Point, angle: number, outerRadius: number, innerRadius: number, centerAngle: number,
                direction: TurnoutDirection, name?: string) {
        let parts;
        let anchorJointIndex;
        switch (direction) {
            case TurnoutDirection.LEFT:
                parts = [
                    new CurveRailPart(startPoint, 180, outerRadius, centerAngle, RailPartAnchor.END, false),
                    new CurveRailPart(startPoint, 180, innerRadius, centerAngle, RailPartAnchor.END, false)
                ];
                // this.angle = angle + 180;
                anchorJointIndex = 1;
                break;
            case TurnoutDirection.RIGHT:
                parts = [
                    new CurveRailPart(startPoint, 0, outerRadius, centerAngle, RailPartAnchor.START, false),
                    new CurveRailPart(startPoint, 0, innerRadius, centerAngle, RailPartAnchor.START, false)
                ];
                // this.angle = angle;
                anchorJointIndex = 0;
                break;
        }

        super(startPoint, angle, parts, name);

        // this.angle = angle;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.centerAngle = centerAngle;
        this.direction = direction;

      this.conductionTable = [
        [0],
        [1]
      ]

        this.move(startPoint, this.joints[anchorJointIndex]);
        this.rotate(this.angle, this.joints[anchorJointIndex]);

        this.showJoints();
    }
}
