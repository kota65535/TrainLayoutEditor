/**
 * Created by tozawa on 2017/07/12.
 */
import {Joint, JointDirection, JointState} from "./rails/parts/Joint";
import {FeederSocket, FeederConnectionState} from "./rails/parts/FeederSocket";
import {Rail} from "./rails/Rail";
import {CurveRail} from "./rails/CurveRail";
import {cloneRail, serialize, deserialize} from "./RailUtil";
import {LayoutData, LayoutManager} from "./LayoutManager";
import {LayoutSimulator} from "./LayoutSimulator";
import {hitTest, hitTestAll} from "./utils";
import logger from "../logging";
import {PaletteItem, EditorMode} from "./PaletteItem";
import {GridPaper} from "./GridPaper";
import {KeyEvent, Point, project, ToolEvent} from "paper";
import {RailFactory} from "./RailFactory";
import {GapSocket, GapState} from "./rails/parts/GapSocket";
import {LayoutEditorStoreProxy} from "./LayoutEditorStoreProxy";

let log = logger("LayoutEditor");


export class LayoutEditor {
  gridPaper: GridPaper
  layoutManager: LayoutManager
  layoutSimulator: LayoutSimulator
  railFactory: RailFactory
  storeProxy: LayoutEditorStoreProxy

  // パレットで選択中のアイテム
  mode: EditorMode
  // パレットで選択中のレールオブジェクト
  paletteRail: Rail;
  // パレットで選択中のレールの角度
  paletteRailAngle: number;
  // マウスカーソルで触れたフィーダーソケット
  touchedFeederSocket: FeederSocket;
  // マウスカーソルで触れたギャップジョイナーソケット
  touchedGapSocket: GapSocket;

  // パレットレールが接続相手に繋げるためのジョイントのインデックス
  jointIndexOfGuide: number;

  // 最初のレールを配置するためのグリッド上のジョイントとその角度
  gridJoints: Joint[];
  gridJointsAngle: number;

  permitRailIntersection: boolean



  constructor(gridPaper: GridPaper, storeProxy: LayoutEditorStoreProxy) {

    this.gridPaper =  gridPaper
    this.layoutManager = new LayoutManager();
    this.layoutSimulator = new LayoutSimulator();
    this.railFactory = new RailFactory();
    this.storeProxy = storeProxy

    this.paletteRail = null;
    this.paletteRailAngle = 0;
    this.touchedFeederSocket = null;

    this.jointIndexOfGuide = null;

    this.gridJoints = [];
    this.gridJointsAngle = 0;
    this.permitRailIntersection = false;
  }


  //====================
  // モード遷移
  //====================

  isRailMode(): boolean {
    return this.mode === EditorMode.RAIL
  }

  isFeederMode(): boolean {
    return this.mode === EditorMode.FEEDER || this.mode === EditorMode.FEEDER_SELECTING
  }

  isGapJoinerMode(): boolean {
    return this.mode === EditorMode.GAP_JOINER
  }

  isFeederSelectingMode(): boolean {
    return this.mode === EditorMode.FEEDER_SELECTING
  }

  /**
   * レール設置モードに移行する。
   */
  changeToRailMode () {
    log.info("Changing to rail mode...");
    // ジョイントを有効化、フィーダーソケットを無効化
    this.layoutManager.rails.forEach(rail => {
      rail.joints.forEach(j => j.enabled = true);
    });
    this.layoutManager.rails.forEach(rail => {
      rail.feederSockets.forEach(fs => fs.enabled = false);
    });
    this.layoutManager.rails.forEach(rail => {
      rail.gapSockets.forEach(gs => gs.enabled = false);
    });

    log.info("Changed to rail mode.");
  }

  changePaletteRail (itemId: string) {
    // レールの生成と選択
    this.selectRail(this.railFactory[itemId]());
  }

