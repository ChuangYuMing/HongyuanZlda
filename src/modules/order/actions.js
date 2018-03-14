import * as types from './action-types'
import { formatFormData } from 'tools/other.js'
import { formatReponse, formatRequestData } from 'tools/format-res-data.js'
import appGlobal from 'modules/common/app-global.js'
import { quoteFormatEven } from 'tools/apex-dataformat'
import { Map } from 'immutable'
import { callApi } from 'modules/common/api.js'

export const order = params => {
  return (dispatch, getState) => {
    params.TokenID = getState().app.get('userToken')
    params = formatRequestData(params)
    console.log(params)
    let formData = formatFormData(params)
    let apiUrl = appGlobal.orderApiUrl
    callApi(
      '/api/order',
      {
        method: 'POST',
        body: formData
      },
      apiUrl
    ).then(obj => {
      console.log('order', obj)
      let data = formatReponse(obj)[0]
      data = fromJS(data)
      dispatch(newOrder(data))
    })
  }
}

export const changeOrderStatus = (res, mappingData = true) => {
  let data = ''
  // console.log('mappingData', mappingData)
  if (mappingData) {
    data = fromJS(formatReponse(res)[0])
  } else {
    data = fromJS(res)
  }
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
  return (dispatch, getState) => {
    let state = getState()
    let sessionId = appGlobal.wsQuoteSessionId
    let operate = options.operate || 'replace'
    let apiUrl = appGlobal.quoteApiUrl
    callApi(
      '/api/quote',
      {
        method: 'POST',
        body: JSON.stringify({ SessionID: sessionId, Prods: symbols })
      },
      apiUrl
    ).then(obj => {
      if (!obj.Prods) {
        return
      }
      let quote = obj.Prods[0].Quote
      let symbol = quote['48']
      let iob = Map(quoteFormatEven(symbol, quote))
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
  return (dispatch, getState) => {
    let apiUrl = appGlobal.quoteApiUrl
    callApi(
      '/api/reg',
      {
        method: 'post',
        body: JSON.stringify({
          SessionID: sessionId,
          Prods: symbol,
          Types: ['Tick', 'UE', 'BA']
        })
      },
      apiUrl
    ).then(obj => {
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

export const clearOrder = () => {
  return {
    type: types.CLEAR_ORDER
  }
}

export const checkDeleteRow = (clorderid, value) => {
  return {
    type: types.CHECK_DELETE_ROW,
    clorderid,
    value
  }
}

export const addDealHistory = data => {
  data = Map(data)
  return {
    type: types.ADD_DEAL_HISTORY,
    data
  }
}

export const inflatDealHistory = (id, flag) => {
  return {
    type: types.INFLAT_DEAL_HISTORY,
    id,
    flag
  }
}

export const updateOrderListHistory = data => {
  return {
    type: types.UPDATE_ORDER_LIST_HISTORY,
    data
  }
}
