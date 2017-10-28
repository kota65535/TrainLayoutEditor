

import {initCanvas} from "test/unit/spec_helper";
import {StraightRailPart} from "src/lib/rails/parts/StraightRailPart";
import {RailPartAnchor} from "src/lib/rails/parts/RailPart";
import {Point} from "paper";

describe('RailPart', () => {
  beforeAll(function() {
    initCanvas();
  })
  it('isa', () => {
    let rail = new StraightRailPart(new Point(0, 0), 0, 280, RailPartAnchor.START, true)
    rail.scale(0.5, 0.5)
    new StraightRailPart(new Point(0, 70), 0, 280, RailPartAnchor.START, true)
  })
})
