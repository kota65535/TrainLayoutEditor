/**
 * Created by tozawa on 2017/07/12.
 */
import {Joint} from "./parts/Joint";
import {Rail} from "./rails/Rail";
import {FeederSocket} from "./parts/FeederSocket";
import {FlowDirection, RailPart} from "./parts/RailPart";
import logger from "../logging";
import {GapSocket} from "./parts/GapSocket";
import {LayoutEditorStoreProxy} from "./LayoutEditorStoreProxy";

let log = logger("LayoutSimulator");


export interface FlowDirectionTable {
  [name: string]: FlowDirectionElement[]
}

export interface FlowDirectionElement {
  name: string
  direction: FlowDirection
}


/**
 * 構築されたレイアウトの電気的なシミュレーションを行うクラス。
 */
export class LayoutSimulator {
  rails: Rail[]                   // レイアウトを構成するレール
  feederSockets: FeederSocket[];  // フィーダーがささっているフィーダーソケット
  gapSockets: GapSocket[];        // ギャップを

  store: LayoutEditorStoreProxy

  /**
   * 各レールパーツに電流を流しているフィーダーソケットとその電流方向を記したテーブル。
   * {
   *   '{rail-part-name}': [
   *     '{feeder-socket-name}': '{FlowDirection}',
   *     ...
   *   ]
   *   ...
   * }
   */
  flowDirectionTable: FlowDirectionTable


  constructor(storeProxy: LayoutEditorStoreProxy) {
    this.store = storeProxy
  }

  init(rails: Rail[], feederSockets: FeederSocket[], gapSockets: GapSocket[]) {
    this.rails = rails;
    this.feederSockets = feederSockets;
    this.gapSockets = gapSockets;
    this.flowDirectionTable = {}
    this.rails.forEach(r => r.railParts.forEach(part => {
      this.flowDirectionTable[part.name] = []
    }));
  }

  /**
   * 全てのレールの電流状態を初期状態に戻す。
   */
  resetFlowSimulation() {
    this.rails.forEach(rail => {
      rail.railParts.forEach(part => {
        part.flowDirection = FlowDirection.NONE;
      })
    })
  }


  simulateFeeder(name: string) {
    let feederSocket = this.feederSockets.find(fs => fs.name === name)
    if (feederSocket) {
      this.simulateFlow(feederSocket)
    }
  }


  simulateAllFeeders() {
    this.feederSockets.forEach(fs => this.simulateFlow(fs));
    this.validateTemporaryFlows();
    this.store.commitFlowDirectionTable(this.flowDirectionTable)
  }

  /**
   * 各レールパーツがショートしていないか調べる。
   */
  validateTemporaryFlows() {
    this.rails.forEach(r => r.railParts.forEach(part => {
      // このレールパーツに電流を流しているフィーダーソケットとその電流方向を記したテーブル。
      let dirs: FlowDirection[] = [...this.flowDirectionTable[part.name].map(e => e.direction)];
      if (dirs.length === 0) {
        part.flowDirection = FlowDirection.NONE;
        return;
      }
      // 全て同じ方向でなければ不正な状態
      if (dirs.every( v => v === dirs[0])) {
        part.flowDirection = dirs[0];
      } else {
        part.flowDirection = FlowDirection.ILLEGAL;
      }
    }))
  }


  simulateFlow(feeder: FeederSocket) {
    // 電流がゼロなら何もしない
    if (feeder.power === 0) {
      return
    }
    // フィーダーの刺さっているレールパーツの電流方向を設定
    this._setFlowDirectionTable(feeder.railPart, feeder);
    // レールパーツの両端のジョイントを取得する
    let startJoint, endJoint;
    [startJoint, endJoint] = feeder.railPart.joints

    switch (feeder.flowDirection) {
      case FlowDirection.START_TO_END:
        this.traceTemporaryFlowRecursively(feeder, startJoint, true);
        this.traceTemporaryFlowRecursively(feeder, endJoint, false);
        break;
      case FlowDirection.END_TO_START:
        this.traceTemporaryFlowRecursively(feeder, startJoint, false);
        this.traceTemporaryFlowRecursively(feeder, endJoint, true);
        break;
    }
  }

