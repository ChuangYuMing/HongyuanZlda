class AppGlobal {
  constructor() {
    this._apiUrl = 'http://192.168.12.134:8080'
    // this._apiUrl = 'http://192.168.12.166:8080'
    this._wsQuoteSessionId = ''
  }
  get apiUrl() {
    return this._apiUrl
  }
  get wsQuoteSessionId() {
    return this._wsQuoteSessionId
  }
  set wsQuoteSessionId(val) {
    this._wsQuoteSessionId = val
  }
}
export default new AppGlobal()

//1024*662
