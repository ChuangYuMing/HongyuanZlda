import { cancelOrderPub } from 'modules/app/publisher'
import { Observer } from 'tools/pub-sub'
import { store } from 'store'
import { changeOrderStatus, bidAndAskTick, updateTick } from './actions'
import { numAddDecimal } from 'tools/apex-dataformat.js'
import { Map } from 'immutable'
import appGlobal from 'modules/common/app-global.js'
const dispatch = store.dispatch
const cancelOrderObs = new Observer()

class SocketHandler {
  constructor() {}
  on() {
    cancelOrderObs.subscribe(cancelOrderPub, data => {
      let clorderid = data.ClOrdID
      let peddingOrder = appGlobal.needingOrderPending
      peddingOrder.forEach(element => {
        console.log(element.clorderid, clorderid)
        if (clorderid && element.clorderid === clorderid) {
          element.callback()
        }
      })
    })
  }
  off() {
    cancelOrderObs.unsubscribe(cancelOrderPub)
  }
}

export default new SocketHandler()
