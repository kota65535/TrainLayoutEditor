/**
 * Created by tozawa on 2017/07/03.
 */
import {sprintf} from "sprintf-js";
import { Joint, JointDirection } from "./parts/Joint";
import { FeederSocket } from "./parts/FeederSocket";
import { PaletteItemType } from "../PaletteItem";
import logger from "../../logging";
import {Group, Point} from "paper";
import {RailPart} from "./parts/RailPart";
import {GapSocket} from "./parts/GapSocket";


let log = logger("Rail");

export interface RailConductionMap {

}

/**
 * レールの基底クラス。レールはレールパーツとジョイントにより構成される。
 * 単独ではなく、継承されて使用される想定。
 */
export class Rail {

    // レール間の間隔
    static SPACE = 38;

    // ジョイントの位置とレールパーツの両端の位置の間で許される誤差
    static JOINT_TO_RAIL_PART_TOLERANCE = 0.1;

    railParts: RailPart[] = [];
    joints: Joint[] = [];
    feederSockets: FeederSocket[] = [];
    gapSockets: GapSocket[] = [];

    angle: number;

    pathGroup: Group = new Group();

    // どのレールパーツに電気が流れるかを表す導電状態マップ。
    // 状態ID: 導電しているRailPartのIndexのArray
    conductionMap: Array<Array<number>> = [
      [0]
    ]
    // 現在の導電状態
    conductionState: number = 0;


    // このレールを特定するためのID。
    // setterではこのレールを構成するパーツにもIDを設定する。
    get name() { return this.pathGroup.name; }
    set name(name: string) {
        this.pathGroup.name = name;
        this.railParts.forEach((part, i) => part.name = `${this.name}p${i}`);
        this.joints.forEach((j, i) => j.name = `${this.name}j${i}`);
        this.feederSockets.forEach((f, i) => f.name = `${this.name}f${i}`);
        this.gapSockets.forEach((g, i) => g.name = `${this.name}g${i}`);
    }

    get startPoint(): Point { return this.railParts[0].startPoint; }


    /**
     * レールの初期化。基底クラスでは特に重要な処理は行わない。
     * 子クラスではここでレールパーツの追加と移動・回転を行う。
     *
     * @param {Point} startPoint
     * @param {number} angle
     * @param {RailPart} railParts
     * @param {string} name
     */
    constructor(startPoint: Point, angle: number, railParts: RailPart[], name: string) {
        this.angle = angle;

        railParts.forEach((part, i) => this._addRailPart(part, i));
        // 各ジョイントにギャップソケットを追加
        this.joints.forEach(j => {
            let gapSocket = new GapSocket(j);
            this.gapSockets.push(gapSocket);
            j.gapSocket = gapSocket;
        });

        // IDを設定
        this.name = name;
    }

    /**
     * レールを構成するレールパーツを追加し、さらにその両端にジョイントを追加する。
     * Constructorからのみ呼ばれることを想定。
     * @param {RailPart} railPart
     * @param {number} index
     */
    private _addRailPart(railPart: RailPart, index: number) {
        // レールパーツは最も下に描画
        // this.pathGroup.insertChild(0, railPart.path);

        // 重複が無いか確認してからジョイントを追加する
        let startJoint = this._getJointAt(railPart.startPoint);
        if (! startJoint) {
            startJoint = new Joint(railPart.startPoint, railPart.startAngle, JointDirection.REVERSE_TO_ANGLE, this);
            this.joints.push(startJoint);
        }
        railPart.joints.push(startJoint);


        let endJoint = this._getJointAt(railPart.endPoint);
        if (! endJoint) {
            endJoint = new Joint(railPart.endPoint, railPart.endAngle, JointDirection.SAME_TO_ANGLE, this);
            this.joints.push(endJoint);
        }
        railPart.joints.push(endJoint);

        // 各レールパーツにフィーダーソケットの追加
        // FIXME: 多分これだとレールパーツが複数で一部がフィーダーソケットを持たないときにバグる
        if (railPart.hasFeederSocket()) {
            let feederSocket = new FeederSocket(railPart);
            railPart.feederSocket = feederSocket;
            this.feederSockets.push(feederSocket);
        }

        railPart.rail = this;
        this.railParts.push(railPart);
    }

