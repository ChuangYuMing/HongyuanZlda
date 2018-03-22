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
    let targetData = params.set('MsgType', 'F')
    targetData = targetData.merge(
      Map({
        MsgType: 'F',
        TokenID: tokenID
      })
    )
    let clorderid = targetData.get('ClOrdID')
    console.log('params', targetData.toJS())
    targetData = formatRequestData(targetData.toJS())
    let formData = formatFormData(targetData)
    callApi('/api/cancel', {
      method: 'POST',
      body: formData
    }).then(obj => {
      console.log('cancelOrder', obj)
      appGlobal.changeFsmState(clorderid, 'cancel')
      dispatch(changeOrderStatus(obj))
    })
  }
}
