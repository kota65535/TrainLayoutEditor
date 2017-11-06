import {Point} from "paper";
import {customMatchers, initCanvas} from "test/unit/spec_helper";
import {RailPartAnchor} from "../../../../src/lib/parts/RailPart";
import {StraightRailPart} from "../../../../src/lib/parts/StraightRailPart";
import {CurveRailPart} from "../../../../src/lib/parts/CurveRailPart";

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

describe('StraightRailPart', function() {
  beforeAll(function() {
    initCanvas();
  })
  it('creates new instance', function() {
    let p1 = new StraightRailPart(new Point(0, 0), 45, 140, RailPartAnchor.START, true)

    let p2 = new StraightRailPart(new Point(0, 200), 45, 140, RailPartAnchor.END, true)
    p2.move(new Point(200, 0), RailPartAnchor.START)
    p2.rotate(15, RailPartAnchor.START)

    let p3 = new StraightRailPart(new Point(-100, -100), 15, 140, RailPartAnchor.START, true)
    p3.moveRelatively(new Point(500, 100))
    p3.rotateRelatively(45, RailPartAnchor.START)
  });
  it('sets opacity', function () {
    let p1 = new StraightRailPart(new Point(0, 400), 45, 140, RailPartAnchor.START, true)
    p1.opacity = 0.5
    let p2 = new StraightRailPart(new Point(200, 400), 45, 140, RailPartAnchor.START, true)
    p2.visible = false
  })
  it('scales', function () {
    let p1 = new StraightRailPart(new Point(0, 200), 45, 140, RailPartAnchor.START, true)
    p1.scale(0.5, 0.5)
    let p2 = new StraightRailPart(new Point(200, 200), 45, 140, RailPartAnchor.START, true)
    p2.scale(0.5, 0.5, RailPartAnchor.START)
  })

});

describe('CurveRailPart', function() {
  beforeAll(function() {
    initCanvas();
  })
  it('creates new instance', function() {
    let part = new CurveRailPart(new Point(0, 0), 0, 200, 45, RailPartAnchor.START, true)
    part.move(new Point(0, 100), RailPartAnchor.START)
    // part.rotate(-45, RailPartAnchor.START)

    let part2 = new CurveRailPart(new Point(0, 0), 30, 200, 22.5, RailPartAnchor.START, true)
    part2.move(new Point(0, 200), RailPartAnchor.START)
    part2.rotate(15, RailPartAnchor.START)
    // let part2 = new CurveRailPart(new Point(0, 200), 45, 140, RailPartAnchor.END, true)
    //
    // let p3 = new StraightRailPart(new Point(0, 100), 0, 140, RailPartAnchor.START, true)
    // p3.move(new Point(0, 300))
    // p3.rotate(45)

  });
});

