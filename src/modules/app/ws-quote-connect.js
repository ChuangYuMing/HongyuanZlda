import { store } from 'store'
import SockJS from 'sockjs-client'
import pako from 'pako'
import appGlobal from 'modules/common/app-global.js'
import { uuid } from 'tools/math'
import { Utf8ArrayToStr } from 'tools/text-decode'
import {
  orderPub,
  eventQuotePub,
  ticksPub,
  bidAskPub
} from 'modules/app/publisher'
import { quoteFormatOdd, tickFormatOdd } from 'tools/apex-dataformat'

class WsQuoteConnect {
  constructor() {
    this.sessionId = window.btoa(uuid() + '$' + 'apex@tw')
    this.sock = ''
    this.shouldReload = false //畫面重整
    this.reConnectCount = 0
    this.apiUrl = appGlobal.quoteApiUrl
  }
  creatSessionId() {
    this.sessionId = window.btoa(uuid() + '$' + 'apex@tw')
  }
  connect() {
    // console.log('re connect!!')
    // if (this.reConnectCount > 3) {
    //   let r = confirm(
    //     `連線中斷!!!\n請檢查\n1. 網路連線正常\n2. 防毒軟體\n3. 防火牆設定\n4. chrome AdBlock設定\n檢查完畢後請按「確定`
    //   )
    //   if (r === true) {
    //     this.reConnectCount = 0
    //   } else {
    //     return
    //   }
    // }
    this.reConnectCount = this.reConnectCount + 1
    this.creatSessionId()
    this.sock = new SockJS(this.apiUrl + '/ws', null, {
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
        // this.connect()
      }, delayTime)
    }
    this.sock.onerror = e => {
      console.error('sock error', e)
    }
    this.sock.onmessage = e => {
      // console.log(e.data)
      let res
      // console.log(store.getState())
      let priceDec = store.getState().order.getIn(['orderQuote', 'PriceDec'])
      // console.log(priceDec)
      let base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
      if (base64regex.test(e.data)) {
        try {
          let result = pako.inflate(window.atob(e.data))
          res = JSON.parse(Utf8ArrayToStr(result))
          // console.log(res)
        } catch (err) {
          // console.log(err)
        }
      } else {
        res = JSON.parse(e.data)
        if (res.hasOwnProperty('heartbeat')) {
          this.sock.send('got it!!')
          // console.log('heartbeat')
        }
      }
      if (!res) {
        return
      }
      if (res.hasOwnProperty('SessionID')) {
        appGlobal.wsQuoteSessionId = res.SessionID
        return
      }

      if (typeof res['11000'] !== 'undefined' && res['11000'] === 53) {
        // UPDATE BA
        // console.log('sock message-BA :', res)
        bidAskPub.trigger(res)
      }
      if (typeof res['11000'] !== 'undefined' && res['11000'] === 57) {
        //Update Event
        // console.log('sock message :', res)
        let symbol = res['12015'] || res['Symbol']
        // EventType QUOTE
        if (res['12013'] === 2) {
          // console.log('sock message :', res)
          // eventQuotePub.trigger(res)
        }
      }
      if (typeof res['11000'] !== 'undefined' && res['11000'] === 51) {
        // console.log('sock message-tick :', res)
        let priceDec = store.getState().order.getIn(['orderQuote', 'PriceDec'])
        let symbol = res['48']
        // console.log(priceDec)
        let tickObj = Object.assign(
          quoteFormatOdd(symbol, res['11501'], priceDec),
          tickFormatOdd(symbol, res['11500'], priceDec),
          { update: true }
        )
        ticksPub.trigger(tickObj)
      }
    }
  }
  close() {
    this.sock.close()
  }
}

export default WsQuoteConnect
