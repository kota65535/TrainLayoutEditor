/**
 * Created by tozawa on 2017/07/03.
 */

import logger from "../../../logging";
import {RectPart} from "./primitives/RectPart";
import {GapSocket, GapConnectionState} from "./GapSocket";
let log = logger("Gap");

/**
 * ギャップクラス。
 */
export class Gap extends RectPart {

    static WIDTH = 6;
    static HEIGHT = 30;

    gapSocket: GapSocket;

    get visible() { return super.visible; }
    set visible(isVisible: boolean) {
        super.visible = isVisible;
        log.debug(`Gap @${this.gapSocket ? this.gapSocket.name : null}: visible=${this.visible}`);
    }

    set state(state: GapConnectionState) {
        // ギャップソケットの色に合わせるだけ
        this.path.fillColor = this.gapSocket.fillColors[state];
    }


    /**
     * ギャップを指定のギャップソケットに作成する。
     * @param {GapSocket} gapSocket
     */
    constructor(gapSocket: GapSocket) {
        super(gapSocket.position, gapSocket.angle, Gap.WIDTH, Gap.HEIGHT, "black");

        this.gapSocket = gapSocket;

        // フィーダーソケットのパスグループに追加
        this.gapSocket.pathGroup.addChild(this.path);

        // this.move(joint.position, this.getCenterOfTop());

        // 有効化
        this.visible = true;
        this.state = gapSocket.connectionState;
    }
}
