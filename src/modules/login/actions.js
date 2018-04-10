import * as types from './action-types'
import { formatFormData } from 'tools/other.js'
import appGlobal from 'modules/common/app-global.js'
import { updateAppInfo } from 'modules/app/actions.js'
import { formatRequestData } from 'tools/format-res-data.js'
import { callApi } from 'modules/common/api.js'
import { toggleChangePwdPopup } from 'modules/main/actions.js'

export const login = params => {
  let userId = params['553']
  let pwd = params['554']
  return (dispatch, getState) => {
    let formData = formatFormData(params)
    let apiUrl = appGlobal.orderApiUrl
    return new Promise((resolve, reject) => {
      callApi(
        `/api/login`,
        {
          method: 'POST',
          body: formData
        },
        apiUrl
      ).then(obj => {
        let token = obj['1129']
        let stat = obj['12008']
        if (stat === '0000') {
          console.log(token)
          console.log(obj)
          dispatch(
            updateAppInfo(Map({ userToken: token, isLogin: true, userId }))
          )
          dispatch(updateErrorMsg(''))
          console.log('pwd', pwd)
          if (pwd === '') {
            dispatch(toggleChangePwdPopup(true))
            dispatch(forceUpdatePwd(true))
          }
          resolve({ token, userId })
        } else {
          let errorMsg = obj['12017']
          dispatch(updateErrorMsg(errorMsg))
          resolve(false)
        }
      })
    })
  }
}

export const updateStatus = data => {
  return {
    type: types.UPDATE_STATUS,
    data
  }
}

export const updateErrorMsg = data => {
  return {
    type: types.UPDATE_ERROR_MSG,
    data
  }
}

export const forceUpdatePwd = data => {
  return {
    type: types.FORCE_UPDATE_PWD,
    data
  }
}
