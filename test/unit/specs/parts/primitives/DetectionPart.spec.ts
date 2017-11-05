import {Path, Point, Size} from "paper";
import {customMatchers, initCanvas} from "test/unit/spec_helper";
import {DetectablePart} from "src/lib/parts/primitives/DetectablePart";

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

describe('DetectionPart', function() {
  beforeAll(function() {
    initCanvas();
  })
  it('creates rectangle at specified position, angle and size.', function() {
    let mainPath = new Path.Rectangle(new Point(0,0), new Size(100, 100))
    let detectionPath = new Path.Rectangle(new Point(0,0), new Size(200, 200))
    let part = new DetectablePart(new Point(100,100), 0, mainPath, detectionPath, ['black', 'blue', 'red'], [0.5, 0.4, 0.3], true)
    part.enabled = true
  });
});