  /**
   * フィーダー設置モードに移行する。
   */
  changeToFeederMode() {
    log.info("Changed to feeder mode...");
    // ジョイントを無効化、フィーダーソケットを有効化
    this.layoutManager.rails.forEach(rail => {
      rail.joints.forEach(j => j.enabled = false);
    });
    this.layoutManager.rails.forEach(rail => {
      rail.feederSockets.forEach(fs => fs.enabled = true);
    });
    this.layoutManager.rails.forEach(rail => {
      rail.gapSockets.forEach(gs => gs.enabled = false);
    });
    log.info("Changed to feeder mode.");
  }

  /**
   * ギャップジョイナー設置モードに移行する。
   */
  changeToGapJoinerMode() {
    log.info("Changed to gap mode...");
    // ジョイントを有効化、フィーダーソケットを無効化
    this.layoutManager.rails.forEach(rail => {
      rail.joints.forEach(j => j.enabled = false);
    });
    this.layoutManager.rails.forEach(rail => {
      rail.feederSockets.forEach(fs => fs.enabled = false);
    });
    // 現在接続済みのジョイントに対してのみギャップを設置することができる
    this.layoutManager.rails.forEach(rail => {
      rail.joints.filter(j => j.isConnected()).forEach(j => j.gapSocket.enabled = true);
    });
    log.info("Changed to gap mode.");
  }

  /**
   * エディタのモードを切り替える。
   * @param {EditorMode} mode
   */
  changeMode(mode: EditorMode) {
    // もし現在のアイテムと異なる種類ならば、全ての選択状態を解除する
    if (this.mode !== mode) {
      project.deselectAll();
    }
    switch (mode) {
      case EditorMode.RAIL:
        this.changeToRailMode();
        this.mode = mode
        break;
      case EditorMode.FEEDER:
      case EditorMode.FEEDER_SELECTING:
        this.changeToFeederMode();
        this.mode = mode
        break;
      case EditorMode.GAP_JOINER:
        this.changeToGapJoinerMode();
        this.mode = mode
        break;
    }
  }

  //====================
  // レイアウトの保存・読込
  //====================

  /**
   * 保存されていたレイアウトをロードし、エディタ上に配置する。
   * @param layoutData
   */
  loadLayout(layoutData: LayoutData) {
    // グリッドジョイントがあれば削除する
    this.removeGridJoints();
    // ジョイント、フィーダー両方の選択を有効化する
    this.layoutManager.rails.forEach(rail => {
      rail.joints.forEach(j => j.enabled = true);
    });
    this.layoutManager.rails.forEach(rail => {
      rail.feederSockets.forEach(fs => fs.enabled = true);
    });
    // レイアウトデータをロードする
    this.layoutManager.loadLayout(layoutData);

    // ロードしたレールのパスをグリッドペーパーに認識させる
    this.layoutManager.rails.forEach(rail => {
      this.gridPaper.paths.push(rail.pathGroup);
      log.info(`GridPaper: add path ${rail.pathGroup}`)
    });
    // 何も選択していない状態にする
    project.deselectAll();
  }

  /**
   * 現在のレイアウトデータをシリアライズしたオブジェクトを返す。
   * @returns {{rails: Array}}
   */
  saveLayout() {
    return this.layoutManager.saveLayout();
  }

  //==============================
  // 一本目のレール設置時特有のメソッド
  //==============================

  /**
   * レイアウトが空（レールが一本も配置されていない）か否かを返す。
   * @returns {boolean}
   */
  isLayoutBlank(): boolean {
    return this.layoutManager.rails.length === 0;
  }

  /**
   * 一本目のレールをグリッド上に配置するためのジョイント（グリッドジョイント）を配置する。
   * @param {Point} cursorPosition
   */
  putGridJoints(cursorPosition: Point) {
    // マウスカーソルの周囲のグリッドの座標を取得する
    let topLeft = cursorPosition.subtract(new Point(this.gridPaper.gridSize, this.gridPaper.gridSize));
    let bottomRight = cursorPosition.add(new Point(this.gridPaper.gridSize, this.gridPaper.gridSize));
    let gridPoints = this.gridPaper.getGridPoints(topLeft, bottomRight);

    // 更新のためいったん全て消す
    this.removeGridJoints();

    if (this.isLayoutBlank()) {
      // グリッド上に透明なジョイントを作成
      gridPoints.forEach(point => {
        let joint = new Joint(point, this.gridJointsAngle, JointDirection.SAME_TO_ANGLE, null);
        // TODO: デバッグ用
        joint.basePart.opacity = 0;
        // joint.setOpacity(0);
        joint.basePart.visible = false;
        this.gridJoints.push(joint);
      });
    }
  }

