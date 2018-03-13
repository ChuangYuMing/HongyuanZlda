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

const keyWordStockFilter = (list, keyword) => {
  console.log(list, keyword)
  var len = list.length
  var arr = []
  var reg = new RegExp(keyword)
  for (var i = 0; i < len; i++) {
    //如果字符串中不包含目标字符会返回-1
    if (list[i]['Symbol'].match(reg)) {
      // if (arr.length > 100) {
      //   break
      // }
      arr.push(list[i])
    }
  }
  return arr
}
export {
  sleep,
  getClientOffset,
  searchMinDiffItem,
  getSiblings,
  formatFormData,
  priceStyle,
  keyWordStockFilter
}
