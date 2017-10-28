import {initCanvas} from "test/unit/spec_helper";
import {Group, Path, Point} from "paper";
import {StraightRail} from "src/lib/rails/StraightRail";

describe('Rail class', () => {
  beforeAll(function() {
    initCanvas();
  })
  it('aa!', () => {
    let rail = new StraightRail(new Point(0, 0), 0, 280, true)
    rail.scale(0.5, 0.5)
    let path1 = new Path.Rectangle(new Point(140, 140), new Point(210, 210))
    path1.fillColor = 'black'
    let path2 = new Path.Rectangle(new Point(140, 210), new Point(210, 280))
    path2.fillColor = 'black'
    let group = new Group([path1, path2])
    group.scale(0.5, 0.5)

  })
})