  /**
   * 全てのグリッドジョイントを削除する。
   */
  removeGridJoints() {
    this.gridJoints.forEach(joint => joint.remove());
    this.gridJoints = [];
  }

  /**
   * 指定の位置のグリッドジョイントを返す。
   * @param {Point} point
   * @returns {Joint}
   */
  searchGridJoints(point: Point): Joint {
    let hitResult = hitTest(point);
    if (!hitResult) {
      return null;
    }
    return this.gridJoints.find(joint => joint.containsPath(<any>hitResult.item));
  }

  /**
   * 指定の位置のジョイントを取得する。
   * @param point
   * @returns {Joint}
   */
  getJoint(point: Point): Joint {
    let joint;
    if (this.isLayoutBlank()) {
      // レイアウトが空ならグリッドジョイント
      joint = this.searchGridJoints(point);
    } else {
      // そうでなければカーソル位置のジョイントのうち、最も近いものを選択する。
      joint = this.layoutManager.getJoint(point);
    }
    return joint;
  }

  //==============================
  // レール設置モードに関わるメソッド
  //==============================

  /**
   * 設置するレールを選択する。
   * @param {Rail} rail
   *
   */
  selectRail(rail: Rail) {
    // TODO: パレットを連打すると、その分だけ不可視のレールが生成されてしまう
    this.paletteRail = rail;
    this.paletteRail.rotate(this.paletteRailAngle, this.paletteRail.startPoint);
    // 不可視の状態で置いておく
    this.paletteRail.setVisible(false);
  }

  /**
   * 設置されるレールのガイドを半透明で表示する。
   * @param {Joint} toJoint
   */
  showRailToPut(toJoint: Joint) {
    this.paletteRail.setVisible(true);
    this.paletteRail.setOpacity(0.5);
    // レール選択直後の場合、対向レールの種類にもとづいてレールガイドの初期向きを設定する
    if (this.jointIndexOfGuide === null) {
      this.initJointOfGuide(toJoint);
    }
    // 接続先のレール（レイアウトが空ならジョイント）を最上部に表示する。
    // 接続先のジョイントに対するカーソルの当たり判定維持のため。
    if (this.isLayoutBlank()) {
      toJoint.pathGroup.bringToFront();
    } else {
      toJoint.rail.pathGroup.bringToFront();
    }
    this.paletteRail.connect(this.getCurrentJointOfGuide(), toJoint, true);
  }

  /**
   * 設置されるレールのガイドを消去する。
   */
  hideRailToPut() {
    this.paletteRail.setVisible(false);
    this.paletteRail.setOpacity(0.2);
    this.paletteRail.disconnect();
    this.paletteRail.move(new Point(0,0), this.paletteRail.joints[0]);
  }

  /**
   * ガイドレールが自身のどのジョイントで対向レールに接続するかを決定するインデックスを初期化する。
   * カーブレールが続く場合、弧の向きに合わせてガイドレールの初期接続ジョイントを一定に保つ。
   * @param toJoint
   */
  initJointOfGuide(toJoint: Joint) { // 対向レールとパレットレールの両者がカーブレールの場合、カーブの向きを揃える。
    // TODO: ジョイントの個数が２であることが前提になっている。より汎用的なロジックを考える。
    let opponentRail = toJoint.rail;
    if (!opponentRail) {
      // グリッドジョイントの場合は向きは変えない
      this.jointIndexOfGuide = 0;
      return;
    }
    if (this.paletteRail instanceof CurveRail && opponentRail instanceof CurveRail) {
      // 自分も相手もカーブレールの場合
      if (this.layoutManager.rails.length === 1) {
        // 一本目のレールがカーブレールの場合、両方のジョイントに対して弧の向きを揃えることはできない・・・
        // 割り切って向きは変えないことにする。
        this.jointIndexOfGuide = 0;
      } else {
        this.jointIndexOfGuide = opponentRail.joints.indexOf(toJoint) ^ 1;
      }
    } else {
      // カーブレール以外なら向きは変えなくてもいいよね？
      this.jointIndexOfGuide = 0;
    }
    log.info(`init joint index of guide with ${this.jointIndexOfGuide}`);
  }

