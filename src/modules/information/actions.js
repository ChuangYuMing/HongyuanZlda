import * as types from './action-types'
import { formatFormData } from 'tools/other.js'
import { formatRequestData } from 'tools/format-res-data.js'
import { changeOrderStatus } from 'modules/order/actions.js'
import { formatReponse } from 'tools/format-res-data.js'
import { order, checkDeleteRow } from 'modules/order/actions.js'
import { callApi } from 'modules/common/api.js'
import appGlobal from 'modules/common/app-global.js'

export const cancelOrder = params => {
  return (dispatch, getState) => {
    let tokenID = getState().app.get('userToken')
    let clordId = appGlobal.getClordID()
    params.ClOrdID = clordId
    params.TokenID = tokenID
    let orderId = params['OrderID']
    console.log('params', params)
    params = formatRequestData(params)
    let formData = formatFormData(params)
    callApi('/api/cancel', {
      method: 'POST',
      body: formData
    }).then(obj => {
      console.log('cancelOrder', obj)
      if (!obj['30058']) {
        return
      }
      appGlobal.changeFsmState(orderId, 'cancel')
      dispatch(checkDeleteRow(orderId, false))
      dispatch(changeOrderStatus(obj))
    })
  }
}

export const showBashDeletePopup = value => {
  return {
    type: types.SHOW_BASH_DELETE_POPUP,
    value
  }
}
