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
    let part = new StraightRailPart(new Point(0, 0), 0, 140, RailPartAnchor.START, true)
    part.move(new Point(0, 100), RailPartAnchor.START)
    part.rotate(45, RailPartAnchor.START)

    let part2 = new StraightRailPart(new Point(0, 200), 45, 140, RailPartAnchor.END, true)

    let part3 = new StraightRailPart(new Point(0, 100), 0, 140, RailPartAnchor.START, true)
    part3.move(new Point(0, 300))
    part3.rotate(45)

  });
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
    // let part3 = new StraightRailPart(new Point(0, 100), 0, 140, RailPartAnchor.START, true)
    // part3.move(new Point(0, 300))
    // part3.rotate(45)

  });
});

