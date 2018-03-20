import { cancelOrderPub, dealHistoryPub } from 'modules/app/publisher'
import { Observer } from 'tools/pub-sub'
import { store } from 'store'
import appGlobal from 'modules/common/app-global.js'
import { getInventory } from './actions.js'

const dispatch = store.dispatch
const dealHistoryObs = new Observer()

class SocketHandler {
  constructor() {}
  on() {
    dealHistoryObs.subscribe(dealHistoryPub, data => {
      let state = store.getState()
      let tokenId = state.app.get('userToken')
      let { account, branch } = state.main.get('targetAccount').toJS()
      let params = {
        TokenID: tokenId,
        Account: account,
        Branch: branch
      }
      if (account !== undefined && account !== '') {
        dispatch(getInventory(params))
      }
    })
  }
  off() {
    dealHistoryObs.unsubscribe(dealHistoryPub)
  }
}

export default new SocketHandler()
