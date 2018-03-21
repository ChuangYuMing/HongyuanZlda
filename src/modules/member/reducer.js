import * as types from './action-types'

let init = fromJS({
  purchasing: {}
})
export default (state = init, action) => {
  switch (action.type) {
    case types.UPDATE_PURCHASING: {
      return state.update('purchasing', i => action.data)
    }
    default:
      return state
  }
}
