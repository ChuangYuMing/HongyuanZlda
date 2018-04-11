import queryString from 'query-string'
import { isImmutable } from 'immutable'
import { getDateFromFormat, formatDate } from 'tools/date.js'

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

const keyWordStockFilter = (list, key, targetProperty = '') => {
  // console.log(list, key)
  let len = list.length
  let arr = []
  let topShowFilter = []
  for (let i = 0; i < len; i++) {
    let targetValue = list[i][targetProperty]
    let targetIndex = targetValue.indexOf(key)
    //如果字符串中不包含目标字符会返回-1
    if (targetIndex !== -1) {
      // console.log(targetValue)
      let firstHalf = targetValue.slice(0, targetIndex)
      let secondHalf = targetValue.slice(
        targetIndex + key.length,
        targetValue.length
      )
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

const keyWordOtherFilter = (list, key, targetProperty = '') => {
  // console.log(list, key)
  let len = list.size
  let arr = List([])
  let topShowFilter = List([])
  for (let i = 0; i < len; i++) {
    let targetValue = list.getIn([i, targetProperty])
    let targetIndex = targetValue.indexOf(key)
    //如果字符串中不包含目标字符会返回-1
    if (targetIndex !== -1) {
      let firstHalf = targetValue.slice(0, targetIndex)
      let secondHalf = targetValue.slice(
        targetIndex + key.length,
        targetValue.length
      )
      let obj = Map({
        firstHalf,
        secondHalf,
        key
      })
      list = list.setIn([i, 'filterInfo'], obj)
      if (firstHalf === '') {
        topShowFilter = topShowFilter.push(list.get(i))
      } else {
        arr = arr.push(list.get(i))
      }
    }
  }
  // console.log(topShowFilter.toJS())
  // console.log(arr.toJS())
  return topShowFilter.concat(arr)
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

function searchProperty(source = [], property = [], filter = []) {
  let res = {}
  //for immutable
  if (List.isList(source)) {
    for (let index = 0; index < source.size; index++) {
      const item = source.get(index)
      if (filter[1] === item.get(filter[0])) {
        property.forEach(p => {
          res[p] = item.get(p)
        })
        break
      }
    }
    return res
  }
  for (let index = 0; index < source.length; index++) {
    const item = source[index]
    if (filter[1] === item[filter[0]]) {
      property.forEach(p => {
        res[p] = item[p]
      })
      break
    }
  }
  return res
}

function decimalPlaces(num) {
  var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/)
  if (!match) {
    return 0
  }
  return Math.max(
    0,
    // Number of digits right of decimal point.
    (match[1] ? match[1].length : 0) -
      // Adjust for scientific notation.
      (match[2] ? +match[2] : 0)
  )
}

function changeToLocalTime(time) {
  let localTime = ''
  try {
    if (time !== '--') {
      localTime = getDateFromFormat(time.split('.')[0], 'yMMdd-HH:mm:ss')
      let offset = new Date().getTimezoneOffset()
      localTime =
        offset < 0
          ? localTime - offset * 60 * 1000
          : localTime + offset * 60 * 1000

      localTime = formatDate(new Date(localTime), 'HH:mm:ss')
    }
  } catch (error) {
    console.log(error)
  }
  return localTime
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
  searchProperty,
  keyWordOtherFilter,
  decimalPlaces,
  changeToLocalTime
}
