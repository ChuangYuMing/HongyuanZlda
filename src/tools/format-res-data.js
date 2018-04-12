function removeZero(item) {
  let l = item.length
  let stop = false
  for (let i = 0; i < l; i++) {
    if (stop) {
      break
    }
    if (item.slice(-1) === '0' || item.slice(-1) === '.') {
      if (item.slice(-1) === '.') {
        stop = true
      }
      item = item.slice(0, -1)
    }
  }
  if (item === '') {
    return '0'
  }
  return item
}

function numFormat(num) {
  return parseFloat(num).toFixed(2)
}

function fixDataMaping() {
  let fixToName = {}
  let NameToFix = {}
  fixToName = {
    '1': 'Account',
    '11': 'ClOrdID',
    '14': 'CumQty',
    '15': 'Currency',
    '17': 'ExecID',
    '31': 'LastPx',
    '32': 'LastQty',
    '34': 'MsgSeqNum',
    '35': 'MsgType',
    '37': 'OrderID',
    '38': 'OrderQty',
    '39': 'OrdStatus',
    '40': 'OrdType',
    '41': 'OrigClOrdID',
    '44': 'Price',
    '48': 'Symbol',
    '49': 'SenderCompID',
    '50': 'SenderSubID',
    '52': 'SendingTime',
    '54': 'Side',
    '55': 'isincode',
    '56': 'TargetCompID',
    '57': 'TargetSubID',
    '58': 'Text',
    '59': 'TimeInForce',
    '60': 'TransactTime',
    '82': 'NoRpts',
    '84': 'CxlQty',
    '100': 'ExDestination',
    '103': 'OrdRejReason',
    '120': 'SettlCurrency',
    '128': 'DeliverToCompID',
    '150': 'ExecType',
    '151': 'LeavesQty',
    '198': 'SecondaryOrderID',
    '268': 'NoMDEntries',
    '269': 'MDEntryType',
    '270': 'MDEntryPx',
    '271': 'MDEntrySize',
    '273': 'Timestamp',
    '340': 'Status',
    '342': 'OpenTime',
    '344': 'CloseTime',
    '421': 'Market',
    '434': 'CxlRejResponseTo',
    '553': 'Username',
    '554': 'Password',
    '1129': 'TokenID',
    '30056': 'Branch',
    '30057': 'RMode',
    '30058': 'Items',
    '30060': 'SecondaryClOrdID',
    '30061': 'Address',
    '30062': 'Phone',
    '30063': 'Email',
    '30064': 'DayTrade',
    '30065': 'Professional',
    '30066': 'Artificial',
    '30069': 'TradeUnit',
    '30072': 'CName',
    '30073': 'EName',
    '30074': 'SName',
    '30101': 'BuyLimint',
    '30102': 'BuyUsage',
    '30103': 'SellLimit',
    '30104': 'SellUsage',
    '30105': 'TransitMoney',
    '30106': 'TodayBuy',
    '30107': 'TodaySell',
    '30108': 'BankMoney',
    '30109': 'ReFund',
    '30110': 'BankMeta'
  }
  for (const key in fixToName) {
    const element = fixToName[key]
    NameToFix[element] = key
  }
  return { fixToName, NameToFix }
}
function formatRequestData(res) {
  let { NameToFix } = fixDataMaping()
  let formatObj = {}
  for (const key in res) {
    const element = res[key]
    let fix = NameToFix[key]
    if (fix) {
      formatObj[fix] = element
    } else {
      console.log(
        `%c not mapping key: ${key} `,
        'background: #ff1801; color: #fffefe'
      )
    }
  }
  // console.log('foramtobj', formatObj)
  return formatObj
}
function formatReponse(res, dataKey = '30058') {
  // console.log(res)
  if (Array.isArray(res)) {
    return res
  }
  let { fixToName } = fixDataMaping()
  let main = res[dataKey]
  let dataArr = []
  let finalArr = []
  if (main) {
    main.forEach(item => {
      let newItem = Object.assign({}, res, item)
      delete newItem[dataKey]
      dataArr.push(newItem)
    })
  } else {
    dataArr.push(res)
  }

  dataArr.forEach(res => {
    let itemData = {}
    for (const key in res) {
      const element = res[key]
      let attrName = fixToName[key]
      if (!attrName) {
        console.log(
          `%c not mapping key: ${key} `,
          'background: #ff1801; color: #fffefe'
        )
      }
      itemData[attrName] = element
    }
    finalArr.push(itemData)
  })
  // console.log(finalArr)
  return finalArr
}

