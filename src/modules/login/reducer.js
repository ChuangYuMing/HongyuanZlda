import * as types from './action-types'

let init = fromJS({
  temp: false
})
export default (state = init, action) => {
  switch (action.type) {
    case types.UPDATE_STATUS: {
      return state
    }
    default:
      return state
  }
}
