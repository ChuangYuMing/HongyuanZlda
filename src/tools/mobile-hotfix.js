function fixVh(element, otherHeight) {
  let isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)
  if (isSafari) {
    let a = document.querySelector(element)
    let d = window.innerHeight - otherHeight
    a.style.maxHeight = `${d}px`
  }
}

export { fixVh }
