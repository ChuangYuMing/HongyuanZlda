import * as types from './action-types'

let init = fromJS({
  filterSetting: {
    account: '',
    symbol: 'all',
    market: 'all',
    partialDeal: false,
    allDeal: false
  },
  todaySymbols: []
})
export default (state = init, action) => {
  switch (action.type) {
    case types.UPDATE_FILTER_SETTING: {
      return state.updateIn(['filterSetting', action.tag], i => action.value)
    }
    case types.UPDATE_TODAY_SYMBOL: {
      let index = state
        .get('todaySymbols')
        .findIndex(item => item === action.data)
      if (index === -1) {
        return state.update('todaySymbols', i => i.push(action.data))
      } else {
        return state
      }
    }
    case types.SET_TODAY_SYMBOL: {
      return state.update('todaySymbols', i => action.data)
    }
    default:
      return state
  }
}
