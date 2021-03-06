import { cancelOrderPub, dealHistoryPub } from 'modules/app/publisher'
import { Observer } from 'tools/pub-sub'
import { store } from 'store'
import { changeOrderStatus, bidAndAskTick, updateTick } from './actions'
import { addDealHistory } from 'modules/order/actions.js'
import { numAddDecimal } from 'tools/apex-dataformat.js'
import { Map } from 'immutable'
import appGlobal from 'modules/common/app-global.js'

const dispatch = store.dispatch
const cancelOrderObs = new Observer()
const dealHistoryObs = new Observer()

class SocketHandler {
  constructor() {}
  on() {
    cancelOrderObs.subscribe(cancelOrderPub, data => {
      let orderId = data.OrderID
      //for 改量改價
      let peddingOrder = appGlobal.needingOrderPending
      peddingOrder.forEach(element => {
        console.log(element.orderId, orderId)
        if (orderId && element.orderId === orderId) {
          element.callback()
        }
      })
    })
    dealHistoryObs.subscribe(dealHistoryPub, data => {
      // let orderId = data.OrderID
      dispatch(addDealHistory(data))
    })
  }
  off() {
    cancelOrderObs.unsubscribe(cancelOrderPub)
    dealHistoryObs.unsubscribe(dealHistoryPub)
  }
}

export default new SocketHandler()