  /**
   * 指定されてたジョイントから再帰的にレールを辿り、各レールパーツの導電状態を設定する。
   * @param {Joint} joint
   * @param {Boolean} isReversed
   */
  traceTemporaryFlowRecursively(feederSocket: FeederSocket, joint: Joint, isReversed: boolean) {
    // ジョイントの先が繋がっていなければ終了
    if (! joint.isConnected()) {
      return;
    }
    // ジョイントの先のレールを取得
    let rail = joint.connectedJoint.rail;
    // 導電可能かつ、このジョイントに繋がっているレールパーツを取得する。
    // 存在しないか、すでに処理済みであれば終了
    let conductiveRailPart = rail.getConductiveRailPartOfJoint(joint.connectedJoint);
    if (!conductiveRailPart || this._getFlowDirectionTable(conductiveRailPart, feederSocket)) {
      return;
    }
    // レールパーツ両端のジョイントを取得して電流方向を調べる。同時に次のジョイントも
    let startJoint, endJoint;
    [startJoint, endJoint] = conductiveRailPart.joints;

    let flowDirection, nextJoint;
    if (joint.connectedJoint === startJoint) {
      flowDirection = isReversed ? FlowDirection.END_TO_START : FlowDirection.START_TO_END;
      nextJoint = endJoint;
    }
    if (joint.connectedJoint === endJoint) {
      flowDirection = isReversed ? FlowDirection.START_TO_END : FlowDirection.END_TO_START;
      nextJoint = startJoint;
    }

    log.info(flowDirection, nextJoint);

    // 電流方向をセットし、処理済みであることをマークする
    this._setFlowDirectionTable(conductiveRailPart, feederSocket)
    // conductiveRailPart.direction = direction;
    // conductiveRailPart.simulated = true;

    // 導電状態を更新したこのレールパーツが上になるよう描画する
    rail.railParts.forEach(otherPart => {
      if (otherPart !== conductiveRailPart) {
        conductiveRailPart.path.moveAbove(otherPart.path);
      }
    });

    // 次のジョイントに対して同じことを繰り返す
    if (nextJoint) {
      this.traceTemporaryFlowRecursively(feederSocket, nextJoint, isReversed);
    }
  }


  _getFlowDirectionTable(railPart: RailPart, feederSocket: FeederSocket): FlowDirection {
    // log.info(`FlowDirection @${feederSocket.name}@${railPart.name} = ${this.flowDirectionTable.get(railPart.name).get(feederSocket.name)}}`);
    let entry =  this.flowDirectionTable[railPart.name].find( e => e.name === feederSocket.name)
    if (entry) {
      return entry.direction
    } else {
      return FlowDirection.NONE
    }
  }

  _setFlowDirectionTable(railPart: RailPart, feederSocket: FeederSocket) {
    // log.info(`FlowDirection @${feederSocket.name}@${railPart.name} <= ${feederSocket.direction}`);
    this.flowDirectionTable[railPart.name].push({
      name: feederSocket.name,
      direction: feederSocket.flowDirection
    })
  }


  // /**
  //  * ジョイントからレールを取得する。
  //  * @param {Joint} joint
  //  * @returns {Rail}
  //  */
  // getRailFromJoint(joint) {
  //   let ret = null;
  //   this.rails.forEach(rail => {
  //     rail.joints.forEach(j => {
  //       if (j === joint) {
  //         ret = rail;
  //       }
  //     });
  //   });
  //   return ret;
  // }
  //
  // /**
  //  * レールパーツからレールを取得する。
  //  * @param {RailPart} railPart
  //  * @returns {Rail}
  //  */
  // getRailFromRailPart(railPart) {
  //   let ret = null;
  //   this.rails.forEach(rail => {
  //     rail.railParts.forEach(p => {
  //       if (p === railPart) {
  //         ret = rail;
  //       }
  //     });
  //   });
  //   return ret;
    // for (let a of [new paper.Point(1,1), new paper.Point(2,1)]) {
    //     console.log(a);
    // }

    // for (let rail of this.rails) {
    //     console.log(rail);
    //     for (let part of rail.railParts) {
    //         if (part === railPart) {
    //             return rail;
    //         }
    //     }
    // }

}
