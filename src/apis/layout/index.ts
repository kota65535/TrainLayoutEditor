import {fetch2} from "../utis";

export class LayoutAPI {
  endpoint: string
  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  addPowerPack(userId: number, powerPackId: number) {
    fetch2(`${this.endpoint}/users/${userId}/powerPacks/${powerPackId}`, {
      method: 'POST',
    }).then(res => {
      console.log(res)
    }).catch(res => {
      console.log(res)
    })
  }

  deletePowerPack(userId: number, powerPackId: number) {
    fetch2(`${this.endpoint}/users/${userId}/powerPacks/${powerPackId}`, {
      method: 'POST',
    }).then(res => {
      console.log(res)
    }).catch(res => {
      console.log(res)
    })
  }

  setPowerPackPower(userId: number, powerPackId: number, power: number) {
    fetch2(`${this.endpoint}/users/${userId}/powerPacks/${powerPackId}`, {
      method: 'PUT',
      body: { power: power }
    }).then(res => {
      console.log(res)
    }).catch(res => {
      console.log(res)
    })
  }

  setPowerPackDirection(userId: number, powerPackId: number, direction: number) {
    fetch2(`${this.endpoint}/users/${userId}/powerPack/${powerPackId}`, {
      method: 'PUT',
      body: { direction: direction }
    }).then(res => {
      console.log(res)
    }).catch(res => {
      console.log(res)
    })
  }

  addSwitcher(userId: number, switcherId: number) {
    fetch2(`${this.endpoint}/users/${userId}/switchers/${switcherId}`, {
      method: 'POST',
    }).then(res => {
      console.log(res)
    }).catch(res => {
      console.log(res)
    })
  }

  setSwitcherDirection(userId: number, switcherId: number, direction: number) {
    fetch2(`${this.endpoint}/users/${userId}/switchers/${switcherId}`, {
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
