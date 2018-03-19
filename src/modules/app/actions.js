import * as types from './action-types'
import { Map } from 'immutable'
import appGlobal from 'modules/common/app-global.js'
import { updateApiUrl } from 'modules/main/actions.js'

export const tempTest = value => {
  return {
    type: types.TEMP_TEST,
    date: 'temp-test'
  }
}

export const getClientIP = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      fetch(`https://api.ipify.org?format=json`)
        .then(res => {
          if (res.ok) {
            return res.json()
          } else {
            throw new Error('getClientIP fail')
          }
        })
        .then(res => {
          // console.log(res)
          dispatch(updateAppInfo(Map({ clientIP: res.ip })))
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
        })
    })
  }
}

export const updateAppInfo = data => {
  return {
    type: types.UPDATE_APP_INFO,
    data
  }
}

export const getApiUrl = () => {
  return (dispatch, getState) => {
    let url = appGlobal.apiUrl
    return fetch(`${url}/api/sysinfo`, {
      method: 'GET'
    })
      .then(res => {
        return res.json()
      })
      .then(obj => {
        console.log(obj)
        appGlobal.orderApiUrl = `http://${obj.ClientOrderAPIServer}`
        appGlobal.quoteApiUrl = `http://${obj.ClientQuoteAPIServer}`
        if (!PRODUCTION) {
          // appGlobal.orderApiUrl = 'http://192.168.12.153:8008'
        }
        dispatch(updateApiUrl(true))
      })
  }
}
