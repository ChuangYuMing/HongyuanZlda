import { orderPub } from 'modules/app/publisher'
import { Observer } from 'tools/pub-sub'
import { store } from 'store'
import { changeOrderStatus } from './actions'

const dispatch = store.dispatch
const orderObs = new Observer()

class SocketHandler {
  constructor() {}
  on() {
    orderObs.subscribe(orderPub, data => {
      dispatch(changeOrderStatus(data))
    })
  }
  off() {
    orderObs.unsubscribe(orderPub)
  }
}

export default new SocketHandler()
