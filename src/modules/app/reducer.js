import * as types from './action-types'

let init = {
  temp: 'ttt11t',
  clientIP: '',
  apiDomain: ''
}
export default (state = init, action) => {
  switch (action.type) {
    case types.TEMP_TEST:
      return action.data
    case types.UPDATE_APP_INFO:
      return Object.assign({}, state, action.data)
    default:
      return state
  }
}