  /**
   * レールガイドが接続する自身のジョイントのインデックスを取得する。
   * @returns {Joint}
   */
  getCurrentJointOfGuide(): Joint {
    return this.paletteRail.joints[this.jointIndexOfGuide];
  }

  /**
   * レールガイドが接続する自身のジョイントのインデックスをインクリメントする。
   */
  incrementJointIndexOfGuide() {
    this.jointIndexOfGuide = (this.jointIndexOfGuide + 1) % this.paletteRail.joints.length;
  }

  /**
   * 選択されたレールを設置する。
   * @param {Joint} toJoint
   */
  putSelectedRail(toJoint: Joint) {
    // 接続先のレールよりも上に移動する。設置したレールのジョイントの当たり判定を優先したいので。
    this.paletteRail.pathGroup.bringToFront();
    let result = this.layoutManager.putRail(
      this.paletteRail, this.getCurrentJointOfGuide(), toJoint, this.permitRailIntersection);
    if (result) {
      this.gridPaper.paths.push(this.paletteRail.pathGroup);
      this.selectRail(<any>cloneRail(this.paletteRail));
      this.jointIndexOfGuide = null;
      this.storeProxy.commitRails(this.layoutManager.rails)
    }
  }

  //==============================
  // フィーダー設置モードに関わるメソッド
  //==============================

  /**
   * 設置されるフィーダーのガイドを半透明で表示する。
   * @param {FeederSocket} feederSocket at the mouse cursor
   */
  showFeederToPut(feederSocket: FeederSocket) {
    this.touchedFeederSocket = feederSocket;
    this.touchedFeederSocket.connect(true);
  }

  /**
   * 設置されるフィーダーのガイドを消去する。
   */
  hideFeederToPut() {
    // 接続試行中ならガイドを消去する
    if (this.touchedFeederSocket && this.touchedFeederSocket.connectionState === FeederConnectionState.CONNECTING) {
      this.touchedFeederSocket.disconnect();
    }
    // このとき接触しているフィーダーは無い
    this.touchedFeederSocket = null;
  }

  /**
   * フィーダーを設置する。
   */
  putFeeder(feederSocket: FeederSocket) {
    this.layoutManager.putFeeder(feederSocket)
    this.storeProxy.commitFeeders(this.layoutManager.feederSockets)
  }

  //==============================
  // ギャップジョイナー設置モードに関わるメソッド
  //==============================

  /**
   * 設置されるギャップジョイナーのガイドを半透明で表示する。
   * @param {GapSocket} gapSocket at the mouse cursor
   */
  showGapToPut(gapSocket: GapSocket) {
    this.touchedGapSocket = gapSocket;
    this.touchedGapSocket.connect(true);
    if (this.touchedGapSocket.joint.isConnected()) {
      this.touchedGapSocket.joint.connectedJoint.gapSocket.connect(true);
    }
  }

  /**
   * 設置されるギャップジョイナーのガイドを消去する。
   */
  hideGapToPut() {
    // 接続試行中ならガイドを消去する
    if (this.touchedGapSocket && this.touchedGapSocket.gapState === GapState.CONNECTING) {
      this.touchedGapSocket.disconnect();
      if (this.touchedGapSocket.joint.isConnected()) {
        this.touchedGapSocket.joint.connectedJoint.gapSocket.disconnect();
      }
    }
    // このとき接触しているフィーダーは無い
    this.touchedGapSocket = null;
  }

  /**
   * ギャップジョイナーを設置する。
   */
  putGap(gapSocket: GapSocket) {
    this.layoutManager.putGap(gapSocket);
    this.storeProxy.commitGaps(this.layoutManager.gapSockets)
  }

  //==============================
  // UIイベントハンドラ / マウス移動
  //==============================

