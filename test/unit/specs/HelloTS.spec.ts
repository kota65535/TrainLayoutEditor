import {StraightRail} from "../../../src/lib/rails/StraightRail";
import {Point} from "paper";
import {deserialize, serialize} from "../../../src/lib/RailUtil";
import {initCanvas} from "../spec_helper";

describe('UAAA', () => {
  beforeAll(() => {
    initCanvas()
  })
  it('should serialize rail object into json string', () => {
    let serialized = serialize(new StraightRail(new Point(0, 0), 0, 280, true))
    console.log(serialized)
  })
  it('should deserialize string into rail object', () => {
    let serialized = serialize(new StraightRail(new Point(0, 0), 0, 280, true))
    console.log(serialized)
    let deserialized = deserialize(serialized)
    console.log(deserialized)
  })
})
