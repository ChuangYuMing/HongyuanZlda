import * as types from './action-types'

export default (state = [], action) => {
  switch (action.type) {
    case types.SHOW: {
      return state
    }
    default:
      return state
  }
}
