import * as types from './action-types'

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
        .findIndex(i => i.get('ClOrdID') === action.data.get('ClOrdID'))
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
      if (state.getIn(['orderQuote'], 'Symbol') === action.data.get('Symbol')) {
        return state.update('orderQuote', prev => prev.merge(action.data))
      }
      return state
    }
    case types.CLEAR_ORDER: {
      return init
    }
    case types.CHECK_DELETE_ROW: {
      let { clorderid, value } = action
      let targetIndex = state
        .get('orderList')
        .findIndex(i => i.get('ClOrdID') === clorderid)
      console.log('123123', clorderid, value, targetIndex)
      if (targetIndex !== -1) {
        state = state.updateIn(['orderList', targetIndex], list => {
          list = list.set('checkToDelete', value)
          return list
        })
      }
      return state
    }
    default:
      return state
  }
}
