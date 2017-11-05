import {Point} from "paper";
import {customMatchers, initCanvas} from "test/unit/spec_helper";
import {RailPartAnchor} from "../../../../src/lib/parts/RailPart";
import {StraightRailPart} from "../../../../src/lib/parts/StraightRailPart";
import {FeederSocket} from "src/lib/parts/FeederSocket";

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

describe('FeederSocket', function() {
  beforeAll(function() {
    initCanvas();
  })
  it('creates new instance', function() {
    let part = new StraightRailPart(new Point(0, 0), 0, 140, RailPartAnchor.START, true)
    part.move(new Point(0, 100), RailPartAnchor.START)
    part.rotate(45, RailPartAnchor.START)

    let fs = new FeederSocket(part)

    let part2 = new StraightRailPart(new Point(0, 0), 0, 140, RailPartAnchor.START, true)
    part2.move(new Point(0, 200), RailPartAnchor.START)
    part2.rotate(45, RailPartAnchor.START)
    let fs2 = new FeederSocket(part2)
    fs2.connect(true)

    let part3 = new StraightRailPart(new Point(0, 0), 0, 140, RailPartAnchor.START, true)
    part3.move(new Point(0, 300), RailPartAnchor.START)
    part3.rotate(45, RailPartAnchor.START)
    let fs3 = new FeederSocket(part3)
    fs3.connect()

  });
});
