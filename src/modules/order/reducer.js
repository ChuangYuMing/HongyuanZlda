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
      let targetIndex = state.get('orderList').findIndex(i => {
        if (i.get('OrderID') !== '--') {
          return i.get('OrderID') === action.data.get('OrderID')
        } else {
          return i.get('ClOrdID') === action.data.get('ClOrdID')
        }
      })
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
      let { orderId, value } = action
      let targetIndex = state
        .get('orderList')
        .findIndex(i => i.get('OrderID') === orderId)
      if (targetIndex !== -1) {
        state = state.updateIn(['orderList', targetIndex], list => {
          list = list.set('checkToDelete', value)
          return list
        })
      }
      return state
    }
    case types.CHECK_TO_BASH_CANCEL_BY_ACCOUNT: {
      state = state.update('orderList', list => {
        return list.map(item => {
          if (item.get('OrdStatus') === '0' || item.get('OrdStatus') === '1') {
            if (item.get('Account') === action.account) {
              item = item.set('checkToDelete', true)
            } else {
              item = item.set('checkToDelete', false)
            }
          }
          return item
        })
      })
      return state
    }
    case types.CHECK_ALL_DELETE: {
      let value = action.value
      state = state.update('orderList', list => {
        list = list.map(item => {
          if (item.get('OrdStatus') === '0' || item.get('OrdStatus') === '1') {
            item = item.set('checkToDelete', value)
          }
          return item
        })
        return list
      })
      return state
    }
    case types.ADD_DEAL_HISTORY: {
      let targetIndex = state
        .get('orderList')
        .findIndex(i => i.get('OrderID') === action.data.get('OrderID'))
      let target = state.getIn(['orderList', targetIndex])
      if (target.has('dealHistory')) {
        state = state.updateIn(['orderList', targetIndex], i =>
          i.update('dealHistory', item => item.push(action.data))
        )
      } else {
        state = state.updateIn(['orderList', targetIndex], i =>
          i
            .set('dealHistory', List([]).push(action.data))
            .set('inflatDealHistory', false)
        )
      }
      return state
    }
    case types.INFLAT_DEAL_HISTORY: {
      console.log(action.flag)
      let targetIndex = state
        .get('orderList')
        .findIndex(i => i.get('OrderID') === action.id)
      state = state.updateIn(['orderList', targetIndex], i =>
        i.set('inflatDealHistory', action.flag)
      )
      return state
    }
    case types.UPDATE_ORDER_LIST_HISTORY: {
      return state.update('orderList', i => action.data)
    }
    case types.CLEAR_QUOTE: {
      return state.update('orderQuote', i => Map())
    }
    default:
      return state
  }
}
