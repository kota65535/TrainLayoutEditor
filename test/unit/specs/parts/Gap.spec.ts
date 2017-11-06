import {Point} from "paper";
import {customMatchers, initCanvas} from "test/unit/spec_helper";
import {RailPartAnchor} from "../../../../src/lib/parts/RailPart";
import {StraightRailPart} from "../../../../src/lib/parts/StraightRailPart";
import {GapSocket} from "../../../../src/lib/parts/GapSocket";
import {Joint, JointDirection} from "../../../../src/lib/parts/Joint";

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

describe('GapSocket', function () {
  beforeAll(function () {
    initCanvas();
  })
  it('creates new instance', function () {
    let p1 = new StraightRailPart(new Point(0, 0), 0, 140, RailPartAnchor.START, true)
    let j1 = new Joint(new Point(0, 0), 0, JointDirection.REVERSE_TO_ANGLE, null)
    let gs1 = new GapSocket(j1)
    gs1.enabled = true

    let p2 = new StraightRailPart(new Point(0, 100), 0, 140, RailPartAnchor.START, true)
    let j2 = new Joint(new Point(0, 100), 0, JointDirection.REVERSE_TO_ANGLE, null)
    let gs2 = new GapSocket(j2)
    gs2.enabled = true
    gs2.connect(true)

    let p3 = new StraightRailPart(new Point(0, 200), 0, 140, RailPartAnchor.START, true)
    let j3 = new Joint(new Point(0, 200), 0, JointDirection.REVERSE_TO_ANGLE, null)
    let gs3 = new GapSocket(j3)
    gs3.enabled = true
    gs3.connect()
  });
});
