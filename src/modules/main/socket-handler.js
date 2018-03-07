import { mainPopUpPub } from 'modules/app/publisher'
import { Observer } from 'tools/pub-sub'
import { store } from 'store'
import { changeOrderStatus, bidAndAskTick, updateTick } from './actions'
import appGlobal from 'modules/common/app-global.js'
import { orderTypeMaping } from 'tools/format-res-data.js'
import { updateMainPopUpMsg } from 'modules/main/actions.js'

const dispatch = store.dispatch
const mainPopUpObs = new Observer()

class SocketHandler {
  constructor() {}
  on() {
    mainPopUpObs.subscribe(mainPopUpPub, data => {
      let status = 'success'
      let {
        TransactTime,
        Account,
        Username,
        Symbol,
        Side,
        OrdType,
        Price,
        OrderQty,
        MsgType,
        OrdStatus,
        Text,
        CxlRejResponseTo,
        ClOrdID,
        LastQty,
        ExecType
      } = data
      let ttime = TransactTime ? TransactTime.split('-')[1].split('.')[0] : ''
      let side = Side === '1' ? '買' : '賣'
      let orderType = orderTypeMaping(OrdType)
      let popupMsg = ''
      let statusMsg = ''
      let volume = ''
      if (ExecType === '0') {
        status = 'success'
        statusMsg = '委託成功'
        volume = OrderQty
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
        }
        if (OrdStatus === '2') {
          statusMsg = '完全成交'
        }
        status = 'deal'
        volume = LastQty
      }
      if (MsgType === '9' && CxlRejResponseTo === '1') {
        //刪單失敗
        let order = store
          .getState()
          .order.get('orderList')
          .find(i => i.get('ClOrdID') === ClOrdID)
        console.log('order', order)
        ttime = order.get('TransactTime')
          ? order
              .get('TransactTime')
              .split('-')[1]
              .split('.')[0]
          : ''
        Account = order.get('Account')
        orderType = orderTypeMaping(order.get('OrdType'))
        Symbol = order.get('Symbol')
        Price = order.get('Price')
        volume = order.get('LeavesQty')
        status = 'error'
        statusMsg = Text
      }
      popupMsg = `<span>${ttime} ${statusMsg}, 帳號：${Account},${Username}, ${orderType}</span>
        <br/>
        <span>${Symbol},  價格：${Price},  數量：${volume}股</span>
        `
      dispatch(updateMainPopUpMsg(popupMsg, status))
    })
  }
  off() {
    mainPopUpObs.unsubscribe(mainPopUpPub)
  }
}

export default new SocketHandler()
