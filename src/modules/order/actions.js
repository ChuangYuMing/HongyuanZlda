import * as types from './action-types'
import { formatFormData } from 'tools/other.js'
import { formatReponse } from 'tools/format-res-data.js'

export const order = params => {
  return (dispatch, getState, apiUrl) => {
    let formData = formatFormData(params)
    return fetch(`${apiUrl}/api/order`, {
      method: 'POST',
      body: formData
    })
      .then(res => {
        return res.json()
      })
      .then(obj => {
        let data = formatReponse(obj)
        console.log(data)
        dispatch(newOrder(data))
      })
  }
}

export const changeOrderStatus = res => {
  let data = formatReponse(res)
  console.log(data)
  return {
    type: types.CHANGE_ORDER_STATUS,
    data
  }
}
export const newOrder = data => {
  return {
    type: types.NEW,
    data
  }
}