    /**
     * 任意のジョイントを基準に、絶対座標で移動する。
     * @param {Point} point 移動先の座標
     * @param {Point,Joint} anchor 基準とする座標またはジョイント
     */
    move(point: Point, anchor: Point|Joint) {
        if (anchor instanceof Joint) {
            anchor = anchor.position;
        }
        let difference = point.subtract(anchor);
        this.moveRelatively(difference);
    }

    /**
     * 現在からの相対座標で移動する。
     * @param {Point} difference 移動先の現在位置に対する相対座標
     */
    moveRelatively(difference: Point) {
        this.railParts.forEach( part => {
            part.moveRelatively(difference);
        });
        this.joints.forEach( joint => {
            joint.moveRelatively(difference);
        });
        this.feederSockets.forEach( feeder => {
            feeder.moveRelatively(difference);
        });
        this.gapSockets.forEach( gap => {
            gap.moveRelatively(difference);
        });
    }

    /**
     * 任意のジョイントを中心に、X軸から時計回りの絶対角度で回転する。
     * @param {number} angle 回転角度
     * @param {Point,Joint} anchor 基準とするジョイント
     */
    rotate(angle: number, anchor: Point|Joint) {
        if (anchor instanceof Joint) {
            anchor = anchor.position;
        }
        let relAngle = angle - this.angle;
        this.rotateRelatively(relAngle, anchor);
    }

    /**
     * 任意のジョイントを中心に、X軸から時計回りで現在からの相対角度で回転する。
     * @param {number} angle 回転角度
     * @param {Point,Joint} anchor 基準とするジョイント
     */
    rotateRelatively(angle: number, anchor: Point|Joint) {
        if (anchor instanceof Joint) {
            anchor = anchor.position;
        }
        this.railParts.forEach( part => {
            part.rotateRelatively(angle, <Point>anchor)
        });
        this.joints.forEach( j => {
            j.rotateRelatively(angle, <Point>anchor);
        })
        this.feederSockets.forEach( f => {
            f.rotateRelatively(angle, <Point>anchor);
        })
        this.gapSockets.forEach( g => {
            g.rotateRelatively(angle, <Point>anchor);
        })
        this.angle += angle;
    }

    /**
     * 任意のジョイントに対して接続する。
     * @param {Joint} fromJoint こちら側のジョイント
     * @param {Joint} toJoint 接続先のジョイント
     * @param {boolean} isDryRun
     */
    connect(fromJoint: Joint, toJoint: Joint, isDryRun: boolean = false) {

        this.move(toJoint.position, fromJoint);
        let angle = toJoint.direction - fromJoint.direction + 180;

        log.debug(sprintf("Rotate %.3f around (%.3f, %.3f)",
            angle, toJoint.position.x, toJoint.position.y));

        this.rotateRelatively(angle, toJoint);
        fromJoint.connect(toJoint, isDryRun);
    }

    /**
     * このレールに属する全てのジョイントを切断する。
     */
    disconnect() {
        this.joints.forEach(j => j.disconnect());
    }

    /**
     * このレールを削除する。
     */
    remove() {
        this.disconnect();
        this.railParts.forEach(elem => elem.remove());
        this.joints.forEach(elem => elem.remove());
        this.feederSockets.forEach(elem => elem.remove());
        this.gapSockets.forEach(elem => elem.remove());
    }

    /**
     * 指定されたパスがこのレールに属するものか否かを返す。
     * @param {Path} path
     * @returns {boolean}
     */
    containsPath(path) {
        return !!this.railParts.find(elem => elem.path.id === path.id)
            || !!this.joints.find(elem => elem.path.id === path.id);
        // this.railParts.forEach( elem => log.debug(elem.path.id + " " + path.id));
    }

    /**
     * このレールの透明度を設定する
     * @param {number} value
     */
    setOpacity(value) {
        this.railParts.forEach(elem => elem.opacity = value);
        this.joints.forEach(elem => elem.opacity = value);
        this.feederSockets.forEach(elem => elem.opacity = value);
        this.gapSockets.forEach(elem => elem.opacity = value);
    }

    /**
     * このレールの表示・非表示を設定する。
     * @param {boolean} isVisible
     */
    setVisible(isVisible) {
        this.railParts.forEach(elem => elem.visible = isVisible);
        this.joints.forEach(elem => elem.visible = isVisible);
        this.feederSockets.forEach(elem => elem.visible = isVisible);
        this.gapSockets.forEach(elem => elem.visible = isVisible);
    }

