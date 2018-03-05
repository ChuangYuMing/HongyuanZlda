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
    '100': 'ExDestination',
    '120': 'SettlCurrency',
    '17': 'ExecID',
    '31': 'LastPx',
    '32': 'LastQty',
    '37': 'OrderID',
    '38': 'OrderQty',
    '39': 'OrdStatus',
    '40': 'OrdType',
    '41': 'OrigClOrdID',
    '44': 'Price',
    '48': 'Symbol',
    '54': 'Side',
    '58': 'Text',
    '59': 'TimeInForce',
    '60': 'TransactTime',
    '84': 'CxlQty',
    '103': 'OrdRejReason',
    '150': 'ExecType',
    '151': 'LeavesQty',
    '30056': 'Branch',
    '49': 'SenderCompID',
    '34': 'MsgSqgNum',
    '52': 'SendingTime',
    '56': 'TargetCompID',
    '57': 'TargetSubID',
    '82': 'NoRpts',
    '553': 'Username',
    '1129': 'TokenID',
    '35': 'MsgType',
    '50': 'SenderSubID'
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
    formatObj[fix] = element
  }
  // console.log('foramtobj', formatObj)
  return formatObj
}
function formatReponse(res) {
  // console.log(res)
  if (Array.isArray(res)) {
    return res
  }
  let { fixToName } = fixDataMaping()
  let main = res['30058']
  let dataArr = []
  let finalArr = []
  if (main) {
    main.forEach(item => {
      let newItem = Object.assign({}, res, item)
      delete newItem['30058']
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
        console.log('not mapping key', key)
      }
      itemData[attrName] = element
    }
    finalArr.push(itemData)
  })

  console.log(finalArr)
  return finalArr
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
  formatRequestData
}
