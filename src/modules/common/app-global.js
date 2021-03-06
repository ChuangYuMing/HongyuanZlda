class AppGlobal {
  constructor() {
    if (PRODUCTION) {
      // this._apiUrl = 'http://192.168.12.24:8008'
      this._apiUrl = window.location.origin
    } else {
      // this._apiUrl = 'http://192.168.12.134:8080'
      // this._apiUrl = 'http://192.168.12.24:8008'
      this._apiUrl = 'http://192.168.12.144:8008'
    }
    this._orderApiUrl = ''
    this._quoteApiUrl = ''
    this._wsQuoteSessionId = ''
    this._userToken = ''
    this._prodList = {}
    this._clordId = ''
    this._clordIdCount = 0
    this.needingOrderPending = []
    this.orderStatusMachine = {}
  }
  get apiUrl() {
    return this._apiUrl
  }
  set apiUrl(val) {
    this._apiUrl = val
  }
  get clordId() {
    return this._clordId
  }
  set clordId(val) {
    this._clordId = val
  }
  get orderApiUrl() {
    return this._orderApiUrl
  }
  set orderApiUrl(val) {
    this._orderApiUrl = val
  }
  get quoteApiUrl() {
    return this._quoteApiUrl
  }
  set quoteApiUrl(val) {
    this._quoteApiUrl = val
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
  getClordID() {
    this._clordIdCount = this._clordIdCount + 1
    return `${this._clordId}${this._clordIdCount}`
  }
  addOrderPending(orderId, callback) {
    this.needingOrderPending.push({
      orderId,
      callback
    })
  }
  addOrderStateMachine(clorderid, fsm) {
    this.orderStatusMachine[clorderid] = fsm
  }
  deleteOrderStateMachine(clorderid) {
    delete this.orderStatusMachine[clorderid]
  }
  getOrderFsm(clorderid) {
    return this.orderStatusMachine[clorderid]
  }
  changeFsmState(clorderid, status) {
    let fsm = this.orderStatusMachine[clorderid]
    let actionMaping = {
      '0': 'doAsyncNew',
      '1': 'doPartialDeal',
      '2': 'doAllDeal',
      '4': 'doCancelSuccess',
      '6': 'doCancelWait',
      '8': 'doOrderReject',
      A: 'doSyncSuccess',
      C: 'doOrderOuttime',
      cancel: 'doCancel',
      cancelFail: 'doCancelFail',
      error: 'doError'
    }

    let action = actionMaping[status]
    fsm[action]()
  }
  canTransistionOrderStatus(clorderid, status) {
    let newState = ''
    let actionMaping = {
      '0': 'do-async-new',
      '1': 'do-partial-deal',
      '2': 'do-all-deal',
      '4': 'do-cancel-success',
      '6': 'do-cancel-wait',
      '8': 'do-order-reject',
      A: 'do-sync-success',
      C: 'do-order-outtime',
      cancel: 'do-cancel',
      cancelFail: 'do-cancel-fail',
      error: 'do-error'
    }
    // let stateMaping = {
    //   '0': 'new-order',
    //   '1': 'partial-deal',
    //   '2': 'all-deal',
    //   '4': 'cancel-success',
    //   '6': 'cancel-wait',
    //   '8': 'sync-order-fail',
    //   A: 'sync-order-success',
    //   C: 'sync-order-outtime'
    // }
    return this.orderStatusMachine[clorderid].can(actionMaping[status])
  }
}
export default new AppGlobal()
//1024*662
