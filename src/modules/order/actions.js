import * as types from './action-types'
import { formatFormData } from 'tools/other.js'
import { formatReponse, formatRequestData } from 'tools/format-res-data.js'
import appGlobal from 'modules/common/app-global.js'
import { quoteFormatEven } from 'tools/apex-dataformat'
import { Map } from 'immutable'
import { callApi } from 'modules/common/api.js'
import { updateMainPopUpMsg } from 'modules/main/actions.js'
import { orderStateMachine } from './stateMachine.js'
import { updateTodaySymbol } from 'modules/menu/actions.js'

export const order = params => {
  return (dispatch, getState) => {
    let apiUrl = appGlobal.orderApiUrl
    let orderSymbol = params.Symbol
    let formData = ''
    let clordId = appGlobal.getClordID()
    let requestParams = ''
    let fakeOrder = ''
    params.TokenID = getState().app.get('userToken')
    params.ClOrdID = clordId
    fakeOrder = Object.assign({}, params, {
      ExecType: 'A',
      OrdStatus: 'A',
      TransactTime: '--',
      OrderID: '--',
      originOrderVolume: params.OrderQty
    })
    console.log('fakeOrder', fakeOrder)
    requestParams = formatRequestData(params)
    console.log('order params', requestParams)
    formData = formatFormData(requestParams)
    let fsmFactory = orderStateMachine('init')
    let orderFsm = new fsmFactory()
    orderFsm.doSyncSuccess()
    appGlobal.addOrderStateMachine(clordId, orderFsm)
    dispatch(newOrder(fromJS(fakeOrder)))
    dispatch(updateTodaySymbol(orderSymbol))
    callApi(
      '/api/order',
      {
        method: 'POST',
        body: formData
      },
      apiUrl
    ).then(obj => {
      console.log('order response', obj)
      if (obj.hasOwnProperty('373')) {
        let clordId = obj['11']
        let status = 'error'
        let errMsg = `發生錯誤, ${obj['58']}, error code: ${obj['373']}`
        let popupMsg = `<span>${errMsg}</span>`
        let orderFsm = appGlobal.getOrderFsm(clordId)
        appGlobal.changeFsmState(clordId, 'error')
        dispatch(
          changeOrderStatus(
            fromJS({
              ClOrdID: clordId,
              OrdStatus: '8',
              errorMsg: obj['58']
            }),
            false
          )
        )
        dispatch(updateMainPopUpMsg(popupMsg, status))
        return
      }
      if (!obj['30058']) {
        return
      }
      let data = formatReponse(obj)[0]
      let orderFsm = appGlobal.getOrderFsm(data.ClOrdID)
      if (appGlobal.canTransistionOrderStatus(data.ClOrdID, data.OrdStatus)) {
        data = fromJS(data)
        dispatch(changeOrderStatus(data, false))
      }
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
      console.log(obj)
      if (!obj.Prods) {
        return
      }
      let quote = obj.Prods[0].Quote
      let symbol = obj.Prods[0].Symbol
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

export const registerTick = (sessionId, symbol) => {
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

export const checkDeleteRow = (orderId, value) => {
  return {
    type: types.CHECK_DELETE_ROW,
    orderId,
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

export const clearQuote = () => {
  return {
    type: types.CLEAR_QUOTE
  }
}

export const checkAllDelete = value => {
  return {
    type: types.CHECK_ALL_DELETE,
    value
  }
}

export const checkToBashCancelByAccount = account => {
  return {
    type: types.CHECK_TO_BASH_CANCEL_BY_ACCOUNT,
    account
  }
}
