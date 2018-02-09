import * as types from './action-types'

let init = {
  orderList: [],
  orderQuote: {}
}
export default (state = init, action) => {
  switch (action.type) {
    case types.NEW: {
      let _state = JSON.parse(JSON.stringify(state))
      _state.orderList.unshift(action.data)
      return _state
    }
    case types.CHANGE_ORDER_STATUS: {
      let _state = JSON.parse(JSON.stringify(state))
      let lists = _state.orderList
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].OrderID === action.data.OrderID) {
          lists[i] = Object.assign({}, action.data)
          break
        }
      }
      return _state
    }
    case types.SHOW_ORDER_QUOTE: {
      let _state = JSON.parse(JSON.stringify(state))
      _state.orderQuote = Object.assign({}, _state.orderQuote, action.data)
      return _state
    }
    case types.UPDATE_TICK: {
      let _state = JSON.parse(JSON.stringify(state))
      _state.orderQuote = Object.assign({}, _state.orderQuote, action.data)
      return _state
    }
    case types.BID_AND_ASK_TICK: {
      let _state = JSON.parse(JSON.stringify(state))
      if (_state.orderQuote.Symbol === action.data.Symbol) {
        _state.orderQuote = Object.assign({}, _state.orderQuote, action.data)
      }

      return _state
    }
    default:
      return state
  }
}
