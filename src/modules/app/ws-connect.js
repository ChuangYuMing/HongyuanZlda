import { store } from 'store'
import SockJS from 'sockjs-client'
import pako from 'pako'
import appGlobal from 'modules/common/app-global.js'
import { uuid } from 'tools/math'
import { Utf8ArrayToStr } from 'tools/text-decode'
import {
  orderPub,
  cancelOrderPub,
  mainPopUpPub,
  dealHistoryPub
} from 'modules/app/publisher'
import { formatReponse } from 'tools/format-res-data.js'
import { orderStateMachine } from 'modules/order/stateMachine.js'

class WsConnect {
  constructor(userToken) {
    this.sessionId = ''
    this.sock = ''
    this.shouldReload = false //畫面重整
    this.reConnectCount = 0
    this.apiUrl = appGlobal.orderApiUrl
    this.userToken = userToken
  }
  creatSessionId() {
    this.sessionId = window.btoa(this.userToken)
    // this.sessionId = window.btoa(this.userToken + '$' + 'apex@tw')
  }
  connect() {
    console.log('re connect!!')
    if (this.reConnectCount > 3) {
      let r = confirm(
        `連線中斷!!!\n請檢查網路是否異常，檢查完畢後請按「確定」。`
      )
      if (r === true) {
        this.reConnectCount = 0
      } else {
        return
      }
    }
    this.reConnectCount = this.reConnectCount + 1
    this.creatSessionId()
    this.sock = new SockJS(this.apiUrl + '/orderWS', null, {
      sessionId: () => {
        return this.sessionId
      }
    })
    this.sock.onopen = () => {
      // console.log('connect ing!!!')
      // console.log('sock open ' + this.sock._transport.url)
      if (this.shouldReload) {
        this.shouldReload = false
        location.reload()
      }
    }
    this.sock.onclose = () => {
      console.log('sock close')
      let delayTime = Math.floor(Math.random() * (5000 - 2000)) + 5000
      // let delayTime = 5000
      this.shouldReload = true
      setTimeout(() => {
        this.connect()
      }, delayTime)
    }
    this.sock.onerror = e => {
      console.error('sock error', e)
    }
    this.sock.onmessage = e => {
      let res
      let base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
      if (base64regex.test(e.data)) {
        try {
          let result = pako.inflate(window.atob(e.data))
          res = JSON.parse(Utf8ArrayToStr(result))
          // console.log(res)
        } catch (err) {
          console.log(err)
        }
      } else {
        res = JSON.parse(e.data)
        // console.log(res)
        if (res.hasOwnProperty('heartbeat')) {
          this.sock.send('got it!!')
          console.log('heartbeat')
        }
        if (res.hasOwnProperty('BaseClOrdId')) {
          appGlobal.clordId = res.BaseClOrdId
        }
      }
      if (res.hasOwnProperty('SessionID')) {
        return
      }
      if (res['35'] === '0') {
        console.log('heartbeat')
        return
      }
      console.log('---------------------------')
      console.log(res)
      res = formatReponse(res)[0]
      console.log(res)
      console.log('---------------------------')

      let clordid = res.ClOrdID
      let orderId = res.OrderID
      let status = res.OrdStatus
      let orderFsm

      if (appGlobal.getOrderFsm(clordid)) {
        let OriginOrderFsm = appGlobal.getOrderFsm(clordid)
        appGlobal.deleteOrderStateMachine(clordid)
        appGlobal.addOrderStateMachine(orderId, OriginOrderFsm)
      } else if (!appGlobal.getOrderFsm(orderId)) {
        let fsmFactory = orderStateMachine('none')
        let newOrderFsm = new fsmFactory()
        appGlobal.addOrderStateMachine(orderId, newOrderFsm)
      }
      orderFsm = appGlobal.getOrderFsm(orderId)
      console.log(orderFsm.state)
      console.log(orderFsm.transitions())
      if (orderFsm.state === 'cancel-wait' && status === '8') {
        status = 'cancelFail'
      }
      if (!appGlobal.canTransistionOrderStatus(orderId, status)) {
        console.log(orderFsm.transitions())
        console.log(orderFsm.state)
        console.log(status)
        console.log('@@@@')
        return
      } else {
        appGlobal.changeFsmState(orderId, status)
        let b = appGlobal.getOrderFsm(orderId)
        console.log(b.state)
      }

      orderPub.trigger(res)
      mainPopUpPub.trigger(res)

      if (res.ExecType === '4') {
        //刪單回報
        console.log('ws刪單回報', res)
        cancelOrderPub.trigger(res)
      }
      if (res.ExecType === 'F') {
        console.log('ws成交回報', res)
        dealHistoryPub.trigger(res)
      }
    }
  }
  close() {
    this.sock.close()
  }
}

export default WsConnect
