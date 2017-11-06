import {Point} from "paper";
import {customMatchers, initCanvas} from "test/unit/spec_helper";
import {StraightRail} from "../../../src/lib/rails/StraightRail";
import {CurveRail} from "../../../src/lib/rails/CurveRail";
import {CurvedTurnout, SimpleTurnout, SymmetricalTurnout, TurnoutDirection} from "../../../src/lib/rails/Turnout";

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

describe('StraightRail', function () {
  beforeAll(function() {
    initCanvas();
  })
  it('creates new instance', function() {
    let r1 = new StraightRail(new Point(0, 0), 30, 200, true)
    let r2 = new StraightRail(new Point(200, 0), 0, 200, true)
  });

  it('moves', function () {
    let r1 = new StraightRail(new Point(-100, 100), 30, 200, true)
    r1.move(new Point(0, 200), new Point(-100, 100))
  });

  it('relatively moves', function () {
    let r1 = new StraightRail(new Point(-100, 100), 30, 200, true)
    r1.moveRelatively(new Point(300, 100))
  });

  it('rotates', function () {
    let r1 = new StraightRail(new Point(0, 400), 30, 200, true)
    r1.rotate(45, new Point(0, 400))
  });

  it('rotates relatively', function () {
    let r1 = new StraightRail(new Point(200, 400), 30, 200, true)
    r1.rotate(30, new Point(100, 400))
  });

  it('scales', function () {
    let r1 = new StraightRail(new Point(0, 600), 30, 200, true)
    r1.scale(0.5, 0.5, r1.bounds.center)

    let r2 = new StraightRail(new Point(200, 600), 30, 200, true)
    r2.scale(0.5, 0.5, r2.startPoint)
  });

  it('connects', function () {
    let r1 = new StraightRail(new Point(0, 800), 30, 200, true)
    let r2 = new StraightRail(new Point(200, 800), 30, 200, true)
    r1.connect(r1.joints[1], r2.joints[0])
  })

});

describe('CurveRail class', function () {
  beforeAll(function() {
    initCanvas();
  })
  it('creates new instance', function() {
    let r1 = new CurveRail(new Point(0, 0), 0, 200, 45, true)
    let r2 = new CurveRail(new Point(200, 0), 45, 200, 45, true)
  });
  it('connects', function () {
    let r1 = new CurveRail(new Point(0, 200), 30, 200, 45, true)
    let r2 = new CurveRail(new Point(200, 200), 30, 200, 45, true)
    r1.connect(r1.joints[1], r2.joints[0])
  })
  it('sets opacity', function () {
    let r1 = new CurveRail(new Point(0, 400), 30, 200, 45, true)
    r1.opacity = 0.5
    let r2 = new CurveRail(new Point(200, 400), 30, 200, 45, true)
    r2.visible = false
    let r3 = new CurveRail(new Point(400, 400), 30, 200, 45, true)
    r3.remove()
  });
  it('enables parts', function () {
    let r1 = new CurveRail(new Point(0, 600), 30, 200, 45, true)
    r1.enableJoints(true, true)
    r1.enableFeederSockets(false, false)
    r1.enableGapSockets(false, false)
    let r2 = new CurveRail(new Point(200, 600), 30, 200, 45, true)
    r2.enableJoints(true, false)
    r2.enableFeederSockets(true, true)
    r2.enableGapSockets(false, false)
    let r3 = new CurveRail(new Point(400, 600), 30, 200, 45, true)
    r3.enableJoints(true, false)
    r3.enableFeederSockets(false, false)
    r3.enableGapSockets(true, true)
  });

});

describe('Turnout class', function () {
  beforeAll(function () {
    initCanvas();
  })
  it('creates new instance', function () {
    let r1 = new SimpleTurnout(new Point(0, 0), 30, 100, 200, 30, TurnoutDirection.LEFT)
    let r2 = new SimpleTurnout(new Point(200, 0), 30, 100, 200, 30, TurnoutDirection.RIGHT)
    let r3 = new SymmetricalTurnout(new Point(400, 0), 30, 200, 45)
    let r4 = new CurvedTurnout(new Point(0, 200), 0, 250, 200, 45, TurnoutDirection.RIGHT)
  });
  it('connects', function () {
    let r2 = new SimpleTurnout(new Point(200, 200), 30, 100, 200, 30, TurnoutDirection.RIGHT)

  });
})
