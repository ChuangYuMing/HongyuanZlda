import * as types from './action-types'
import { formatFormData } from 'tools/other.js'

export const cancelOrder = params => {
  return (dispatch, getState, apiUrl) => {
    let formData = formatFormData(params)
    return fetch(`${apiUrl}/api/cancel`, {
      method: 'POST',
      body: formData
    })
      .then(res => {
        return res.json()
      })
      .then(obj => {
        console.log(obj)
      })
  }
}
