import * as types from './action-types'

let init = Map({
  mainPopupMsg: List([]),
  prodList: {},
  fetchApiUrl: false,
  customerInfo: List([]),
  targetAccount: Map({}),
  showChangePwd: false,
  exchange: Map({}),
  tradeUnit: Map({})
})
export default (state = init, action) => {
  switch (action.type) {
    case types.UPDATE_MAIN_POPUP_MSG: {
      let id = new Date().getTime() + Math.random()
      let obj = Map({
        id: id.toString(),
        msg: action.data,
        side: action.side,
        status: action.status
      })
      state = state.update('mainPopupMsg', list => {
        let empty = List([])
        return empty.push(obj)
      })
      return state
    }
    case types.CLOSE_MAIN_POPUP: {
      state = state.update('mainPopupMsg', list =>
        list.filter(i => i.get('id') !== action.id)
      )
      return state
    }
    case types.UPDATE_PRODLIST: {
      return state.update('prodList', i => action.data)
    }
    case types.UPDATE_FETCH_APIURL: {
      return state.update('fetchApiUrl', i => action.data)
    }
    case types.UPDATE_CUSTOMER_INFO: {
      return state.update('customerInfo', i => action.data)
    }
    case types.TARGET_ACCOUNT: {
      return state.set('targetAccount', action.data)
    }
    case types.TOGGLE_CHANGE_POPUP: {
      return state.update('showChangePwd', i => action.data)
    }
    case types.UPDATE_EXCHANGE: {
      return state.update('exchange', i => action.data)
    }
    case types.UPDATE_TRADE_UNIT: {
      return state.update('tradeUnit', i => action.data)
    }
    default:
      return state
  }
}
