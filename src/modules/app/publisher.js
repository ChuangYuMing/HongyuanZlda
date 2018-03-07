import { Publisher } from 'tools/pub-sub'

const orderPub = new Publisher()
const ticksPub = new Publisher()
const eventQuotePub = new Publisher()
const bidAskPub = new Publisher()
const cancelOrderPub = new Publisher()
const mainPopUpPub = new Publisher()
const dealHistoryPub = new Publisher()

export {
  orderPub,
  ticksPub,
  eventQuotePub,
  bidAskPub,
  cancelOrderPub,
  mainPopUpPub,
  dealHistoryPub
}
