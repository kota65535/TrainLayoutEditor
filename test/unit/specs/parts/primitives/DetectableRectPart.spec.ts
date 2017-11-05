import {Point} from "paper";
import {customMatchers, initCanvas} from "test/unit/spec_helper";
import {DetectableRectPart} from "src/lib/parts/primitives/DetectableRectPart";
import {DetectableTrianglePart} from "src/lib/parts/primitives/DetectableTrianglePart";
import {createCirclePath} from "../../../../../src/lib/parts/primitives/CirclePart";
import {createRectPath} from "../../../../../src/lib/parts/primitives/RectPart";
import {createTrianglePath} from "../../../../../src/lib/parts/primitives/TrianglePart";

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

describe('DetectableRectPart', function() {
  beforeAll(function() {
    initCanvas();
  })
  it('creates new instance', function() {
    // With rectangle detection part
    let part = new DetectableRectPart(new Point(100,100), 0, 100, 100, createRectPath(150, 150), ['black', 'blue', 'red'], [0.5, 0.4, 0.3], true)
    part.move(new Point(100, 100))
    part.rotate(45)

    let part2 = new DetectableRectPart(new Point(100,100), 0, 100, 100, createCirclePath(100), ['black', 'blue', 'red'], [0.5, 0.4, 0.3], true)
    part.move(new Point(200, 200))
    part.rotate(45)

  });
});

describe('DetectableTrianglePart', function() {
  beforeAll(function() {
    initCanvas();
  })
  it('creates new instance', function() {
    // With triangle detection part
    let part = new DetectableTrianglePart(new Point(0,0), 0, 100, 100, createTrianglePath(150, 150), ['black', 'blue', 'red'], [0.5, 0.4, 0.3], true)
    part.move(new Point(100, 100))
    part.rotate(45)

    let part2 = new DetectableTrianglePart(new Point(0,0), 0, 100, 100, createCirclePath(100), ['black', 'blue', 'red'], [0.5, 0.4, 0.3], true)
    part2.move(new Point(200, 200))
    part2.rotate(45)
  });
});
