import { mainPopUpPub } from 'modules/app/publisher'
import { Observer } from 'tools/pub-sub'
import { store } from 'store'
import { changeOrderStatus, bidAndAskTick, updateTick } from './actions'
import appGlobal from 'modules/common/app-global.js'
import { orderTypeMaping } from 'tools/format-res-data.js'
import { updateMainPopUpMsg } from 'modules/main/actions.js'
import { searchProperty, changeToLocalTime } from 'tools/other.js'

const dispatch = store.dispatch
const mainPopUpObs = new Observer()

class SocketHandler {
  constructor() {}
  on() {
    mainPopUpObs.subscribe(mainPopUpPub, data => {
      console.log('@@@', data)
      let status = 'success'
      let {
        TransactTime,
        Account,
        Username,
        Symbol,
        Side: side,
        OrdType,
        Price,
        OrderQty,
        MsgType,
        OrdStatus,
        Text,
        CxlRejResponseTo,
        ClOrdID,
        LastQty,
        ExecType,
        OrderID,
        CxlQty
      } = data
      let { CName } = searchProperty(
        store.getState().main.get('customerInfo'),
        ['CName'],
        ['Account', Account]
      )

      let ttime = changeToLocalTime(TransactTime)
      // let side = Side === '1' ? '買' : '賣'
      let orderType = orderTypeMaping(OrdType)
      let popupMsg = ''
      let statusMsg = ''
      let volume = ''
      if (ExecType === '0') {
        status = 'success'
        statusMsg = '委託成功'
        volume = OrderQty
      }
      if (ExecType === '4' && OrdStatus === '4') {
        status = 'success'
        statusMsg = '已取消'
        volume = CxlQty
      }
      if (ExecType === '8') {
        //委託回報
        status = 'error'
        statusMsg = Text
        volume = OrderQty
      }
      if (ExecType === 'F') {
        //部分成交/全部成交
        if (OrdStatus === '1') {
          statusMsg = '部分成交'
          status = 'partialDeal'
        }
        if (OrdStatus === '2') {
          statusMsg = '完全成交'
          status = 'allDeal'
        }

        volume = LastQty
      }
      if (MsgType === '9' && CxlRejResponseTo === '1') {
        //刪單失敗
        let order = store
          .getState()
          .order.get('orderList')
          .find(i => i.get('OrderID') === OrderID)
        console.log('order', order)
        ttime = changeToLocalTime(order.get('TransactTime'))
        Account = order.get('Account')
        orderType = orderTypeMaping(order.get('OrdType'))
        Symbol = order.get('Symbol')
        Price = order.get('Price')
        volume = order.get('LeavesQty')
        status = 'error'
        statusMsg = Text
      }
      popupMsg = `<span>${ttime} ${statusMsg}, 帳號：${Account},${CName}, ${orderType}</span>
        <br/>
        <span>${Symbol},  價格：${Price},  數量：${volume}股</span>
        `
      dispatch(updateMainPopUpMsg(popupMsg, status, side))
    })
  }
  off() {
    mainPopUpObs.unsubscribe(mainPopUpPub)
  }
}

export default new SocketHandler()
