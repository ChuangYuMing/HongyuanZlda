class AppGlobal {
  constructor() {
    if (PRODUCTION) {
      this._apiUrl = window.location.origin
    } else {
      // this._apiUrl = 'http://192.168.12.134:8080'
      this._apiUrl = 'http://192.168.12.24:8008'
      // this._apiUrl = 'http://192.168.12.153:8080'
    }
    this._wsQuoteSessionId = ''
    this._userToken = ''
    this._prodList = {}
    this.needingOrderPending = []
  }
  get apiUrl() {
    return this._apiUrl
  }
  get wsQuoteSessionId() {
    return this._wsQuoteSessionId
  }
  get prodList() {
    return this._prodList
  }
  set prodList(val) {
    this._prodList = val
  }
  set wsQuoteSessionId(val) {
    this._wsQuoteSessionId = val
  }
  addOrderPending(clorderid, callback) {
    this.needingOrderPending.push({
      clorderid,
      callback
    })
    console.log(this.needingOrderPending)
  }
}
export default new AppGlobal()

//1024*662
