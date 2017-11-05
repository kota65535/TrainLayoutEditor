import {Point} from "paper";
import {customMatchers, initCanvas} from "test/unit/spec_helper";
import {StraightRail} from "../../../src/lib/rails/StraightRail";
import {CurveRail} from "../../../src/lib/rails/CurveRail";

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

describe('Rail', function() {
  beforeAll(function() {
    initCanvas();
  })
  it('creates new instance', function() {
    new StraightRail(new Point(0, 0), 0, 200, true)

  });
});

describe('Rail:CurveRail', function() {
  beforeAll(function() {
    initCanvas();
  })
  it('creates new instance', function() {
    new CurveRail(new Point(0, 0), 0, 200, 45, true)
    new CurveRail(new Point(0, 100), 45, 200, 45, true)

  });
});