  /**
   * マウス移動時のハンドラ
   * @param {ToolEvent} event
   */
  handleMouseMove(event: ToolEvent) {

    // レイアウトが空ならグリッドジョイントをカーソルの周囲に生成する
    if (this.isLayoutBlank()) {
      this.putGridJoints(event.point);
    }

    // ジョイント上にマウスが乗った時の処理
    if (this.isRailMode() || this.isGapJoinerMode()) {
      this.hideRailToPut();
      this.handleMouseMoveOnJoint(event);
    }
    // フィーダー上にマウスが乗った時の処理
    if (this.isFeederMode()) {
      this.hideFeederToPut();
      this.handleMouseMoveOnFeeder(event);
    }
    // ギャップジョイナー上にマウスが乗った時の処理
    if (this.isGapJoinerMode()) {
      this.hideGapToPut();
      this.handleMouseMoveOnGapJoiner(event);
    }
  }

  /**
   * ジョイント上にマウスが乗った時の処理
   * @param {ToolEvent} event
   */
  handleMouseMoveOnJoint(event: ToolEvent) {
    // 乗っているジョイントを取得
    let joint = this.getJoint(event.point);
    if (this.isRailMode()) {
      // ジョイント上かつ接続中でないならレール設置ガイドを表示する
      if (joint && joint.jointState !== JointState.CONNECTED) {
        this.showRailToPut(joint);
      }
    }
  }

  /**
   * フィーダー上にマウスが乗った時の処理
   * @param {ToolEvent} event
   */
  handleMouseMoveOnFeeder(event: ToolEvent) {
    // 乗っているフィーダーを取得
    let feederSocket = this.layoutManager.getFeederSocket(event.point);

    // フィーダーソケット上かつ接続中でないならフィーダー設置ガイドを表示する
    if (feederSocket && feederSocket.connectionState !== FeederConnectionState.CONNECTED) {
      this.showFeederToPut(feederSocket);
    }
  }

  /**
   * ギャップジョイナーソケット上にマウスが乗った時の処理
   * @param {ToolEvent} event
   */
  handleMouseMoveOnGapJoiner(event: ToolEvent) {
    // 乗っているギャップソケットを取得
    let gap = this.layoutManager.getGapSocket(event.point);
    if (this.isGapJoinerMode()) {
      // ギャップソケット上かつ接続中でないならギャップ設置ガイドを表示する
      if (gap && gap.gapState !== GapState.CONNECTED) {
        this.showGapToPut(gap);
      }
    }
  }

  //==============================
  // UIイベントハンドラ / マウス左クリック
  //==============================

  /**
   * マウスクリック時のハンドラ
   * TODO: TypeDefinitionにeventが欠けている？
   * @param {ToolEvent} event
   */
  handleMouseDown(event: any) {
    let buttons = {
      0: "Left",
      2: "Right"
    }
    let buttonName = buttons[event.event.button];
    if (buttonName) {
      this[this.handleMouseDown.name + buttonName](event);
    }
  }

  /**
   * マウス左クリック時のハンドラ。以下の処理を行う。
   *   - 未接続のジョイント上ならば、現在選択中のレールと接続する。
   *   - レールならば、そのレールを選択する。
   * @param {ToolEvent} event
   */
  handleMouseDownLeft(event: ToolEvent) {

    log.info("handleMouseDownLeft START----------");

    // ジョイント・レールパーツをクリックした時の処理
    if (this.isRailMode()) {
      // ジョイントの処理を優先
      if (this.handleMouseDownLeftOnJoint(event)) {
        log.info("handleMouseDownLeft END by Joint------------");
        return;
      }
      // レールパーツの処理
      this.handleMouseDownLeftOnRailPart(event);
      log.info("handleMouseDownLeft END by RailPart------------");
    }

    // フィーダーをクリックした時の処理
    if (this.isFeederMode()) {
      if (this.handleMouseDownLeftOnFeeder(event)) {
        log.info("handleMouseDownLeft END by Feeder------------");
      }
    }

    // ギャップジョイナーをクリックした時の処理
    if (this.isGapJoinerMode()) {
      if (this.handleMouseDownLeftOnGapJoiner(event)) {
        log.info("handleMouseDownLeft END by Gap------------");
      }
    }

    // フィーダー選択モードは左クリック後にフィーダーモードに移る
    // TODO: 本当にフィーダーモードに戻っていいのか考える
    if (this.isFeederSelectingMode()) {
      this.storeProxy.commitSetEditorMode(EditorMode.FEEDER)
    }
  }

