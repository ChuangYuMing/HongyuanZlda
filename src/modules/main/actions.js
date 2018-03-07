import * as types from './action-types'

export const updateMainPopUpMsg = (data, status) => {
  return {
    type: types.UPDATE_MAIN_POPUP_MSG,
    data,
    status
  }
}

export const closeMainPopup = data => {
  return {
    type: types.CLOSE_MAIN_POPUP,
    id: data
  }
}
