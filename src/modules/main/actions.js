import * as types from './action-types'
import { callApi } from 'modules/common/api.js'
import appGlobal from 'modules/common/app-global.js'
import { formatReponse, formatRequestData } from 'tools/format-res-data.js'
import { formatGetRequestData } from 'tools/other.js'
import { formatFormData, getOriginOrderVoulme } from 'tools/other.js'
import { getDateFromFormat } from 'tools/date.js'
import { updateOrderListHistory } from 'modules/order/actions.js'
import { fromJS } from 'immutable'
import { forceUpdatePwd } from 'modules/login/actions.js'
import { orderStateMachine } from 'modules/order/stateMachine.js'
import { Decimal } from 'decimal.js'
import { setTodaySymbol } from 'modules/menu/actions.js'

export const updateMainPopUpMsg = (data, status, side) => {
  return {
    type: types.UPDATE_MAIN_POPUP_MSG,
    data,
    status,
    side
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
        if (obj.hasOwnProperty('373')) {
          reject(obj)
        }
        if (!obj['30058']) {
          resolve(true)
          return
        }
        let res = formatReponse(obj)
        // let tempArr = []
        // for (let index = 0; index < 500; index++) {
        //   let temp = JSON.parse(JSON.stringify(res[0]))
        //   temp.Account = `${res[0].Account}-${index}`
        //   tempArr.push(temp)
        // }
        // res = res.concat(tempArr)
        console.log(res)
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
        if (obj.hasOwnProperty('373')) {
          reject(obj)
        }
        if (!obj['30058']) {
          resolve(true)
          return
        }
        let res = formatReponse(obj)
        let groupData = {}
        let orderList = List([])
        let symbols = []
        //get group data
        res.forEach((element, index) => {
          let OrderID = element['OrderID']
          if (!groupData[OrderID]) {
            groupData[OrderID] = [element]
          } else {
            groupData[OrderID].push(element)
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
          let originOrderVolume = getOriginOrderVoulme(item)
          item = item.set('originOrderVolume', originOrderVolume)
          if (item.get('OrdStatus') === '8') {
            item = item.set('errorMsg', item.get('Text'))
          }
          list.forEach(element => {
            if (element['OrdStatus'] === '2' || element['OrdStatus'] === '1') {
              element = Map(element)
              element = element.set('originOrderVolume', originOrderVolume)
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
          orderList = orderList.push(item)
        }
        console.log('orderList', orderList.toJS())
        orderList = orderList.sort((a, b) => {
          let atime = a.get('TransactTime').split('.')
          let btime = b.get('TransactTime').split('.')
          let adatetime = getDateFromFormat(atime[0], 'yMMdd-HH:mm:ss')
          let bdatetime = getDateFromFormat(btime[0], 'yMMdd-HH:mm:ss')
          adatetime = adatetime + parseInt(atime[1])
          bdatetime = bdatetime + parseInt(btime[1])
          return bdatetime - adatetime
        })
        orderList.forEach(item => {
          symbols.push(item.get('Symbol'))
          let fsmFactory = orderStateMachine('none')
          let orderFsm = new fsmFactory()
          let orderId = item.get('OrderID')
          let orderStatus = item.get('OrdStatus')
          appGlobal.addOrderStateMachine(orderId, orderFsm)
          appGlobal.changeFsmState(orderId, orderStatus)
        })
        symbols = List([...new Set(symbols)])
        dispatch(updateOrderListHistory(orderList))
        dispatch(setTodaySymbol(symbols))
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
  console.log('changeTargetAccount')
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
export const checkPwd = params => {
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
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }
}
export const getExchange = params => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let tokenId = getState().app.get('userToken')
      params = formatRequestData(params)
      let formData = formatFormData(params)
      // console.log('formData', formData)
      let hasGetProd = false
      let hasGetTradeUnit = false
      callApi(`/api/billing/trade/exchange`, {
        method: 'POST',
        body: formData
      }).then(obj => {
        let finalRes = {}
        console.log('getExchange', obj)
        if (obj.hasOwnProperty('373')) {
          reject(obj)
        }
        let res = formatReponse(obj)
        console.log(res)
        res.forEach(item => {
          let market = item.Market
          if (finalRes[market] === undefined) {
            finalRes[market] = [item]
          } else {
            finalRes[market].push(item)
          }
        })
        console.log(finalRes)
        finalRes = fromJS(finalRes)
        dispatch(updateExchange(finalRes))
        const [...markets] = finalRes.keys()
        console.log('markets', markets)
        let promises = markets.map(item => {
          let params = {
            TokenID: tokenId,
            Market: item
          }
          return dispatch(getProds2(params))
        })
        let promises2 = markets.map(item => {
          let params = {
            TokenID: tokenId,
            Market: item
          }
          return dispatch(getTradeUnit(params))
        })
        let prodList = {}
        Promise.all(promises)
          .then(res => {
            res.forEach((item, i) => {
              prodList[markets[i]] = res[i]
            })
            dispatch(updateProdList(prodList))
            console.log('prodList: ', prodList)
            hasGetProd = true
            if (hasGetProd && hasGetTradeUnit) {
              resolve(true)
            }
          })
          .catch(e => {
            console.log(e)
          })
        let tradeUnit = {}
        Promise.all(promises2)
          .then(res => {
            console.log(res)
            res.forEach((item, i) => {
              let price = []
              let entryPx = []
              if (item['30058']) {
                item['30058'].forEach(element => {
                  price.push(element['44'])
                  entryPx.push(element['270'])
                })
              }

              tradeUnit[markets[i]] = {
                price,
                entryPx
              }
            })
            dispatch(updateTrideUnit(fromJS(tradeUnit)))
            console.log('tradeUnit: ', tradeUnit)
            hasGetTradeUnit = true
            if (hasGetProd && hasGetTradeUnit) {
              resolve(true)
            }
          })
          .catch(e => {
            console.log(e)
          })
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
        let res = formatReponse(obj)
        resolve(res)
      })
    })
  }
}

export const getTradeUnit = params => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      params = formatRequestData(params)
      let formData = formatFormData(params)
      callApi(`/api/billing/trade/unit`, {
        method: 'POST',
        body: formData
      }).then(obj => {
        // console.log('getTradeUnit', obj)
        resolve(obj)
      })
    })
  }
}

export const updateExchange = data => {
  return {
    type: types.UPDATE_EXCHANGE,
    data
  }
}

export const updateTrideUnit = data => {
  return {
    type: types.UPDATE_TRADE_UNIT,
    data
  }
}
