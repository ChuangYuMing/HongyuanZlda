import xml2js from 'xml2js'
import { unescapeHtml } from 'tools/tag-replace.js'
import { popupError } from 'modules/error-handler/'
import { sleep } from 'tools/other.js'

class gveAdapter {
  constructor(domain) {
    this.url = window.localStorage.getItem('url')
    this.token = window.localStorage.getItem('token')
    this.gmRid = window.localStorage.getItem('gmRid')
    this.gmRidStr = window.localStorage.getItem('gmRidStr')
    this.gameName = window.localStorage.getItem('gameName')
    this.userTotalMoney = window.localStorage.getItem('userTotalMoney')
    this.userCanUseMoney = window.localStorage.getItem('userCanUseMoney')
    this.userFrozenMony = window.localStorage.getItem('userFrozenMony')
    this.gameCode = window.localStorage.getItem('gameCode')
  }
  setApiDomain(domain) {
    console.log('setApiDomain')
    this.url = `http://${domain}/WebOrder`
    window.localStorage.setItem('url', this.url)
  }
  _formatApiUrl(operator, params = {}, webService) {
    let str = `/${operator}?`
    for (let item in params) {
      str = str + `${item}=${params[item]}&`
    }
    // console.log(this.url)
    return `${this.url}/${webService}.asmx${str}`.slice(0, -1)
  }
  _getToken(datas) {
    let { account, password, ip } = datas
    let operator = 'LoginIP'
    let webService = 'GVEAccount'
    let params = {
      UserName: account,
      Password: password,
      IPAddr: ip
    }

    let apiUrl = this._formatApiUrl(operator, params, webService)
    // console.log(apiUrl)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('_getToken fail')
          }
        })
        .then(xml => {
          xml2js.parseString(xml, (err, result) => {
            this.token = result.string._
            if (this.token === 'WS1020') {
              throw new Error('帳號錯誤')
            }
            if (this.token === 'WS1021') {
              throw new Error('密碼錯誤')
            }
            window.localStorage.setItem('token', this.token)
            resolve(this.token)
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
          popupError(e)
        })
    })
  }
  _tokenFactory(token) {
    let operator = 'TokenFactory'
    let webService = 'GVEAccount'
    let params = {
      TokenString: token
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('_tokenFactory fail')
          }
        })
        .then(xml => {
          xml2js.parseString(xml, (err, result) => {
            this.gmRid = result.GVEWSToken.GMRID[0]
            this.gmRidStr = result.GVEWSToken.GMRIDStr[0]
            this.gameCode = result.GVEWSToken.GameCode[0]
            window.localStorage.setItem('gmRid', this.gmRid)
            window.localStorage.setItem('gmRidStr', this.gmRidStr)
            window.localStorage.setItem('gameName', '')
            window.localStorage.setItem('gameCode', this.gameCode)
            console.log('#96 - localStorage')
            console.log(window.localStorage)
          })
          resolve(true)
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
          popupError('帳號或密碼錯誤')
        })
    })
  }
  updateGameInfo(gmRidStr, gameName, gameCode) {
    let gmRid_ = ''
    for (let i = 0; i < gmRidStr.length; i++) {
      gmRid_ += gmRidStr[i].charCodeAt(0).toString(16)
    }
    this.gmRidStr = gmRidStr
    this.gmRid = parseInt(gmRid_, 16)
    this.gameName = gameName
    this.gameCode = gameCode
    window.localStorage.setItem('gmRid', this.gmRid)
    window.localStorage.setItem('gmRidStr', this.gmRidStr)
    window.localStorage.setItem('gameName', this.gameName)
    window.localStorage.setItem('gameCode', this.gameCode)
    // console.log(this.gmRidStr, this.gmRid, this.gameName, this.gameCode)
  }
  queryGameList() {
    // window.localStorage.setItem('old_gmRid', this.gmRid)
    // window.localStorage.setItem('old_gmRidStr', this.gmRidStr)
    // window.localStorage.setItem('old_gameName', this.gameName)
    // window.localStorage.setItem('old_gameCode', this.gameCode)
    let operator = 'QueryGameListXML_NS'
    let webService = 'GVEAccount'
    let params = {
      TokenString: this.token
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('queryGameList fail')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            let res = result.string.NewDataSet[0].ResultSet1
            // console.log('@@@', res)
            // throw new Error('queryGameList fail')
            let defaultGame = result.string.NewDataSet[0].ResultSet1[0]
            let gmRidStr = defaultGame.GMRID[0]
            this.updateGameInfo(
              gmRidStr,
              defaultGame.GameName[0],
              defaultGame.GameCode[0]
            )
            this.getUserAssets()
            resolve(res)
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
        })
    })
  }
  login(datas) {
    return new Promise((resolve, reject) => {
      this._getToken(datas)
        .then(token => {
          console.log(token)
          return this.queryGameList(token)
        })
        .then(res => {
          if (res) {
            resolve(res)
          }
        })
    })
  }
  //下單
  order(datas) {
    let operator = 'PutOrderXML3'
    let webService = 'GVETransacs'
    let {
      companyCode,
      price,
      volume,
      action,
      orderType,
      isOddLot = '0',
      currency = 'TWD',
      orderNote = 'ROD',
      orderParameter = '0',
      oCType = 0,
      ip
    } = datas
    let params = {
      GMRIDStr: this.gmRidStr,
      CompCode: companyCode,
      Price: price,
      Volume: volume,
      BSAction: action,
      OrderType: orderType,
      IsOddLot: isOddLot,
      Currency: currency,
      OrderNote: orderNote,
      OCType: oCType,
      CombineNo: '',
      OrderParameter: orderParameter,
      Lang: 'TC',
      str_ip: ip
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('下單失敗！！')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            console.log(result)
            let res = result.string.GVEResult[0].$
            if (res.MsgCode === 'Success') {
              resolve(true)
            } else {
              throw new Error(res.Error)
            }
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
          popupError(e)
        })
    })
  }
  //委託回報查詢
  orderList() {
    let operator = 'QueryWaitingOrderListGVE3XML_NS'
    let webService = 'GVETransacs'
    let params = {
      TokenString: this.token,
      Language: 'TC'
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('orderList fail')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            console.log(result)
            let res = result.string.GVEOrders[0].Order
            if (res) {
              resolve(res)
            } else {
              resolve([])
            }
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
        })
    })
  }
  //成交回報查詢
  dealList(datas) {
    let operator = 'QueryDealLogGVE3ByGMRDayRangeLiteXML_NS'
    let webService = 'GVETransacs'
    let { startDate, endDate } = datas
    let params = {
      GMRID: this.gmRid,
      StartDate: startDate,
      EndDate: endDate,
      Language: 'TW'
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('dealList fail')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            console.log('@@@')
            console.log(result)
            let res = result.string.GVEUserLogXML[0]
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
        })
    })
  }
  //庫存查詢
  inventory() {
    let operator = 'QueryTodayPositionGve3XML_NS'
    let webService = 'GVEAccount'
    let params = {
      TokenString: this.token,
      Language: 'TC',
      SubTotalItem: '',
      SortItem: 'AssetCode Asc'
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('inventory fail')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            console.log(result)
            let res = result.string.GVEPortFolioXML[0].PortfolioAsset
            if (res) {
              resolve(res)
            } else {
              resolve([])
            }
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
        })
    })
  }
  //刪除掛單
  deleteOrder(datas) {
    let operator = 'CancelOrder_NS'
    let webService = 'GVETransacs'
    let { orderId } = datas
    let params = {
      TokenString: this.token,
      OrderID: orderId
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('deleteOrder fail')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            console.log(result)
            if (result.GVEWSResult.MsgCode[0] === 'Success') {
              resolve(true)
            }
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
        })
    })
  }
  //個股基本資料
  queryQuote(datas) {
    let operator = 'QueryQuotePrice2'
    let webService = 'GVETransacs'
    let { companyCode } = datas
    let params = {
      AssetCodeList: `${companyCode}`,
      Language: 'TC'
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('queryQuote fail')
          }
        })
        .then(xml => {
          xml2js.parseString(xml, (err, result) => {
            let res = result.ArrayOfAnyType.anyType
            if (res) {
              res = res[0]._.split(',')
              let obj = {
                companyCode: res[0].split('.')[0],
                prePrice: res[1], //昨收價
                price: res[2], //成交價
                volume: res[8], //總量
                name: res[13], //股名
                upPrice: res[15], //漲停價
                downPrice: res[16] //跌停價
              }
              resolve(obj)
            } else {
              resolve(false)
              throw new Error('找不到商品：' + companyCode)
            }
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
          popupError(e)
        })
    })
  }

  //個股基本資料
  getStockCode(datas) {
    let operator = 'QueryQuotePriceAndAllowOrder'
    let webService = 'GVETransacs'
    let { companyCode } = datas
    let params = {
      Compcode: `${companyCode}`,
      Gamecode: this.gmRidStr,
      Language: 'TC'
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('queryQuote fail')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            // console.log(result)
            if (result.string.NewDataSet.length > 0) {
              let obj = {
                stock_code:
                  result.string.NewDataSet[0].ResultSet1[0].$.AssetCode
              }
              resolve(obj)
            } else {
              resolve(false)
              throw new Error('找不到商品：' + companyCode)
            }
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
          popupError(e)
        })
    })
  }

  //新增自選股
  addSelfStock(datas) {
    let operator = 'NewSelfQuoteDataByGMRID_NS'
    let webService = 'GVETransacs'
    let { companyCode, group = '' } = datas
    let params = {
      GMRIDStr: this.gmRidStr,
      SelfQuoteID: `test${group}`,
      CompCode: `${companyCode}.tw`
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('addSelfStock fail')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            console.log(result)
            if (result.string.NewDataSet) {
              if (
                result.string.NewDataSet[0].ResultSet1[0].$.Column1 === '-1'
              ) {
                throw new Error('新增失敗，每組最多新增15筆！')
              }
              resolve(true)
            } else {
              throw new Error('新增失敗！')
            }
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
          popupError(e)
        })
    })
  }
  //查詢自選股
  getSelfStockInfo(datas) {
    console.log('getSelfStockInfo')
    let operator = 'QuerySelfQuoteDataByGMRID_NS'
    let webService = 'GVETransacs'
    let { group } = datas
    let params = {
      GMRIDStr: this.gmRidStr,
      SelfQuoteID: `test${group}`,
      Lang: 'TC'
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('getSelfStockInfo fail')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            let res = result.string.NewDataSet[0].ResultSet1
            let datas = []
            if (res) {
              // console.log(res)
              datas = res.map(item => {
                let { CompName, AssetCode, Deal, Volume, UpDown } = item.$
                return {
                  name: CompName,
                  companyCode: AssetCode,
                  price: Deal,
                  volume: Volume,
                  upDown: UpDown
                }
              })
              resolve(datas)
            } else {
              resolve([])
            }
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
        })
    })
  }
  //刪除自選股
  deleteSelfStock(datas) {
    let operator = 'DeleteSelfQuoteDataByGMRID_NS'
    let webService = 'GVETransacs'
    let { group, companyCode } = datas
    let params = {
      GMRIDStr: this.gmRidStr,
      SelfQuoteID: `test${group}`,
      CompCode: companyCode + '.tw'
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('deleteSelfStock fail')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            resolve(true)
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
        })
    })
  }
  //歷史委託下單紀錄
  getOrderHistory(datas) {
    let operator = 'QueryOrderListGVE3ByDayRangeXML_NS'
    let webService = 'GVETransacs'
    let { startDate, endDate } = datas
    let params = {
      TokenString: this.token,
      StartDate: startDate,
      EndDate: endDate,
      Language: 'TC'
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('getOrderHistory fail')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            // console.log(result)
            let res = result.string.GVEOrders[0].Order
            if (res) {
              let obj = {
                data: res,
                startDate: startDate,
                endDate: endDate
              }
              resolve(obj)
            } else {
              resolve({ data: [] })
            }
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
        })
    })
  }
  //歷史成交紀錄
  getDealHistory(datas) {
    let operator = 'QueryDealLogBy2XML_NS'
    let webService = 'GVETransacs'
    let { startDate, endDate, logCodeList } = datas
    let params = {
      GMRID: this.gmRid,
      StartDate: startDate,
      EndDate: endDate,
      CompTypeList: 'T:C:F:O:W:E:R:X:J',
      LogCodeList: logCodeList,
      Language: 'TC'
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      var myHeaders = new Headers()
      myHeaders.append('Content-Type', 'text/plain; charset=utf-8')
      fetch(`${apiUrl}`, { headers: myHeaders })
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('getDealHistory fail')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            let res = result.string.GVEUserLogXML[0].GVEUserLog
            if (res) {
              resolve(res)
            } else {
              resolve([])
            }
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
        })
    })
  }
  _getIntGmrid(gmrid) {
    let operator = 'GMRStrToInt'
    let webService = 'GVETransacs'
    let params = {
      GMRIDStr: gmrid
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('getIntGmrid fail')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            console.log(result)
            let gmRidInt = result.int._
            resolve(gmRidInt)
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
        })
    })
  }
  getUserAssets() {
    let operator = 'QueryUserCashBriefByGMRID'
    let webService = 'GVETransacs'
    let params = {
      GMRID: this.gmRidStr
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('getUserAssets fail')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            let res = result.string.NewDataSet[0].ResultSet1[0].$
            window.localStorage.setItem('userTotalMoney', res.nav)
            window.localStorage.setItem('userCanUseMoney', res.freecash)
            window.localStorage.setItem('userFrozenMoney', res.orderlockcash)
            this.userTotalMoney = res.nav
            this.userCanUseMoney = res.freecash
            this.userFrozenMoney = res.orderlockcash
            resolve(res)
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
        })
    })
  }

  getTodayPositionStructure() {
    let operator = 'QueryTodayPositionStructureXML'
    let webService = 'GVEAccount'
    let params = {
      GMRID: this.gmRid
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('getTodayPositionStructure fail')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            let res =
              result.string.GVEPortfolioStructureXML[0].GVEPortfolioStructure[0]
            resolve(res)
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
        })
    })
  }
  //取得期貨quotes
  getFuturesQuotes() {
    let operator = 'QueryFuturesPriceByGMRAssetCatalog'
    let webService = 'GVETransacs'
    let params = {
      GMRID: this.gmrid,
      AssetCatalogid: '103',
      Lang: 'TC'
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('getFuturesQuotes fail')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            let res = result.string.NewDataSet[0].ResultSet1
            if (res) {
              resolve(res)
            } else {
              resolve([])
            }
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
        })
    })
  }
  getOptionSerial(category) {
    let operator = 'QueryOptionSerial'
    let webService = 'GVETransacs'
    let params = {
      OptionClass: category
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('getOptionSerial fail')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            let res = result.string._
            if (res) {
              resolve(res)
            } else {
              resolve([])
            }
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
        })
    })
  }
  getOptionQuotes(month, category, cp) {
    let operator = 'QueryOptionsQuotePrice'
    let webService = 'GVETransacs'
    let params = {
      OptionUnderlyingCode: category,
      YYYYMM: month,
      CP: cp
    }
    let apiUrl = this._formatApiUrl(operator, params, webService)
    return new Promise((resolve, reject) => {
      fetch(`${apiUrl}`)
        .then(res => {
          if (res.ok) {
            return res.text()
          } else {
            throw new Error('getOptionQuotes fail')
          }
        })
        .then(xml => {
          xml = unescapeHtml(xml)
          xml2js.parseString(xml, (err, result) => {
            // console.log(result)
            let res = result.ArrayOfAnyType.anyType
            if (res) {
              // console.log(res)
              resolve(res)
            } else {
              resolve([])
            }
          })
        })
        .catch(e => {
          console.log(e)
          console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
        })
    })
  }
}
//漲幅排名查詢
gveAdapter.prototype.riseRankingList = function() {
  let operator = 'QueryQuotePriceByAssetCatalogOrderingUDP'
  let webService = 'GVETransacs'
  let params = {
    AssetCatalog: '101',
    Ordering: 'DESC',
    Lang: 'TC'
  }
  let apiUrl = this._formatApiUrl(operator, params, webService)
  return new Promise((resolve, reject) => {
    fetch(`${apiUrl}`)
      .then(res => {
        if (res.ok) {
          return res.text()
        } else {
          throw new Error('riseRankingList fail')
        }
      })
      .then(xml => {
        xml = unescapeHtml(xml)
        xml2js.parseString(xml, (err, result) => {
          // console.log(result)
          let res = result.string.NewDataSet[0].ResultSet1
          if (res) {
            resolve(res)
          } else {
            resolve([])
          }
        })
      })
      .catch(e => {
        console.log(e)
        console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
      })
  })
}

