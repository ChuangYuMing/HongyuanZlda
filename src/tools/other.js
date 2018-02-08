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
export {
  sleep,
  getClientOffset,
  searchMinDiffItem,
  getSiblings,
  formatFormData
}
