import * as types from './action-types'
import { callApi } from 'modules/common/api.js'
import appGlobal from 'modules/common/app-global.js'

export const updateMainPopUpMsg = (data, status) => {
  return {
    type: types.UPDATE_MAIN_POPUP_MSG,
    data,
    status
  }
}

export const closeMainPopup = data => {
  return {
    type: types.CLOSE_MAIN_POPUP,
    id: data
  }
}

export const getProds = country => {
  console.log('getprods')
  return (dispatch, getState) => {
    let apiUrl = appGlobal.quoteApiUrl
    return new Promise((resolve, reject) => {
      callApi(
        `/api/prod?country=${country}`,
        {
          method: 'GET'
        },
        apiUrl
      ).then(obj => {
        // console.log('getProds:', obj)
        obj.forEach((item, index) => {
          obj[index]['subSymbol'] = item.Symbol.slice(0, -3)
        })
        if (obj === null) {
          return
        }
        resolve(obj)
      })
    })
  }
}

export const updateProdList = data => {
  return {
    type: types.UPDATE_PRODLIST,
    data
  }
}

export const updateApiUrl = data => {
  return {
    type: types.UPDATE_FETCH_APIURL,
    data
  }
}
