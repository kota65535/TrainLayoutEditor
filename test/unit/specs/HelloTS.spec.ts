import Vue from 'vue'
import {StraightRail} from "../../../src/lib/rails/StraightRail";
import {Point} from "paper";
import {deserialize, serialize} from "../../../src/lib/RailUtil";

describe('RailUtil', () => {
  it('should serialize rail object into json string', () => {
    let serialized = serialize(new StraightRail(new Point(0, 0), 0, 280, true))
    console.log(serialized)
    // const Constructor = Vue.extend(HelloWorld)
    // const vm = new Constructor().$mount()
    // expect(vm.$el.querySelector('.hello h1').textContent)
    //   .to.equal('Welcome to Your Vue.js App')
  })
  it('should deserialize string into rail object', () => {
    let serialized = serialize(new StraightRail(new Point(0, 0), 0, 280, true))
    console.log(serialized)
    let deserialized = deserialize(serialized)
    console.log(deserialized)
  })
})
