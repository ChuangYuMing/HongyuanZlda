import * as types from './action-types'

let init = Map({
  mainPopupMsg: List([]),
  prodList: {},
  fetchApiUrl: false
})
export default (state = init, action) => {
  switch (action.type) {
    case types.UPDATE_MAIN_POPUP_MSG: {
      let id = new Date().getTime() + Math.random()
      let obj = Map({
        id: id.toString(),
        msg: action.data,
        status: action.status
      })
      state = state.update('mainPopupMsg', list => list.push(obj))
      return state
    }
    case types.CLOSE_MAIN_POPUP: {
      state = state.update('mainPopupMsg', list =>
        list.filter(i => i.get('id') !== action.id)
      )
      return state
    }
    case types.UPDATE_PRODLIST: {
      return state.update('prodList', i => action.data)
    }
    case types.UPDATE_FETCH_APIURL: {
      return state.update('fetchApiUrl', i => action.data)
    }
    default:
      return state
  }
}
