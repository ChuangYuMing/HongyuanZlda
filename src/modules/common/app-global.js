class AppGlobal {
  constructor() {
    this._apiUrl = 'http://192.168.12.134:8080'
    this._socketSession = ''
  }
  get apiUrl() {
    return this._apiUrl
  }
}
export default new AppGlobal()