  /**
   * ジョイント上でマウス左クリックした時の処理
   * @param {ToolEvent} event
   * @returns {boolean} 何かしたらtrue, 何もしなければfalse
   */
  handleMouseDownLeftOnJoint(event: ToolEvent) {
    let joint = this.getJoint(event.point);
    if (! joint) {
      return false;
    }
    // 未接続ならジョイント結合・レール設置処理
    if (joint.jointState !== JointState.CONNECTED) {
      let isLayoutBlank = this.isLayoutBlank();
      this.putSelectedRail(joint)
      // レイアウトが空だったらグリッドジョイントを削除する
      if (isLayoutBlank) {
        this.removeGridJoints();
      }
    }
    return true;
  }

  handleMouseDownLeftOnRailPart(event: ToolEvent) {
    let railPart = this.layoutManager.getRailPart(event.point);
    if (! railPart) {
      return false
    }
    // レールの選択状態をトグルする
    railPart.path.selected = !railPart.path.selected;
    // event.item.selected = !event.item.selected; // 選択を反転
    return;
  }

  /**
   * フィーダー上で左クリックした時の処理
   * @param {ToolEvent} event
   */
  handleMouseDownLeftOnFeeder(event: ToolEvent): boolean {
    let feederSocket = this.layoutManager.getFeederSocket(event.point);
    if (! feederSocket) {
      return false;
    }
    // 未接続ならフィーダー接続処理、接続済みなら選択処理
    if (feederSocket.connectionState !== FeederConnectionState.CONNECTED) {
      this.putFeeder(feederSocket);
    } else {
      // Runモードのフィーダー選択モードなら、選択したフィーダーを通知
      if (this.isFeederSelectingMode()) {
        this.storeProxy.commitFeedersSelected(feederSocket)
      } else {
        feederSocket.basePart.path.selected = !feederSocket.basePart.path.selected;
        feederSocket.connectedFeeder.path.selected = !feederSocket.connectedFeeder.path.selected;
      }
    }
    return true;
  }

  /**
   * ギャップジョイナー上で左クリックした時の処理
   * @param {ToolEvent} event
   */
  handleMouseDownLeftOnGapJoiner(event: ToolEvent): boolean {
    let gapSocket = this.layoutManager.getGapSocket(event.point);
    if (! gapSocket) {
      return false;
    }
    // 未接続ならギャップ接続処理、接続済みなら選択処理
    if (gapSocket.gapState !== GapState.CONNECTED) {
      this.putGap(gapSocket);
    } else {
      gapSocket.basePart.path.selected = !gapSocket.basePart.path.selected;
      gapSocket.connectedGap.path.selected = !gapSocket.connectedGap.path.selected;
    }
    return true;
  }

  //==============================
  // UIイベントハンドラ / マウス右クリック
  //==============================

  /**
   * マウス右クリック時のハンドラ。以下の処理を行う。
   *   - 未接続のジョイント上ならば、現在選択中のレールの向きを変える。
   *
   * @param {ToolEvent} event
   */
  handleMouseDownRight(event: ToolEvent) {
    let joint = this.getJoint(event.point);
    if (joint && joint.jointState !== JointState.CONNECTED) {
      joint.disconnect();
      this.incrementJointIndexOfGuide();
      this.showRailToPut(joint);
    }

    let feederSocket = this.layoutManager.getFeederSocket(event.point);
    if (feederSocket && feederSocket.connectionState !== FeederConnectionState.CONNECTED) {
      feederSocket.toggleDirection();
      feederSocket.disconnect();
      this.showFeederToPut(feederSocket);
    }
  }

  /**
   * マウスドラッグ時のハンドラ。
   * @param event
   */
  handleMouseDrag(event: ToolEvent) {
    log.info("down point: ", event.downPoint);
    log.info("event point: ", event.point);
    log.info("delta ", event.delta);
  }

