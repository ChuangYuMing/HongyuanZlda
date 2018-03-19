import * as types from './action-types'

let init = fromJS({
  inventory: []
})
export default (state = init, action) => {
  switch (action.type) {
    case types.UPDATE_INVENTORY: {
      return state.update('inventory', i => action.data)
    }
    default:
      return state
  }
}
