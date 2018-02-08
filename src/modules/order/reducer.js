import * as types from './action-types'

let init = []
export default (state = init, action) => {
  switch (action.type) {
    case types.NEW: {
      let _state = [...state]
      _state.unshift(action.data)
      return _state
    }
    case types.CHANGE_ORDER_STATUS: {
      let _state = [...state]
      for (let i = 0; i < _state.length; i++) {
        if (_state[i].OrderID === action.data.OrderID) {
          _state[i] = Object.assign({}, action.data)
          break
        }
      }
      return _state
    }
    default:
      return state
  }
}
