import * as types from './action-types'
import { formatFormData } from 'tools/other.js'
import { callApi } from 'modules/common/api.js'
import { formatInventoryReponse } from 'tools/format-res-data.js'

export const getInventory = params => {
  return (dispatch, getState) => {
    let formData = formatFormData(params)
    callApi(`/api/billing/customer/store`, {
      method: 'POST',
      body: formData
    }).then(obj => {
      let res = formatInventoryReponse(obj)
      console.log(res)
    })
  }
}

export const updateInventory = data => {
  return {
    type: types.UPDATE_INVENTORY,
    data
  }
}