    /**
     * ジョイント情報を表示する。デバッグ用。
     */
    showJoints() {
        this.joints.forEach( joint => {
            joint.showInfo();
        });
    }

    /**
     * 導電状態をトグルスイッチ的に変更する。
     */
    toggleSwitch() {
        let numStates = Object.keys(this.conductionMap).length;
        this.conductionState = (this.conductionState + 1) % numStates;
        this.switch(this.conductionState);
    }

    /**
     * 導電状態を変更する。
     * @param state
     */
    switch(state) {
        let numStates = Object.keys(this.conductionMap).length;
        if (state > numStates) {
            log.error("No conduction state", state);
            return;
        }
        this.conductionState = state;
    }

    /**
     * レールパーツの両端のジョイントを取得する。開始点、終了点の順に取得される。
     * @param {RailPart} railPart
     * @returns {Array<Joint>}
     */
    getJointsFromRailPart(railPart) {
        let ret = null;
        console.log(railPart.startPoint, railPart.endPoint);
        let startJoint = this.joints.find( j => this._isReasonablyClose(j.position, railPart.startPoint));
        let endJoint = this.joints.find( j => this._isReasonablyClose(j.position, railPart.endPoint));
        if (startJoint && endJoint) {
            return [startJoint, endJoint];
        }
    }

    /**
     * 現在の導電状態で導電しているレールパーツを取得する。
     * @returns {Array<RailPart>}
     */
    getConductiveRailParts(): RailPart[] {
        return this.conductionMap[this.conductionState].map( index => this.railParts[index])
    }

    /**
     * 現在の導電状態で導電しており、かつ指定のジョイントに接しているレールパーツを取得する。
     * @param {Joint} joint
     * @returns {RailPart}
     */
    getConductiveRailPartOfJoint(joint: Joint): RailPart {
        let ret = this.getConductiveRailParts().find(part => {
            return joint.position.isClose(part.startPoint, 0.1) || joint.position.isClose(part.endPoint, 0.1);
        });
        return ret;
    }

    /**
     * レール全体のバウンディングボックスを取得する。パレット用。
     * @returns {Rectangle}
     */
    getBounds() {
        return new Group(this.railParts.map(rp => rp.path)).bounds
    }

    /**
     * レールの拡大縮小を行う。パレット用。
     * @param hor
     * @param ver
     */
    scale(hor, ver) {
      let group = new Group()
      group.addChildren(this.railParts.map(rp => rp.path))
      group.addChildren(this.joints.map(rp => rp.path))
      group.scale(hor, ver)
      // group.removeChildren()
      // group.remove()
      // this.railParts.forEach(rp => rp.scale(hor, ver));
    }

    animate(event) {
        this.railParts.forEach(rp => rp.animate(event));
    }


    /**
     * 与えられた座標にジョイントが存在するか否かを返す。
     * @param {Point} point
     * @returns {boolean}
     * @private
     */
    private _getJointAt(point: Point): Joint {
        return this.joints.find( jo => jo.position.isClose(point, 0.1));
    }

    /**
     * ジョイントのペアから、両者を繋ぐレールパーツを取得する。
     * @param {Joint} joint1
     * @param {Joint} joint2
     * @returns {*}
     * @private
     */
    private _getRailPartFromJoints(joint1, joint2) {
        let parts = this.railParts.filter( part => {
            return (joint1.position.isClose(part.startPoint, 0.1) && joint2.position.isClose(part.endPoint, 0.1))
                || (joint2.position.isClose(part.startPoint, 0.1) && joint1.position.isClose(part.endPoint, 0.1))
        });
        if (parts.length === 1) {
            return parts[0];
        } else if (parts.length > 1) {
            log.warn("Multiple rail part found on 2 joints");
        } else {
            log.warn("No rail part found on 2 joints");
        }
        return null;
    }

    /**
     * 2点が十分に近いことを示す。
     * ジョイントがレールパーツの両端のいずれかに存在するか調べるときに使う。
     * @param point1
     * @param point2
     * @return {Boolean}
     * @private
     */
    private _isReasonablyClose(point1, point2) {
        return point1.isClose(point2, Rail.JOINT_TO_RAIL_PART_TOLERANCE);
    }

}

