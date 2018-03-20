import * as types from './action-types'
import { formatFormData } from 'tools/other.js'
import { callApi } from 'modules/common/api.js'
import {
  formatReponse,
  formatRequestData,
  formatInventoryReponse
} from 'tools/format-res-data.js'

export const getInventory = params => {
  return (dispatch, getState) => {
    params = formatRequestData(params)
    let formData = formatFormData(params)
    callApi(`/api/billing/customer/store`, {
      method: 'POST',
      body: formData
    }).then(obj => {
      console.log('getInventory', obj)
      let res = formatInventoryReponse(obj, '268')
      res = res.filter((item, index) => {
        if (
          item.hasOwnProperty('100') ||
          item.hasOwnProperty('201') ||
          item.hasOwnProperty('301')
        ) {
          return item
        }
      })
      dispatch(updateInventory(fromJS(res)))
    })
  }
}

export const updateInventory = data => {
  return {
    type: types.UPDATE_INVENTORY,
    data
  }
}