  startSimulation() {
    this.layoutSimulator.init(this.layoutManager.rails, this.layoutManager.feederSockets, this.layoutManager.gapSockets);
    this.layoutSimulator.resetFlowSimulation();
    this.layoutSimulator.simulateAllFeeders();
  }


  /**
   * キーボード押下された時のハンドラ。以下の処理を行う。
   *   - DEL:   選択中のレールを削除する。
   *   - F:     選択中のレールにフィーダーを差す。
   *   - SPACE: 導通を確認する。
   *   - S:     選択中のレールの導通方向を切り替える。切り替え後は導通確認を再度実行する。
   *
   * @param {KeyEvent} event
   */
  handleKeyDown(event: KeyEvent) {
    let selectedItems = (<any>project).selectedItems;
    // 選択されたレールを取得
    let selectedRails = (<any>project).selectedItems
      .map(item => this.layoutManager.getRailFromRailPartPath(item))
      .filter(Boolean);
    // 選択されたフィーダーを取得
    let selectedFeederSockets = (<any>project).selectedItems
      .map(item => this.layoutManager.getFeederSocketFromPath(item))
      .filter(Boolean);
    // 選択されたギャップを取得
    let selectedGapSockets = (<any>project).selectedItems
      .map(item => this.layoutManager.getGapSocketFromPath(item))
      .filter(Boolean);

    log.info("Selected rail: ", selectedRails);
    log.info("Selected feeder: ", selectedFeederSockets);
    log.info("Selected gap: ", selectedGapSockets);
    switch (event.key) {
      case "backspace":
        selectedRails.forEach(r => this.layoutManager.removeRail(r));
        selectedFeederSockets.forEach(f => this.layoutManager.removeFeeder(f));
        selectedGapSockets.forEach(g => this.layoutManager.removeGap(g));
        break;
      // case "space":
      //     // 全てのレールを未チェック状態にする
      //     this.layoutSimulator.resetFlowSimulation();
      //     break;
      case "f":
        this.layoutSimulator.init(this.layoutManager.rails, this.layoutManager.feederSockets, this.layoutManager.gapSockets);
        this.layoutSimulator.resetFlowSimulation();
        this.layoutSimulator.simulateAllFeeders();
        break;
      case "s":
        selectedRails.forEach(r => r.toggleSwitch());
        this.layoutSimulator.resetFlowSimulation();
        this.layoutSimulator.simulateAllFeeders();
        break;
      // case "shift":
      //     this.modifierKeys.push("shift");
      //     break;
      // case "alt":
      //     this.modifierKeys.push("alt");
      //     break;
      // case "control":
      //     this.modifierKeys.push("control");
      //     break;
      // case "meta":
      //     this.modifierKeys.push("meta");
      //     break;
      // case "up":
      //     request = new XMLHttpRequest();
      //     request.open("POST", "http://0.0.0.0:5000/serial");
      //     request.send("f 1 c 30");
      //     break;
      // case "down":
      //     request = new XMLHttpRequest();
      //     request.open("POST", "http://0.0.0.0:5000/serial");
      //     request.send("f 1 c -30");
      //     break;
      // case "d":
      //     request = new XMLHttpRequest();
      //     request.open("POST", "http://0.0.0.0:5000/serial");
      //     request.send("f 1 d");
      //     break;
    }

    project.deselectAll();
  }

  handleKeyUp(event) {
    // switch (event.key) {
    //     case "shift":
    //         this.modifierKeys.remove("shift");
    //         log.info(this.modifierKeys);
    //         break;
    //     case "alt":
    //         this.modifierKeys.remove("alt");
    //         log.info(this.modifierKeys);
    //         break;
    //     case "control":
    //         this.modifierKeys.remove("control");
    //         break;
    //     // case "meta":
    //     //     this.modifierKeys.remove("meta");
    //     //     break;
    // }
    // log.info("Modifiers: ", this.modifierKeys);
  }

  handleOnFrame(event) {
    this.layoutManager.rails.forEach( rail => rail.animate(event));
  }
}
