import {Point} from "paper";
import {customMatchers, initCanvas} from "test/unit/spec_helper";
import {RectPart} from "src/lib/parts/primitives/RectPart";

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

describe('RectPart class', function () {
  beforeAll(function() {
    initCanvas();
  })
  it('creates new instance', function () {
    let p1 = new RectPart(new Point(100, 100), 45, 50, 50, 'black');
    let p2 = new RectPart(new Point(200, 100), 45, 50, 50, 'black');
    p1.scale(0.5, 0.3)
  });

  it('moves to specified point', function () {
    let p1 = new RectPart(new Point(50, 50), 0, 50, 50, 'blue');
    p1.move(new Point(100, 200));
    expect(p1.position).toBeAt(new Point(100, 200));

    let p2 = new RectPart(new Point(50, 50), 0, 50, 50, 'blue');
    p2.move(new Point(200, 200), p2.getCenterOfTop());
    expect(p2.position).toBeAt(new Point(200, 225));
  });

  it('moves relatively by specified distance', function () {
    let p1 = new RectPart(new Point(50, 50), 45, 50, 50, 'blue');
    p1.moveRelatively(new Point(250, 150));
    expect(p1.position).toBeAt(new Point(300, 200));
  });

  it('rotates to specified angle around the position', function() {
    let p1 = new RectPart(new Point(100, 300), 30, 50, 50, 'green');
    p1.rotate(45);
    expect(p1.position).toBeAt(new Point(100, 300));
    expect(p1.angle).toBe(45);

    let p2 = new RectPart(new Point(200, 300), 0, 50, 50, 'green');
    p2.rotate(90, p2.getCenterOfTop());
    expect(p2.position).toBeAt(new Point(175, 275));
    expect(p2.angle).toBe(90);
  });

  it('rotates relatively by specified angle around the position', function () {
    let p1 = new RectPart(new Point(300, 300), 30, 50, 50, 'green');
    p1.rotateRelatively(15);
    expect(p1.position).toBeAt(new Point(300, 300));
    expect(p1.angle).toBe(45);
  });

  it('removes existing part', function() {
    let p1 = new RectPart(new Point(100, 400), 30, 50, 50, 'red');
    p1.remove();
  });

  it('sets visibility', function () {
    let p1 = new RectPart(new Point(200, 400), 30, 50, 50, 'red');
    p1.visible = false;
    expect(p1.visible).toBe(false);
  });

  it('sets opacity', function () {
    let p1 = new RectPart(new Point(300, 400), 30, 50, 50, 'red');
    p1.opacity = 0.5;
    expect(p1.opacity).toBe(0.5);
  });

  it('scales', function () {
    let p1 = new RectPart(new Point(100, 500), 0, 50, 50, 'red');
    p1.scale(0.5, 0.9)
    // expect(p1.opacity).toBe(0.5);

    let p2 = new RectPart(new Point(200, 500), 30, 50, 50, 'red');
    p2.scale(0.5, 0.5)
  });


});
