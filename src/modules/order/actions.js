import * as types from './action-types'
import { formatFormData } from 'tools/other.js'
import { formatReponse } from 'tools/format-res-data.js'
import appGlobal from 'modules/common/app-global.js'
import { quoteFormatEven } from 'tools/apex-dataformat'
import { Map } from 'immutable'

export const order = params => {
  return (dispatch, getState, apiUrl) => {
    let formData = formatFormData(params)
    return fetch(`${apiUrl}/api/order`, {
      method: 'POST',
      body: formData
    })
      .then(res => {
        return res.json()
      })
      .then(obj => {
        console.log(obj)
        let data = Map(formatReponse(obj))
        // console.log(data.toJS())
        dispatch(newOrder(data))
      })
  }
}

export const changeOrderStatus = res => {
  let data = formatReponse(res)
  // console.log(data)
  return {
    type: types.CHANGE_ORDER_STATUS,
    data
  }
}
export const newOrder = data => {
  return {
    type: types.NEW,
    data
  }
}

export const getQuote = (symbols, options = {}) => {
  return (dispatch, getState, apiUrl) => {
    let state = getState()
    let sessionId = appGlobal.wsQuoteSessionId
    let operate = options.operate || 'replace'
    // let symbols = options.symbol

    return fetch(`${apiUrl}/api/quote`, {
      method: 'post',
      body: JSON.stringify({ SessionID: sessionId, Prods: symbols })
    })
      .then(res => {
        return res.json()
      })
      .then(obj => {
        // console.log('getQuote:', obj)
        if (obj.Prods === null) {
          return
        }
        let quote = obj.Prods[0].Quote
        let symbol = quote['48']
        let iob = Map(quoteFormatEven(symbol, quote))
        // console.log(iob)
        dispatch(show(iob))
        dispatch(registerTick(sessionId, symbols))
      })
  }
}

export const show = data => {
  // console.log(data, operate)
  return {
    type: types.SHOW_ORDER_QUOTE,
    data
  }
}

function registerTick(sessionId, symbol) {
  if (typeof symbol === 'string') {
    symbol = new Array(symbol)
  }
  return (dispatch, getState, apiUrl) => {
    return fetch(`${apiUrl}/api/reg`, {
      method: 'post',
      body: JSON.stringify({
        SessionID: sessionId,
        Prods: symbol,
        Types: ['Tick', 'UE', 'BA']
      })
    })
      .then(res => {
        return res.json()
      })
      .then(obj => {
        console.log('registerTick: ', obj)
      })
  }
}
export const bidAndAskTick = data => {
  return {
    type: types.BID_AND_ASK_TICK,
    data
  }
}

export const updateTick = data => {
  return {
    type: types.UPDATE_TICK,
    data
  }
}
