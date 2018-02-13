import * as types from './action-types'
import { fromJS } from 'immutable'

let init = fromJS({
  temp: 'ttt11t',
  clientIP: '',
  apiDomain: ''
})

export default (state = init, action) => {
  switch (action.type) {
    case types.TEMP_TEST:
      return state
    case types.UPDATE_APP_INFO:
      return state.merge(action.data)
    default:
      return state
  }
}
