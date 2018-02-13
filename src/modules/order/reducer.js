import * as types from './action-types'
import { fromJS } from 'immutable'
let init = fromJS({
  orderList: [],
  orderQuote: {}
})
export default (state = init, action) => {
  switch (action.type) {
    case types.NEW: {
      return state.update('orderList', lists => lists.unshift(action.data))
    }
    case types.CHANGE_ORDER_STATUS: {
      let targetIndex = state
        .get('orderList')
        .findIndex(i => i.get('OrderID') === action.data.get('OrderID'))
      if (targetIndex !== -1) {
        state = state.updateIn(['orderList', targetIndex], item =>
          item.merge(action.data)
        )
      } else {
        state = state.update('orderList', list => list.unshift(action.data))
      }

      return state
    }
    case types.SHOW_ORDER_QUOTE: {
      return state.update('orderQuote', prev => prev.merge(action.data))
    }
    case types.UPDATE_TICK: {
      return state.update('orderQuote', prev => prev.merge(action.data))
    }
    case types.BID_AND_ASK_TICK: {
      if (state.orderQuote.get('Symbol') === action.data.get('Symbol')) {
        return state.update('orderQuote', prev => prev.merge(action.data))
      }
      return state
    }
    default:
      return state
  }
}
