import * as types from './action-types'
import { formatFormData } from 'tools/other.js'
import appGlobal from 'modules/common/app-global.js'
import { updateAppInfo } from 'modules/app/actions.js'
import { formatRequestData } from 'tools/format-res-data.js'

export const login = params => {
  let userId = params['553']
  return (dispatch, getState, apiUrl) => {
    let formData = formatFormData(params)
    return new Promise((resolve, reject) => {
      return fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        body: formData
      })
        .then(res => {
          return res.json()
        })
        .then(obj => {
          let token = obj['1129']
          let stat = obj['12008']
          if (stat === '0000') {
            console.log(token)
            console.log(obj)
            dispatch(
              updateAppInfo(Map({ userToken: token, isLogin: true, userId }))
            )
            resolve({ token, userId })
          }
        })
    })
  }
}

export const customerInfo = params => {
  return (dispatch, getState, apiUrl) => {
    params = formatRequestData(params)
    let formData = formatFormData(params)
    return fetch(`${apiUrl}/api/Customer/Info`, {
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
export const updateStatus = data => {
  return {
    type: types.UPDATE_STATUS,
    data
  }
}
