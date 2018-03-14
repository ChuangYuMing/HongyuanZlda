import * as types from './action-types'

let init = fromJS({
  errorMsg: '',
  fetching: false
})
export default (state = init, action) => {
  switch (action.type) {
    case types.UPDATE_STATUS: {
      return state
    }
    case types.UPDATE_ERROR_MSG: {
      return state.set('errorMsg', action.data)
    }
    default:
      return state
  }
}
