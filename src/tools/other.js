import queryString from 'query-string'

function sleep(milliseconds) {
  var start = new Date().getTime()
  while (new Date().getTime() - start < milliseconds) {}
}

function getClientOffset(elem) {
  var top = 0,
    left = 0
  while (elem) {
    // console.log(elem)
    top = top + parseInt(elem.offsetTop)
    left = left + parseInt(elem.offsetLeft)
    elem = elem.offsetParent
  }
  return { top: top, left: left }
}

function searchMinDiffItem(array, target) {
  target = parseFloat(target)
  let datas = array.map((item, index) => {
    return parseFloat(item)
  })
  // array = array.reverse()
  // console.log(array, target);
  let minDiff = 9999999
  let targetIndex = 0

  for (let i = 0; i < datas.length; i++) {
    let diff = Math.abs(target - datas[i])
    if (diff < minDiff) {
      minDiff = diff
      targetIndex = i
    }
  }

  return {
    targetPrice: parseFloat(array[targetIndex]),
    targetIndex: targetIndex,
    diff: minDiff
  }
}

var getSiblings = function(elem) {
  var siblings = []
  var sibling = elem.parentNode.firstChild
  for (; sibling; sibling = sibling.nextSibling) {
    if (sibling.nodeType !== 1 || sibling === elem) continue
    siblings.push(sibling)
  }
  return siblings
}

function formatFormData(params) {
  let formData = new FormData()
  for (const key in params) {
    formData.append(key, params[key])
  }
  return formData
}
function formatGetRequestData(params) {
  params = queryString.stringify(params)
  return params
}
function priceStyle(target, prePrice) {
  target = parseFloat(target)
  prePrice = parseFloat(prePrice)
  if (target > prePrice) {
    return {
      color: 'red'
    }
  } else if (target < prePrice) {
    return {
      color: 'green'
    }
  } else {
    return {
      color: 'white'
    }
  }
}

const keyWordStockFilter = (list, key) => {
  console.log(list, key)
  let len = list.length
  let arr = []
  let topShowFilter = []
  for (let i = 0; i < len; i++) {
    let symbol = list[i]['Symbol']
    let targetIndex = symbol.indexOf(key)
    //如果字符串中不包含目标字符会返回-1
    if (targetIndex !== -1) {
      // console.log(symbol)
      let firstHalf = symbol.slice(0, targetIndex)
      let secondHalf = symbol.slice(targetIndex + key.length, symbol.length)
      let obj = {
        firstHalf,
        secondHalf,
        key
      }
      list[i].filterInfo = obj
      if (firstHalf === '') {
        topShowFilter.push(list[i])
      } else {
        arr.push(list[i])
      }
    }
  }
  return [...topShowFilter, ...arr]
}

function text_truncate(str, length, ending = '...') {
  if (length == null) {
    length = 100
  }
  if (ending == null) {
    ending = '...'
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending
  } else {
    return str
  }
}

function searchProperty(source = [], property = [], symbol = '') {
  let res = {}
  for (let index = 0; index < source.length; index++) {
    const item = source[index]
    if (symbol === item['Symbol']) {
      property.forEach(p => {
        res[p] = item[p]
      })
      break
    }
  }
  return res
}
export {
  sleep,
  getClientOffset,
  searchMinDiffItem,
  getSiblings,
  formatFormData,
  priceStyle,
  keyWordStockFilter,
  formatGetRequestData,
  text_truncate,
  searchProperty
}
