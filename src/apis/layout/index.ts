import {fetch2} from "../utis";

export class LayoutAPI {
  endpoint: string
  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  addFeeder(userId: number, feederId: number, power: number) {
    fetch2(`${this.endpoint}/users/${userId}/feeders/${feederId}`, {
      method: 'POST',
    }).then(res => {
      console.log(res)
    }).catch(res => {
      console.log(res)
    })
  }

  deleteFeeder(userId: number, feederId: number, power: number) {
    fetch2(`${this.endpoint}/users/${userId}/feeders/${feederId}`, {
      method: 'DELETE',
    }).then(res => {
      console.log(res)
    }).catch(res => {
      console.log(res)
    })
  }

  setFeederPower(userId: number, feederId: number, power: number) {
    fetch2(`${this.endpoint}/users/${userId}/feeders/${feederId}`, {
      method: 'PUT',
      body: { power: power }
    }).then(res => {
      console.log(res)
    }).catch(res => {
      console.log(res)
    })
  }

  setFeederDirection(userId: number, feederId: number, direction: number) {
    fetch2(`${this.endpoint}/users/${userId}/feeders/${feederId}`, {
      method: 'PUT',
      body: { direction: direction }
    }).then(res => {
      console.log(res)
    }).catch(res => {
      console.log(res)
    })
  }

  setTurnoutDirection(userId: number, turnoutId: number, direction: number) {
    fetch2(`${this.endpoint}/users/${userId}/turnouts/${turnoutId}`, {
      method: 'PUT',
      body: { direction: direction }
    }).then(res => {
      console.log(res)
    }).catch(res => {
      console.log(res)
    })
  }
}


export default new LayoutAPI('http://localhost')
