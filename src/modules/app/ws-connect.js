import { store, apiUrl } from 'store'
import SockJS from 'sockjs-client'
import pako from 'pako'
// import { formatDate } from 'tools/date'
import { uuid } from 'tools/math'
// import encoding from 'text-encoding'
import { Utf8ArrayToStr } from 'tools/text-decode'
// import {
//   ticksPub,
//   eventNewSymbolPub,
//   eventInfoPub,
//   eventQuotePub,
//   eventStatisticPub,
//   eventStatChangePub,
//   bidAskPub,
//   sessionIdPub,
//   klinePub
// } from 'modules/app/publisher'

class WsConnect {
  constructor() {
    this.sessionId = window.btoa(uuid() + '$' + 'apex@tw')
    this.sock = ''
    this.shouldReload = false //畫面重整
    this.reConnectCount = 0
    this.apiUrl = apiUrl
  }
  creatSessionId() {
    this.sessionId = window.btoa(uuid() + '$' + 'apex@tw')
  }
  connect() {
    console.log('re connect!!')
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
    this.sock = new SockJS(this.apiUrl + '/orderWS', null, {
      sessionId: () => {
        return this.sessionId
      }
    })
    this.sock.onopen = () => {
      console.log('connect ing!!!')
      console.log('sock open ' + this.sock._transport.url)
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
      let base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
      if (base64regex.test(e.data)) {
        try {
          let result = pako.inflate(window.atob(e.data))
          res = JSON.parse(Utf8ArrayToStr(result))
          console.log(res)
        } catch (err) {
          console.log(err)
        }
      } else {
        res = JSON.parse(e.data)
        if (res.hasOwnProperty('heartbeat')) {
          this.sock.send('got it!!')
          console.log('heartbeat')
        }
      }
      // console.log(res)
      // store.dispatch(updateSocketLight(formatDate(new Date(), 'hh:mm:ss')))

      if (typeof res.SessionID !== 'undefined') {
        window.localStorage.setItem('sessionId', res.SessionID)
        console.log('seeionid:', res.SessionID)
        // sessionIdPub.trigger(true)
        return
      }
    }
  }
  close() {
    this.sock.close()
  }
}

export default new WsConnect()
