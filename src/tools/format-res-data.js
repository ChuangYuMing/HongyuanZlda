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

function formatRequestData(res) {
  let obj = {
    '1': res.Account,
    '11': res.ClOrdID,
    '14': res.CumQty,
    '17': res.ExecID,
    '31': res.LastPx,
    '32': res.LastQty,
    '37': res.OrderID,
    '38': res.OrderQty,
    '39': res.OrdStatus,
    '40': res.OrdType,
    '41': res.OrigClOrdID,
    '44': res.Price,
    '48': res.Symbol,
    '54': res.Side,
    '58': res.Text,
    '59': res.TimeInForce,
    '60': res.TransactTime,
    '84': res.CxlQty,
    '103': res.OrdRejReason,
    '150': res.ExecType,
    '151': res.LeavesQty,
    '30056': res.Branch,
    '49': res.SenderCompID,
    '50': res.MSGID,
    '52': res.SendingTime,
    '56': res.TargetCompID,
    '57': res.TargetSubID,
    '82': res.NoRpts,
    '553': res.Username,
    '1129': res.TokenID,
    '11000': res.Mode,
    '30050': res.SenderSubID
  }
  return obj
}
function formatReponse(res) {
  let main = res['30058']
  let mainArr = []
  let obj = {
    SenderCompID: res['49'],
    MSGID: res['50'],
    SendingTime: res['52'],
    TargetCompID: res['56'],
    TargetSubID: res['57'],
    NoRpts: res['82'],
    Username: res['553'],
    TokenID: res['1129'],
    Mode: res['11000'],
    SenderSubID: res['30050']
  }
  main.forEach(res => {
    let itemData = {
      Account: res['1'],
      ClOrdID: res['11'],
      CumQty: res['14'],
      ExecID: res['17'],
      LastPx: res['31'],
      LastQty: res['32'],
      OrderID: res['37'],
      OrderQty: res['38'],
      OrdStatus: res['39'],
      OrdType: res['40'],
      OrigClOrdID: res['41'],
      Price: res['44'],
      Symbol: res['48'],
      Side: res['54'],
      Text: res['58'],
      TimeInForce: res['59'],
      TransactTime: res['60'],
      CxlQty: res['84'],
      OrdRejReason: res['103'],
      ExecType: res['150'],
      LeavesQty: res['151'],
      Branch: res['30056']
    }
    mainArr.push(itemData)
  })
  obj.itemData = mainArr
  // console.log(obj)
  return obj
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