//取得大盤資訊(加權指:10000.tw, 台指期:10200 ...)
gveAdapter.prototype.getMarketInfo = function(Compcodelist) {
  let operator = 'QueryMarketSnap2'
  let webService = 'GVETransacs'
  let params = {
    Compcodelist: Compcodelist,
    Lang: 'TC'
  }

  let apiUrl = this._formatApiUrl(operator, params, webService)
  return new Promise((resolve, reject) => {
    fetch(`${apiUrl}`)
      .then(res => {
        if (res.ok) {
          return res.text()
        } else {
          throw new Error('getMarketInfo fail')
        }
      })
      .then(xml => {
        xml = unescapeHtml(xml)
        xml2js.parseString(xml, (err, result) => {
          // console.log(result)
          let res = result.string.NewDataSet[0].ResultSet1
          if (res) {
            resolve(res)
          } else {
            resolve([])
          }
        })
      })
      .catch(e => {
        console.log(e)
        console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
      })
  })
}

//取得競賽排名清單
gveAdapter.prototype.getGameRankingList = function() {
  let operator = 'QueryLatestFameListByGameCodeNewXML'
  let webService = 'GVETransacs'
  let params = {
    GameCode: window.localStorage.gameCode,
    day: '',
    PageNum: '1',
    PageSize: '30',
    Lang: 'TC'
  }
  let apiUrl = this._formatApiUrl(operator, params, webService)
  return new Promise((resolve, reject) => {
    fetch(`${apiUrl}`)
      .then(res => {
        if (res.ok) {
          return res.text()
        } else {
          throw new Error('getGameRankingList fail')
        }
      })
      .then(xml => {
        xml = unescapeHtml(xml)
        xml2js.parseString(xml, (err, result) => {
          console.log(result)
          let res = result.string.NewDataSet[0].ResultSet1
          if (res) {
            resolve(res)
          } else {
            resolve([])
          }
        })
      })
      .catch(e => {
        console.log(e)
        console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
      })
  })
}

