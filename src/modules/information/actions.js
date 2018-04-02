import * as types from './action-types'
import { formatFormData } from 'tools/other.js'
import { formatRequestData } from 'tools/format-res-data.js'
import { changeOrderStatus } from 'modules/order/actions.js'
import { formatReponse } from 'tools/format-res-data.js'
import { order } from 'modules/order/actions.js'
import { callApi } from 'modules/common/api.js'
import appGlobal from 'modules/common/app-global.js'

export const cancelOrder = params => {
  return (dispatch, getState) => {
    let tokenID = getState().app.get('userToken')
    params.TokenID = tokenID
    let clorderid = params['ClOrdID']
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
      appGlobal.changeFsmState(clorderid, 'cancel')
      dispatch(changeOrderStatus(obj))
    })
  }
}
