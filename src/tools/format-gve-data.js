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

function actionFormat(action) {
  let bsaction = ''
  switch (action) {
    case 'B':
      bsaction = '普通買進'
      break
    case 'EQ':
      bsaction = '普通買進'
      break
    case 'S':
      bsaction = '普通賣出'
      break
    case 'MB':
      bsaction = '融資買入'
      break
    case 'RB':
      bsaction = '融資賣出'
      break
    case 'RS':
      bsaction = '融券買入'
      break
    case 'MS':
      bsaction = '融券賣出'
      break
  }
  return bsaction
}
function numFormat(num) {
  return parseFloat(num).toFixed(2)
}
export { removeZero, actionFormat, numFormat }