//取得帳戶金額資料
gveAdapter.prototype.QueryUserCash = function() {
  let operator = 'QueryUserCashGVE3ByGMRID'
  let webService = 'GVETransacs'
  let params = {
    GMRID: this.gmRidStr,
    Lang: 'TC'
  }
  let apiUrl = this._formatApiUrl(operator, params, webService)
  return new Promise((resolve, reject) => {
    fetch(`${apiUrl}`)
      .then(res => {
        if (res.ok) {
          return res.text()
        } else {
          throw new Error('QueryUserCash fail')
        }
      })
      .then(xml => {
        xml = unescapeHtml(xml)
        xml2js.parseString(xml, (err, result) => {
          let res = result.string.NewDataSet[0].ResultSet1
          if (res) {
            resolve(res)
          } else {
            resolve([])
          }
        })
      })
      .catch(e => {
        console.log(e)
        console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
      })
  })
}
//轉帳
gveAdapter.prototype.TransferCash = function(TransferData) {
  let { fromAccount, toAccount, TransMoney } = TransferData
  let operator = 'TransferCash_NS'
  let webService = 'GVETransacs'
  let params = {
    GMRID: this.gmRidStr,
    FromAccount: TransferData.fromAccount,
    FromCurrency: 'TWD',
    ToAccount: TransferData.toAccount,
    ToCurrency: 'TWD',
    Amount: TransferData.TransMoney
  }
  let apiUrl = this._formatApiUrl(operator, params, webService)
  return new Promise((resolve, reject) => {
    fetch(`${apiUrl}`)
      .then(res => {
        if (res.ok) {
          return res.text()
        } else {
          throw new Error('TransferCash fail')
        }
      })
      .then(xml => {
        xml = unescapeHtml(xml)
        xml2js.parseString(xml, (err, result) => {
          console.log(result)
          let res = result.string._
          if (res === '100') {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
      .catch(e => {
        console.log(e)
        console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
      })
  })
}
//轉帳
gveAdapter.prototype.QueryTransferRecord = function(TransferData) {
  let { StartDate, EndDate } = TransferData
  let operator = 'QueryTransferRecordListGVE3ByGMRIDXML_NS'
  let webService = 'GVETransacs'
  let params = {
    GMRID: this.gmRid,
    StartDate: TransferData.StartDate,
    EndDate: TransferData.EndDate,
    Language: 'TC'
  }
  let apiUrl = this._formatApiUrl(operator, params, webService)
  return new Promise((resolve, reject) => {
    fetch(`${apiUrl}`)
      .then(res => {
        if (res.ok) {
          return res.text()
        } else {
          throw new Error('QueryTransferRecord fail')
        }
      })
      .then(xml => {
        xml = unescapeHtml(xml)
        xml2js.parseString(xml, (err, result) => {
          console.log(result)
          let res = result.string.GVEUserLogXML[0]
          if (res != '') {
            resolve(res.GVEUserLog)
          } else {
            resolve(false)
          }
        })
      })
      .catch(e => {
        console.log(e)
        console.log(`%c ${e.message} `, 'background: #ff1801; color: #fffefe')
      })
  })
}

export default gveAdapter
