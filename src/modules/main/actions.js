import * as types from './action-types'
import { callApi } from 'modules/common/api.js'
import appGlobal from 'modules/common/app-global.js'
import { formatReponse, formatRequestData } from 'tools/format-res-data.js'
import { formatGetRequestData } from 'tools/other.js'
import { formatFormData } from 'tools/other.js'
import { getDateFromFormat } from 'tools/date.js'
import { updateOrderListHistory } from 'modules/order/actions.js'
import { fromJS } from 'immutable'
import { forceUpdatePwd } from 'modules/login/actions.js'

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
        console.log('getProds:', obj)
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

export const getCustomerInfo = params => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      params = formatRequestData(params)
      params = formatGetRequestData(params)
      callApi(`/api/billing/customer/info?${params}`, {
        method: 'GET'
      }).then(obj => {
        console.log('CustomerInfo', obj)
        let res = formatReponse(obj)
        res = fromJS(res)
        dispatch(updateCustomerInfo(res))
        resolve(true)
      })
    })
  }
}

export const getOrderStatus = params => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      params = formatRequestData(params)
      params = formatGetRequestData(params)
      callApi(`/api/billing/order/status?${params}`, {
        method: 'GET'
      }).then(obj => {
        console.log('OrderStatus', obj)
        if (!obj['30058']) {
          resolve(true)
          return
        }
        let res = formatReponse(obj)
        let groupData = {}
        let orderList = List([])
        //get group data
        res.forEach((element, index) => {
          let ClOrdID = element['ClOrdID']
          if (!groupData[ClOrdID]) {
            groupData[ClOrdID] = [element]
          } else {
            groupData[ClOrdID].push(element)
          }
        })
        //sort data
        for (const key in groupData) {
          let list = groupData[key]
          let item
          list = list.sort((a, b) => {
            let atime = a['TransactTime'].split('.')
            let btime = b['TransactTime'].split('.')
            let adatetime = getDateFromFormat(atime[0], 'yMMdd-HH:mm:ss')
            let bdatetime = getDateFromFormat(btime[0], 'yMMdd-HH:mm:ss')
            adatetime = adatetime + parseInt(atime[1])
            bdatetime = bdatetime + parseInt(btime[1])
            return adatetime - bdatetime
          })

          item = Map(list[list.length - 1])
          list.forEach(element => {
            if (element['OrdStatus'] === '2' || element['OrdStatus'] === '1') {
              element = Map(element)
              if (!item.get('dealHistory')) {
                item = item.update('dealHistory', i => {
                  let list = List([])
                  return list.push(element)
                })
              } else {
                item = item.update('dealHistory', i => i.push(element))
              }
              item = item.set('inflatDealHistory', false)
            }
          })
          orderList = orderList.push(fromJS(item))
        }
        console.log('orderList', orderList.toJS())
        orderList = orderList.sort((a, b) => {
          console.log('aaaa', a)
          let atime = a.get('TransactTime').split('.')
          let btime = b.get('TransactTime').split('.')
          let adatetime = getDateFromFormat(atime[0], 'yMMdd-HH:mm:ss')
          let bdatetime = getDateFromFormat(btime[0], 'yMMdd-HH:mm:ss')
          adatetime = adatetime + parseInt(atime[1])
          bdatetime = bdatetime + parseInt(btime[1])
          return bdatetime - adatetime
        })
        dispatch(updateOrderListHistory(orderList))
        resolve(true)
      })
    })
  }
}

export const updateCustomerInfo = data => {
  return {
    type: types.UPDATE_CUSTOMER_INFO,
    data
  }
}

export const changeTargetAccount = data => {
  data = Map(data)
  return {
    type: types.TARGET_ACCOUNT,
    data
  }
}

export const toggleChangePwdPopup = data => {
  return {
    type: types.TOGGLE_CHANGE_POPUP,
    data
  }
}

export const updatePwd = params => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      params = formatRequestData(params)
      let formData = formatFormData(params)
      callApi(`/api/billing/change/pwd`, {
        method: 'POST',
        body: formData
      }).then(obj => {
        let res = obj['30059']
        if (res === '1') {
          dispatch(forceUpdatePwd(false))
          resolve('更新成功')
        } else {
          resolve('更新失敗！')
        }
      })
    })
  }
}

export const getExchange = params => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      params = formatRequestData(params)
      let formData = formatFormData(params)
      console.log('formData', formData)
      callApi(`/api/billing/trade/exchange`, {
        method: 'POST',
        body: formData
      }).then(obj => {
        console.log('getExchange', obj)
        // let res = formatReponse(obj)
        // res = fromJS(res)
        // dispatch(updateCustomerInfo(res))
        resolve(true)
      })
    })
  }
}

export const getProds2 = params => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      params = formatRequestData(params)
      let formData = formatFormData(params)
      callApi(`/api/billing/trade/symbol`, {
        method: 'POST',
        body: formData
      }).then(obj => {
        console.log('getProds2', obj)
        // let res = formatReponse(obj)
        // res = fromJS(res)
        // dispatch(updateCustomerInfo(res))
        resolve(true)
      })
    })
  }
}
