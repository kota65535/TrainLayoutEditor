import {initCanvas} from "test/unit/spec_helper";
import {Group, Path, Point} from "paper";
import {StraightRail} from "src/lib/rails/StraightRail";
import {RailFactory} from "../../../src/lib/RailFactory";
import {Rail} from "../../../src/lib/rails/Rail";
import {CurvedTurnout, SimpleTurnout, TurnoutDirection} from "../../../src/lib/rails/Turnout";

describe('Rail class', () => {
  beforeAll(function() {
    initCanvas();
  })
  it('creates new rail', () => {
    let r1 = new StraightRail(new Point(0, 0), 0, 100, true)
    let r2 = new StraightRail(new Point(0, 0), 30, 200, true)
    let r3 = new StraightRail(new Point(0, 0), 60, 300, true)
  })
  it('move', () => {
    let rail = new StraightRail(new Point(0, 0), 0, 280, true)
    rail.move(new Point(0, 100), rail.startPoint)
  })
  it('connect', () => {
    // from
    let r1 = new StraightRail(new Point(0, 0), 0, 280, true)
    // to
    let r2 = new StraightRail(new Point(0, 70), 0, 280, true)

    r1.connect(r1.joints[0], r2.joints[1])
  })
  it('remove', () => {
    let r1 = new StraightRail(new Point(0, 0), 0, 280, true)
    let r2 = new StraightRail(new Point(0, 70), 0, 280, true)
    let r3 = new StraightRail(new Point(0, 140), 0, 280, true)

    r1.connect(r1.joints[0], r2.joints[1])
    r2.remove()
  })
  it('setVisible', () => {
    let r1 = new StraightRail(new Point(0, 0), 0, 280, true)
    let r2 = new StraightRail(new Point(0, 70), 0, 280, true)
    r1.setVisible(false)
    r2.setVisible(false)
    r1.setVisible(true)
  })

  it('scales', () => {
    // let rail = new StraightRail(new Point(0, 100), 0, 200, true)
    // rail.scale(0.5, 0.5, new Point(0, 0))

    let rail = RailFactory['S140']();
    let bounds = rail.getBounds();
    rail.move(new Point(100,100), bounds.center);
    rail.scale(0.4, 0.4, new Point(100,100));
    rail.disableJoints()
  })

  it('simple turnout', () => {
    let r1 = new SimpleTurnout(new Point(0, 0), 0, 140, 541, 15, TurnoutDirection.LEFT)
    let r2 = new SimpleTurnout(new Point(0, 0), 60, 140, 541, 15, TurnoutDirection.LEFT)
  })
  it('curved turnout', () => {
    let r1 = new CurvedTurnout(new Point(100,100), 0, 317, 280, 45, TurnoutDirection.RIGHT)
    let r2 = new CurvedTurnout(new Point(100,100), 60, 317, 280, 45, TurnoutDirection.RIGHT)
  })
})
