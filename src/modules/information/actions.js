import * as types from './action-types'
import { formatFormData } from 'tools/other.js'
import { formatRequestData } from 'tools/format-res-data.js'
import { changeOrderStatus } from 'modules/order/actions.js'
import { formatReponse } from 'tools/format-res-data.js'
import { order } from 'modules/order/actions.js'

export const cancelOrder = params => {
  return (dispatch, getState, apiUrl) => {
    let targetData = params.set('MsgType', 'F')
    console.log('params', targetData.toJS())
    targetData = formatRequestData(targetData.toJS())
    let formData = formatFormData(targetData)
    return new Promise(resolve => {
      return fetch(`${apiUrl}/api/cancel`, {
        method: 'POST',
        body: formData
      })
        .then(res => {
          return res.json()
        })
        .then(obj => {
          console.log('cancelOrder', obj)
          dispatch(changeOrderStatus(obj))
          resolve()
        })
    })
  }
}

// export const changeOrder = ({ targetRow, value, type }) => {
//   return (dispatch, getState, apiUrl) => {
//     console.log('params', params)
//     cancelOrder(targetRow).then(a => {
//     })
//   }
// }
