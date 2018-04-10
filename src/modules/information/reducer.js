import * as types from './action-types'

let init = fromJS({
  showBashDeletePopup: false
})
export default (state = init, action) => {
  switch (action.type) {
    case types.SHOW_BASH_DELETE_POPUP: {
      return state.set('showBashDeletePopup', action.value)
    }
    default:
      return state
  }
}
