import {Point} from "paper";
import {customMatchers, initCanvas} from "test/unit/spec_helper";
import {TrianglePart} from "src/lib/parts/primitives/TrianglePart";

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

describe('TrianglePart', function() {
  beforeAll(function() {
    initCanvas();
  })
  it('creates rectangle at specified position, angle and size.', function() {
    let part = new TrianglePart(new Point(100,100), 0, 50, 50, 'black');
    expect(part.position).toBeAt(new Point(100, 100))

    part.move(new Point(200,100))
    expect(part.position).toBeAt(new Point(200, 100))

    let part2 = new TrianglePart(new Point(200,100), 45, 50, 50, 'black');
    expect(part2.position).toBeAt(new Point(200, 100))
    part2.rotate(30)
    expect(part2.position).toBeAt(new Point(200, 100))
  });
  it('moves to specified point on the basis of the position', function() {
    let part = new TrianglePart(new Point(50, 50), 0, 50, 50, 'blue');
    part.move(new Point(100, 200));
    expect(part.position).toBeAt(new Point(100,200));
  });
  it('moves relatively by specified distance on the basis of the position', function() {
    let part = new TrianglePart(new Point(50, 50), 45, 50, 50, 'blue');
    part.moveRelatively(new Point(250, 150));
    expect(part.position).toBeAt(new Point(300, 200));
  });

  // 回転させるとbounds.centerの位置がずれるので
  it('rotates to specified angle around the position', function() {
    let part = new TrianglePart(new Point(100, 300), 30, 50, 50, 'green');
    part.rotate(45);
    expect(part.position).toBeAt(new Point(100, 300));
    expect(part.angle).toBe(45);
  });
  it('rotates by specified angle around the position', function() {
    let part = new TrianglePart(new Point(300, 300), 30, 50, 50, 'green');
    part.rotateRelatively(15);
    expect(part.position).toBeAt(new Point(300, 300));
    expect(part.angle).toBe(45);
  });

  it('removes existing part', function() {
    let part = new TrianglePart(new Point(100, 400), 30, 50, 50, 'green');
    part.remove();
  });
  it('set visibility', function() {
    let part = new TrianglePart(new Point(200, 400), 30, 50, 50, 'green');
    part.visible = false;
    expect(part.visible).toBe(false);
  });
  it('set opacity', function() {
    let part = new TrianglePart(new Point(300, 400), 30, 50, 50, 'green');
    part.opacity = 0.5;
    expect(part.opacity).toBe(0.5);
  });
});
