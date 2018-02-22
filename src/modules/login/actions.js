import * as types from './action-types'
import { formatFormData } from 'tools/other.js'
import appGlobal from 'modules/common/app-global.js'
import { updateAppInfo } from 'modules/app/actions.js'

export const login = params => {
  return (dispatch, getState, apiUrl) => {
    let formData = formatFormData(params)
    return fetch(`${apiUrl}/api/login`, {
      method: 'POST',
      body: formData
    })
      .then(res => {
        return res.json()
      })
      .then(obj => {
        let token = obj['1129']
        console.log(token)
        dispatch(updateAppInfo(Map({ userToken: token, isLogin: true })))
      })
  }
}

export const updateStatus = data => {
  return {
    type: types.UPDATE_STATUS,
    data
  }
}