function formatInventoryReponse(res) {
  let dataKey = '268'
  let { fixToName } = fixDataMaping()
  let main = res[dataKey]
  let dataArr = []
  let formatArr = []
  let symbolList = []
  if (main) {
    main.forEach(item => {
      let newItem = Object.assign({}, res, item)
      let symbol = newItem['48']
      if (symbolList.indexOf(symbol) === -1) {
        symbolList.push(symbol)
      }
      delete newItem[dataKey]
      dataArr.push(newItem)
    })
  } else {
    dataArr.push(res)
  }
  dataArr.forEach(res => {
    let itemData = {}
    for (const key in res) {
      const element = res[key]
      let attrName = fixToName[key]
      if (!attrName) {
        console.log(
          `%c not mapping key: ${key} `,
          'background: #ff1801; color: #fffefe'
        )
      }
      itemData[attrName] = element
    }
    formatArr.push(itemData)
  })
  // console.log('formatArr', formatArr)
  // console.log('symbolList', symbolList)
  let finalArr = []

  symbolList.forEach(sym => {
    let inventoryItem = {}
    formatArr.forEach(item => {
      if (sym === item['Symbol']) {
        if (Object.keys(inventoryItem).length === 0) {
          inventoryItem = item
        }
        inventoryItem[item['MDEntryType']] = {
          MDEntryPx: item['MDEntryPx'],
          MDEntrySize: item['MDEntrySize']
        }
      }
    })
    finalArr.push(inventoryItem)
  })

  console.log('formatInventoryReponse', finalArr)
  return finalArr
}

function formatFixToName(obj) {
  let { fixToName } = fixDataMaping()
  let res = {}
  for (const key in obj) {
    const item = obj[key]
    let tmp = []
    if (Array.isArray(item)) {
      item.forEach(element => {
        tmp.push(formatFixToName(element))
      })
    }
    if (tmp.length > 0) {
      res[fixToName[key]] = tmp
    } else {
      res[fixToName[key]] = item
    }
  }
  return res
}

function orderStatusMaping(status) {
  let res = ''
  let msg = {
    '0': '新單',
    '1': '部分成交',
    '2': '完全成交',
    '4': '已取消',
    '5': '已改單',
    '6': '刪單待回報',
    '7': '(已觸發停損)',
    '8': '退回(Rejected)',
    A: '新單待回報',
    C: '(已過期)',
    E: '改單待回報'
  }
  return msg[status]
}
function orderTypeMaping(status) {
  let res = ''
  let msg = {
    '1': '市價',
    '2': '限價',
    '3': '停損/利(stop)',
    '4': '停損/利限價(stop limit)',
    E: '增強限價單'
  }
  return msg[status]
}
function orderErrorMaping(status) {
  let res = ''
  let msg = {
    '0': 'Broker/Exchange option',
    '1': '商品不存在',
    '2': '已收盤',
    '3': '委託超過上限',
    '4': '(Too late to enter)',
    '5': '委託不存在',
    '6': 'ClOrdID重複',
    '7': '(Duplicate of a verbally communicated order)',
    '8': '(Stale order)',
    '1': '委託參數無效',
    '1': '數量無效',
    '1': '帳號無效',
    '9': '其他'
  }
  return msg[status]
}
export {
  removeZero,
  formatReponse,
  numFormat,
  orderStatusMaping,
  orderErrorMaping,
  formatRequestData,
  orderTypeMaping,
  formatInventoryReponse,
  formatFixToName
}
