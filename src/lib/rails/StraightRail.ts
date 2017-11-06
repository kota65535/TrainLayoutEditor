/**
 * Created by tozawa on 2017/07/03.
 */
import {Rail} from "./Rail";
import {RailPartAnchor} from "src/lib/parts/RailPart";
import {StraightRailPart} from "src/lib/parts/StraightRailPart";
import {Point} from "paper";


export class StraightRail extends Rail {

    length: number;
    hasFeederSocket: boolean;

    /**
     * ストレートレールを生成する。
     * @param {Point} startPoint
     * @param {number} angle
     * @param {number} length
     * @param {boolean} hasFeederSocket
     * @param {string} name
     */
    constructor(startPoint: Point, angle: number, length: number, hasFeederSocket: boolean, name?: string) {
        let part = new StraightRailPart(startPoint, 0, length, RailPartAnchor.START, hasFeederSocket);
      super([part], name);

        this.length = length;
        this.hasFeederSocket = hasFeederSocket;

        this.move(startPoint, this.joints[0]);
        this.rotate(angle, this.joints[0]);
    }
}

export class DoubleStraightRail extends Rail {

    length: number;

    /**
     * 複線のダブルストレートレールを作成する。
     * @param {Point} startPoint
     * @param {number} angle
     * @param {number} length
     * @param {string} name
     */
    constructor(startPoint, angle, length, name?: string) {
        let parts = [
            new StraightRailPart(startPoint, 0, length, RailPartAnchor.START, true),
            new StraightRailPart(new Point(startPoint.x, startPoint.y + Rail.SPACE), 0, length, RailPartAnchor.START, true)
        ];
      super(parts, name);

        this.length = length;

        this.move(startPoint, this.joints[0]);
        this.rotate(angle, this.joints[0]);

        this.showJoints();
    }
}

export class GappedStraightRail extends Rail {

    length: number;

    /**
     * 両ギャップレールを生成する。
     * @param {Point} startPoint
     * @param {number} angle
     * @param {number} length
     * @param {string} name
     */
    constructor(startPoint, angle, length, name?: string) {
        let parts = [
            new StraightRailPart(startPoint, 0, length, RailPartAnchor.START, false)
        ];
      super(parts, name);

        this.length = length;

        this.conductionTable = [
          []
        ]

        this.move(startPoint, this.joints[0]);
        this.rotate(angle, this.joints[0]);

        this.showJoints();
    }
}
