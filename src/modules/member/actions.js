import * as types from './action-types'
import {
  formatReponse,
  formatRequestData,
  formatFixToName
} from 'tools/format-res-data.js'
import { formatFormData } from 'tools/other.js'
import { callApi } from 'modules/common/api.js'

export const getPurchasing = params => {
  return (dispatch, getState) => {
    let tokenId = getState().app.get('userToken')
    params['TokenID'] = tokenId
    params = formatRequestData(params)
    let formData = formatFormData(params)
    callApi(`/api/billing/customer/purchasing`, {
      method: 'POST',
      body: formData
    }).then(obj => {
      console.log('getPurchasing', obj)
      // console.log(formatFixToName(obj))
      obj = formatFixToName(obj)
      console.log(obj)
      obj = fromJS(obj)

      dispatch(updatePurchasing(obj))
    })
  }
}

export const updatePurchasing = data => {
  return {
    type: types.UPDATE_PURCHASING,
    data
  }
}
