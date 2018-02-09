import {
  orderPub,
  ticksPub,
  eventQuotePub,
  bidAskPub
} from 'modules/app/publisher'
import { Observer } from 'tools/pub-sub'
import { store } from 'store'
import { changeOrderStatus, bidAndAskTick, updateTick } from './actions'
import { numAddDecimal } from 'tools/apex-dataformat.js'

const dispatch = store.dispatch
const orderObs = new Observer()
const ticksObs = new Observer()
const quoteObs = new Observer()
const bidAskObs = new Observer()

class SocketHandler {
  constructor() {}
  on() {
    orderObs.subscribe(orderPub, data => {
      dispatch(changeOrderStatus(data))
    })
    ticksObs.subscribe(ticksPub, data => {
      dispatch(updateTick(data))
    })
    quoteObs.subscribe(eventQuotePub, data => {
      let symbol = data['12015'] || data['Symbol']
      if (!window.allprodsforstock.prodList[symbol]) {
        return
      }
      let priceDec = window.allprodsforstock.prodList[symbol].PriceDec
      let obj = {
        Symbol: symbol,
        update: true
      }
      for (let item of data['12016']) {
        switch (item['871']) {
          case '1025':
            obj.Open = numAddDecimal(item['872'], priceDec)
            break
          case '332':
            obj.high = numAddDecimal(item['872'], priceDec)
            break
          case '333':
            obj.low = numAddDecimal(item['872'], priceDec)
            break
          case '14':
            obj.TotVol = item['872']
            break
          case '31':
            obj.Price = numAddDecimal(item['872'], priceDec)
            break
          default:
            return
        }
      }
      if (Object.keys(obj).length > 2) {
        dispatch(updateTick(obj))
      }
    })
    bidAskObs.subscribe(bidAskPub, data => {
      let allProds = window.allprodsforstock
      let symbol = data['48']
      let priceDec = allProds.prodList[symbol].PriceDec
      // console.log(symbol, priceDec)
      let baObj = {
        Symbol: symbol,
        BPrice: data['11503']['12011']
          ? numAddDecimal(data['11503']['12011'][0]['270'], priceDec)
          : '--',
        APrice: data['11503']['12012']
          ? numAddDecimal(data['11503']['12012'][0]['270'], priceDec)
          : '--',
        update: true
      }
      dispatch(bidAndAskTick(baObj))
    })
  }
  off() {
    orderObs.unsubscribe(orderPub)
    ticksObs.unsubscribe(ticksPub)
    quoteObs.unsubscribe(eventQuotePub)
    bidAskObs.unsubscribe(bidAskPub)
  }
}

export default new SocketHandler()
