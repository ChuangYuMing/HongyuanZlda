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

function formatReponse(res) {
  let obj = {
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
    SenderCompID: res['49'],
    MSGID: res['50'],
    SendingTime: res['52'],
    Side: res['54'],
    TargetCompID: res['56'],
    TargetSubID: res['57'],
    Text: res['58'],
    TimeInForce: res['59'],
    TransactTime: res['60'],
    CxlQty: res['84'],
    OrdRejReason: res['103'],
    ExecType: res['150'],
    LeavesQty: res['151'],
    TokenID: res['1129'],
    Mode: res['11000'],
    SenderSubID: res['30050'],
    Branch: res['30056']
  }
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
export { removeZero, formatReponse, numFormat, orderStatusMaping }
