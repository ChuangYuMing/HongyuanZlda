import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// import styles from './us-order.css'
import styles from '../Order/order.css'
import classNames from 'classnames/bind'
import appGlobal from 'modules/common/app-global.js'
import SocketHandler from '../../socket-handler'
import i1 from 'static/image/i1.png'
import i2 from 'static/image/i2.png'
import throttle from 'lodash/throttle'
import { priceStyle } from 'tools/other.js'
import PopUp from 'modules/shared/components/PopUp/PopUp.js'
import FilterSearch from '../FilterSearch/FilterSearch.js'
import AccountFilterSearch from '../AccountFilterSearch/AccountFilterSearch.js'
import { Observable } from 'rxjs'
import {
  keyWordOtherFilter,
  keyWordStockFilter,
  searchProperty,
  decimalPlaces
} from 'tools/other.js'
import { Decimal } from 'decimal.js'
import Cell from '../Cell/Cell.js'

let cx = classNames.bind(styles)
let updtProdThrottle = throttle(
  callback => {
    // console.log('%c 更新quote', 'color: #e30e0e')
    callback()
  },
  100,
  { leading: false }
)

class HkOrder extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      account: props.targetAccount.get('account') || '',
      symbol: '',
      volume: '',
      price: '',
      stockUnit: '',
      currency: '',
      orderType: '2',
      date: 20180131,
      items: [],
      showPopUP: false,
      showOrderParamsCheckPopUP1: false,
      showOrderParamsCheckPopUP2: false,
      action: '',
      orderParams: {},
      showSymbolFilter: false,
      showAccountFilter: false,
      showPirceFilter: false,
      targetInput: '',
      tradeUnitPrice: '',
      checkOrderParamsMsg: '',
      isProfessional: ''
    }
    props.resetData()
    this.endIndexSymbolFilter = 100
    this.endIndexAccountFilter = 100
    this.symbolFilterList = []
    this.accountFilterList = []
    this.focusPriceItemIndex = 0
  }
  handleInputChange = e => {
    const target = e.target
    let value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    if (name === 'symbol') {
      value = value.toUpperCase()
    }
    if (name === 'price') {
      let tradeUnitPrice = this.getTradeUnitPrice(value)
      let { targetTradeUnit } = tradeUnitPrice
      let canDecimalCount = decimalPlaces(targetTradeUnit)
      let pattern = /(\d+)(\.)?\d*$/
      if (
        (value.match(pattern) || value === '') &&
        decimalPlaces(value) <= canDecimalCount
      ) {
        this.setState({
          tradeUnitPrice,
          price: value
        })
      }
      return
    }
    this.setState({
      [name]: value
    })
  }
  componentWillReceiveProps(nextProps) {
    let account = this.state.account
    let newTargetAcc = nextProps.targetAccount.get('account') || ''
    if (account !== newTargetAcc) {
      // this.props.resetData()
      this.setState({
        account: newTargetAcc
        // symbol: '',
        // price: '',
        // volume: ''
      })
    }
  }
  checkOrderParams = params => {
    // console.log(this.checkPriceLimit(0.01))
    // console.log(this.checkPriceLimit(0.02))
    // console.log(this.checkPriceLimit(0.24))
    // console.log(this.checkPriceLimit(0.25))
    // console.log(this.checkPriceLimit(0.27))
    // console.log(this.checkPriceLimit(0.45))
    // console.log(this.checkPriceLimit(100))
    // console.log(this.checkPriceLimit(199))
    // console.log(this.checkPriceLimit(10000))
    // console.log(this.checkPriceLimit(9990))
    let msg = ''
    let { Price, Account, Symbol: symbol, OrderQty } = params
    let nowPrice = this.props.quote.get('Price')
    let { customerInfo, country } = this.props
    let { stockUnit, isProfessional } = this.state
    let { Account: acc, Professional: accountIdentify } = searchProperty(
      customerInfo,
      ['Account', 'Professional'],
      ['Account', Account]
    )

    // let accIndex = customerInfo.findIndex(item => {
    //   return item.get('Account') === Account
    // })
    if (!acc) {
      msg = `無效的帳號！`
      return { errorMsg: msg, popup: 2 }
    }

    if (
      isProfessional &&
      accountIdentify !== '1' &&
      isProfessional !== accountIdentify
    ) {
      msg = `此商品須為專業投資人才可下單！`
      return { errorMsg: msg, popup: 2 }
    }
    if (OrderQty === '' || !parseFloat(OrderQty)) {
      msg = `數量不正確！`
      return { errorMsg: msg, popup: 2 }
    }
    if (!parseFloat(Price) || parseFloat(Price) <= 0) {
      msg = `價格不正確！`
      return { errorMsg: msg, popup: 2 }
    }
    let foundSymbol = this.props.prodList.find(item => {
      return item.Symbol === symbol
    })
    if (!foundSymbol) {
      msg = `股代[${symbol}]非可辨識股代或交易標的，仍要繼續？`
      return { errorMsg: msg, popup: 1 }
    }

    if (parseFloat(OrderQty) / parseInt(stockUnit) < 1) {
      msg = `下單數量非手的倍數，是否仍要送單？`
      return { errorMsg: msg, popup: 1 }
    }
    if (country === 'HK' && parseFloat(nowPrice)) {
      let { max, min } = this.checkPriceLimit(nowPrice)
      if (parseFloat(Price) > max) {
        msg = `價格高於上限，是否仍要送出？`
        return { errorMsg: msg, popup: 1 }
      }
      if (parseFloat(Price) < min) {
        msg = `價格低於下限，是否仍要送出？`
        return { errorMsg: msg, popup: 1 }
      }
    }

    return {}
    // console.log(Account, accIndex)
  }
  handleOrderAction = e => {
    let action = e.target.dataset.action
    let { account, symbol, volume, price, orderType, date } = this.state
    let { targetAccount, userId, userToken } = this.props
    let { prodList } = this.props
    let { ExDestination, DeliverToCompID } = searchProperty(
      prodList,
      ['ExDestination', 'DeliverToCompID'],
      ['Symbol', symbol]
    )
    let params = {
      MsgType: 'D',
      Symbol: symbol,
      Account: account,
      Side: action,
      OrdType: orderType,
      Price: price,
      OrderQty: volume,
      Branch: targetAccount.get('branch'),
      Username: userId,
      TokenID: userToken,
      ExDestination,
      DeliverToCompID,
      MsgSeqNum: window.location.href,
      TimeInForce: '0'
    }
    let checked = this.checkOrderParams(params)
    if (checked.hasOwnProperty('errorMsg')) {
      this.setState({
        [`showOrderParamsCheckPopUP${checked.popup}`]: true,
        checkOrderParamsMsg: checked.errorMsg,
        action,
        orderParams: params
      })
    } else {
      this.setState({
        showPopUP: true,
        action,
        orderParams: params
      })
    }
    // this.props.order(params)
  }
  order = () => {
    let params = this.state.orderParams
    this.props.order(params)
    this.closePopUp()
  }
  closePopUp = () => {
    this.setState({
      showPopUP: false,
      showOrderParamsCheckPopUP1: false,
      showOrderParamsCheckPopUP2: false
    })
  }
  showOrderPopUp = () => {
    this.setState({
      showPopUP: true,
      showOrderParamsCheckPopUP1: false,
      showOrderParamsCheckPopUP2: false
    })
  }
  getQuote = symbol => {
    // console.log('getquote')
    let country = this.props.country
    let targetSymbol = [`${symbol}.${country}`]
    let prodList = this.props.prodList
    updtProdThrottle(() => {
      this.props.getQuote(targetSymbol)
    })
    let { TradeUnit, Currency } = searchProperty(
      prodList,
      ['TradeUnit', 'Currency'],
      ['Symbol', symbol]
    )

    if (TradeUnit && Currency) {
      this.setState({
        stockUnit: TradeUnit,
        currency: Currency,
        volume: TradeUnit
      })
    } else {
      this.setState({
        stockUnit: '',
        currency: '',
        volume: ''
      })
    }
  }
  targetSearchSymbol = e => {
    // console.log('targetSearchSymbol')
    e.stopPropagation()
    let quote = this.props.quote
    let country = this.props.country
    let nowQuoteSymbol = quote.get('Symbol')
    nowQuoteSymbol = nowQuoteSymbol
      ? nowQuoteSymbol.split(`.${country}`)[0]
      : ''
    let target = e.currentTarget
    let { symbol, isProfessional } = target.dataset

    if (nowQuoteSymbol !== symbol && symbol !== '') {
      // console.log(nowQuoteSymbol, symbol)
      this.setState({
        price: '',
        showSymbolFilter: false,
        symbol,
        isProfessional
      })
      this.getQuote(symbol)
    } else {
      this.setState({
        showSymbolFilter: false,
        symbol,
        isProfessional
      })
    }
    this.volumeInput.focus()
  }
  targetSearchAccByEnterKey = (account, branch) => {
    console.log('targetSearchAccByEnterKey')
    let { targetInput, showAccountFilter } = this.state
    if (!showAccountFilter || targetInput !== 'account') {
      return
    }
    this.setState({
      showAccountFilter: false
    })
    let params = Map({
      account,
      branch
    })
    this.props.changeTargetAccount(params)
  }
  targetSearchSymbolByEnterKey = (symbol, isProfessional) => {
    console.log('targetSearchSymbolByEnterKey', symbol)
    let { targetInput, showSymbolFilter } = this.state
    if (!showSymbolFilter || targetInput !== 'symbol') {
      return
    }
    let quote = this.props.quote
    let country = this.props.country
    let nowQuoteSymbol = quote.get('Symbol')
    nowQuoteSymbol = nowQuoteSymbol
      ? nowQuoteSymbol.split(`.${country}`)[0]
      : ''
    if (nowQuoteSymbol !== symbol && symbol !== '') {
      // console.log(nowQuoteSymbol, symbol)
      this.setState({
        price: '',
        showSymbolFilter: false,
        symbol,
        isProfessional
      })
      this.getQuote(symbol)
    } else {
      this.setState({
        showSymbolFilter: false,
        symbol,
        isProfessional
      })
    }
  }
  targetSearchAcc = e => {
    // console.log('targetSearchAcc')
    e.stopPropagation()
    let target = e.currentTarget
    let { account, branch } = target.dataset
    this.setState({
      showAccountFilter: false
    })
    let params = Map({
      account,
      branch
    })
    this.props.changeTargetAccount(params)
    this.inputSymbol.focus()
  }
  checkPriceLimit = nowPrice => {
    // console.log('nowPrice', nowPrice)
    let { country } = this.props
    const miniPrice = country === 'HK' ? 0.01 : 0
    let tradeUnit = this.props.tradeUnit
    nowPrice = Decimal(nowPrice)
    let entryPx = tradeUnit.get('entryPx')
    let topLimitEntPX = ''
    let bottomLimitEntPX = ''
    let bottomUnit = ''
    let middleUnit = ''
    let topUnit = ''
    let max = Decimal(nowPrice)
    let min = Decimal(nowPrice)
    let count = 12
    for (let i = 0; i < entryPx.size; i++) {
      let pi = i - 1 < 0 ? 0 : i - 1
      const item = entryPx.get(i)
      const preItem = entryPx.get(pi)
      if (nowPrice.lessThanOrEqualTo(item)) {
        let preIndex = i - 1 < 0 ? 0 : i - 1
        let nextIndex = i + 1 > entryPx.size - 1 ? 0 : i + 1
        topLimitEntPX = item
        bottomLimitEntPX = preItem
        bottomUnit = tradeUnit.getIn(['price', preIndex])
        middleUnit = tradeUnit.getIn(['price', i])
        topUnit = tradeUnit.getIn(['price', nextIndex])
        break
      }
    }
    if (nowPrice.equals(topLimitEntPX)) {
      max = nowPrice.plus(Decimal(topUnit).times(12)).toPrecision()
      min = nowPrice.minus(Decimal(middleUnit).times(12)).toPrecision()
      return { max, min }
    }
    let maxDiff = middleUnit
    let minDiff = middleUnit
    for (let i = 0; i < count; i++) {
      max = max.plus(maxDiff)
      min = min.minus(minDiff)
      if (max.equals(topLimitEntPX)) {
        maxDiff = topUnit
      }
      if (min.equals(bottomLimitEntPX)) {
        minDiff = bottomUnit
      }
    }
    min = min.lessThanOrEqualTo(miniPrice) ? miniPrice : min
    return { max: max.toPrecision(), min: min.toPrecision() }
  }
  getTradeUnitPrice = nowPrice => {
    let tradeUnit = this.props.tradeUnit
    nowPrice = parseFloat(nowPrice)
    let entryPx = tradeUnit.get('entryPx')
    let targetTradeUnit
    let nextPrice
    let prePrice
    for (let i = 0; i < entryPx.size; i++) {
      const item = entryPx.get(i)
      const preItem = entryPx.get(i - 1)
      if (nowPrice < parseFloat(item)) {
        targetTradeUnit = tradeUnit.getIn(['price', i])
        nextPrice = Decimal(nowPrice)
          .plus(parseFloat(targetTradeUnit))
          .toPrecision()
        if (parseFloat(preItem) === nowPrice) {
          let preTargetUnit = tradeUnit.getIn(['price', i - 1])
          prePrice = Decimal(nowPrice)
            .minus(parseFloat(preTargetUnit))
            .toPrecision()
        } else {
          prePrice = Decimal(nowPrice)
            .minus(parseFloat(targetTradeUnit))
            .toPrecision()
        }
        break
      }
    }
    let res = {
      nextPrice,
      prePrice,
      targetTradeUnit
    }
    // console.log(res)
    return res
  }
  priceStepUp = () => {
    let { nextPrice } = this.state.tradeUnitPrice
    // console.log(nextPrice)
    if (nextPrice) {
      let tradeUnitPrice = this.getTradeUnitPrice(nextPrice)
      this.setState({
        price: nextPrice,
        tradeUnitPrice
      })
    }
  }
  priceStepDown = () => {
    let { prePrice } = this.state.tradeUnitPrice
    if (prePrice) {
      if (parseFloat(prePrice) >= 0.01) {
        let tradeUnitPrice = this.getTradeUnitPrice(prePrice)
        this.setState({
          price: parseFloat(prePrice) < 0.01 ? '0.01' : prePrice,
          tradeUnitPrice
        })
      }
    }
  }
  clickPriceWrap = e => {
    let price = e.currentTarget.dataset.price
    let pattern = /(\d+)(\.)?\d*$/
    if (price && (price.match(pattern) || price === '')) {
      let tradeUnitPrice = this.getTradeUnitPrice(price)
      this.setState({
        showPirceFilter: false,
        price,
        tradeUnitPrice
      })
    } else {
      this.setState({
        showPirceFilter: false
      })
    }
  }
  componentWillUnmount() {
    this.OrderWrapSub.unsubscribe()
    this.enterKeyDown.unsubscribe()
    this.priceWrapEnter.unsubscribe()
  }
  componentDidMount() {
    let symbolSearch = this.inputSymbol
    let accSearch = this.inputAcc
    let priceSearch = this.inputPrice
    let volumeInput = this.volumeInput
    let inputList = [accSearch, symbolSearch, volumeInput, priceSearch]
    let foucsInputPostion = -1
    let suggestList = this.suggestList
    let suggestWrap = this.orderStockFilter
    let accSuggestWrap = this.accountFilter
    let orderWrap = document.getElementById('orderWrap')
    let keyword = Observable.fromEvent(symbolSearch, 'input')
    let accKeyword = Observable.fromEvent(accSearch, 'input')
    let priceKeyword = Observable.fromEvent(priceSearch, 'input')
    let priceInputFocus = Observable.fromEvent(priceSearch, 'focus')
    let volumeInputFocus = Observable.fromEvent(volumeInput, 'focus')
    let focus = Observable.fromEvent(symbolSearch, 'focus')
    let accInputFocus = Observable.fromEvent(accSearch, 'focus')
    let wheelSuggest = Observable.fromEvent(suggestWrap, 'wheel')
    let scrollSuggest = Observable.fromEvent(suggestWrap, 'scroll')
    let accWheelSuggest = Observable.fromEvent(accSuggestWrap, 'wheel')
    let accScrollSuggest = Observable.fromEvent(accSuggestWrap, 'scroll')
    let clickOrderWrap = Observable.fromEvent(orderWrap, 'click')
    let keyDowns = Observable.fromEvent(document, 'keydown')
    let keyUps = Observable.fromEvent(document, 'keyup')
    let keyActions = Observable.merge(keyDowns, keyUps)
    let scrollMerge = Observable.merge(wheelSuggest, scrollSuggest)
    let accScrollMerge = Observable.merge(accWheelSuggest, accScrollSuggest)
    let targetValue = ''
    let focusAccKeyMaping = []

    let priceListWrap = document.querySelector(`.${styles['price-wrap']} ul`)

    let accFoucsbyKey = keyActions.subscribe(e => {
      let key = e.keyCode
      if (e.type === 'keydown') {
        if (key === 17 || key === 65) {
          focusAccKeyMaping.push(key)
        }
        if (focusAccKeyMaping[0] === 17 && focusAccKeyMaping[1] === 65) {
          accSearch.focus()
        }
      } else if (e.type === 'keyup') {
        focusAccKeyMaping.length = 0
      }
    })
    let orderBuyByKey = keyDowns.filter(e => e.keyCode === 113).subscribe(e => {
      let buyBtn = document.querySelector(
        `.${styles['action']} .${styles['buy']}`
      )
      buyBtn.click()
    })
    let orderSellByKey = keyDowns
      .filter(e => e.keyCode === 121)
      .subscribe(e => {
        let sellbBtn = document.querySelector(
          `.${styles['action']} .${styles['sell']}`
        )
        sellbBtn.click()
      })
    let escKeyDown = keyDowns.filter(e => e.keyCode === 27).subscribe(e => {
      if (this.state.showPopUP) {
        let esc = document.querySelector(`.${styles['order-popup']} .esc`)
        esc.click()
      } else {
        foucsInputPostion =
          foucsInputPostion === 0 ? inputList.length - 1 : foucsInputPostion - 1
        if (inputList[foucsInputPostion]) {
          inputList[foucsInputPostion].focus()
          setTimeout(() => {
            inputList[foucsInputPostion].select()
          }, 0)
        }
      }
    })
    this.preKeyDown = keyDowns.filter(e => e.keyCode === 37).subscribe(e => {
      foucsInputPostion =
        foucsInputPostion === 0 ? inputList.length - 1 : foucsInputPostion - 1
      if (inputList[foucsInputPostion]) {
        inputList[foucsInputPostion].focus()
        setTimeout(() => {
          inputList[foucsInputPostion].select()
        }, 0)
      }
    })
    this.nextKeyDown = keyDowns.filter(e => e.keyCode === 39).subscribe(e => {
      foucsInputPostion =
        foucsInputPostion === inputList.length - 1 ? 0 : foucsInputPostion + 1
      if (inputList[foucsInputPostion]) {
        inputList[foucsInputPostion].focus()
        setTimeout(() => {
          inputList[foucsInputPostion].select()
        }, 0)
      }
    })
    this.enterKeyDown = keyDowns
      .debounceTime(200)
      .filter(e => e.keyCode === 13)
      .subscribe(e => {
        let { targetInput, showPopUP } = this.state
        if (showPopUP) {
          let buy = document.querySelector(`.${styles['order-popup']} .enter`)
          buy.click()
          return
        }

        if (targetInput === 'account') {
          let account = this.state.account
          let { Branch } = searchProperty(
            this.props.customerInfo,
            ['Branch'],
            ['Account', account]
          )
          let params = Map({
            account,
            branch: Branch
          })
          this.props.changeTargetAccount(params)
          symbolSearch.focus()
          return
        }
        if (targetInput === 'symbol') {
          let { symbol } = this.state
          let { quote, country } = this.props
          let nowQuoteSymbol = quote.get('Symbol')
          nowQuoteSymbol = nowQuoteSymbol
            ? nowQuoteSymbol.split(`.${country}`)[0]
            : ''
          volumeInput.focus()
          if (nowQuoteSymbol !== symbol && symbol !== '') {
            this.getQuote(symbol)
          }
          return
        }
        if (targetInput === 'volume') {
          priceSearch.focus()
          return
        }
        if (targetInput === 'price') {
          this.setState({
            showPirceFilter: false
          })
          return
        }
        // console.log(e.keyCode)
      })

    priceInputFocus.map(e => e).subscribe(e => {
      this.setState({
        showSymbolFilter: false,
        showAccountFilter: false,
        showPirceFilter: true,
        targetInput: 'price'
      })
      foucsInputPostion = 3
      priceSearch.select()
      let focusItem = priceListWrap.querySelector(
        `li:nth-child(${this.focusPriceItemIndex})`
      )
      if (focusItem) {
        focusItem.classList.remove(styles['focus'])
      }
      this.focusPriceItemIndex = 0
      // let nextFocusItem = priceListWrap.querySelector(
      //   `li:nth-child(${this.focusPriceItemIndex})`
      // )
      // nextFocusItem.classList.add(styles['focus'])
    })
    volumeInputFocus.map(e => e).subscribe(e => {
      // console.log('volumeInputFocus')
      this.setState({
        showSymbolFilter: false,
        showAccountFilter: false,
        showPirceFilter: false,
        targetInput: 'volume'
      })
      foucsInputPostion = 2
      volumeInput.select()
    })
    focus.map(e => e).subscribe(e => {
      console.log('focus')
      this.setState({
        showSymbolFilter: true,
        showAccountFilter: false,
        showPirceFilter: false,
        targetInput: 'symbol'
      })
      foucsInputPostion = 1
      symbolSearch.select()
      let prodList = this.props.prodList
      let targetValue = e.target.value
      let list = keyWordStockFilter(prodList, targetValue, 'Symbol')
      this.symbolFilterList = list
      this.endIndexSymbolFilter = 100
      this.filterSearch.updateData(list, this.endIndexSymbolFilter)
      this.orderStockFilter.scrollTop = 0
    })
    accInputFocus.map(e => e).subscribe(e => {
      // console.log('accInputFocus@@')
      this.setState({
        showSymbolFilter: false,
        showAccountFilter: true,
        showPirceFilter: false,
        targetInput: 'account'
      })
      foucsInputPostion = 0
      accSearch.select()
      let accountList = this.props.accountList
      let targetValue = e.target.value
      let list = keyWordOtherFilter(accountList, targetValue, 'Account')
      this.accountFilterList = list
      this.endIndexAccountFilter = 100
      this.filterAccSearch.updateData(list, this.endIndexAccountFilter)
      this.accountFilter.scrollTop = 0
    })

    this.OrderWrapSub = clickOrderWrap
      .debounceTime(100)
      .filter(e => {
        let targetName = e.target.name
        let parent = e.target.parentElement
        let grandParent = parent.parentElement
        // console.log(e.target, parent)
        if (
          parent.nodeName === 'UL' ||
          parent.nodeName === 'LI' ||
          grandParent.nodeName === 'UL' ||
          grandParent.nodeName === 'LI'
        ) {
          return false
        }
        if (targetName === this.state.targetInput) {
          return false
        }
        return true
      })
      .map(e => e)
      .subscribe(e => {
        // console.log('OrderWrapSub')
        let country = this.props.country
        let quote = this.props.quote
        let nowQuoteSymbol = quote.get('Symbol')
        nowQuoteSymbol = nowQuoteSymbol
          ? nowQuoteSymbol.split(`.${country}`)[0]
          : ''
        let { symbol } = this.state

        if (nowQuoteSymbol !== symbol) {
          this.getQuote(symbol)
        }
        this.setState({
          showSymbolFilter: false,
          showAccountFilter: false,
          showPirceFilter: false
        })
      })
    keyword
      .debounceTime(100)
      .switchMap(e => {
        targetValue = e.target.value.toUpperCase()
        return Observable.create(observer => {
          let prodList = this.props.prodList
          let list = keyWordStockFilter(prodList, targetValue, 'Symbol')
          // console.log(list)
          observer.next(list)
        })
      }, (e, res) => res)
      .subscribe(list => {
        this.symbolFilterList = list
        this.endIndexSymbolFilter = 100
        this.filterSearch.updateData(list, this.endIndexSymbolFilter)
        this.orderStockFilter.scrollTop = 0
        if (!this.state.showSymbolFilter) {
          this.setState({
            showSymbolFilter: true
          })
        }
      })
    accKeyword
      .debounceTime(100)
      .switchMap(e => {
        targetValue = e.target.value
        return Observable.create(observer => {
          let accountList = this.props.accountList
          let list = keyWordOtherFilter(accountList, targetValue, 'Account')
          // console.log(list)
          observer.next(list)
        })
      }, (e, res) => res)
      .subscribe(list => {
        this.accountFilterList = list
        this.endIndexAccountFilter = 100
        this.filterAccSearch.updateData(list, this.endIndexAccountFilter)
        this.accountFilter.scrollTop = 0
      })

    scrollMerge
      .auditTime(1000)
      .map(e => e)
      .subscribe(res => {
        let wrapHeight = this.endIndexSymbolFilter * 19
        let leavePxToBottom = wrapHeight - suggestWrap.scrollTop
        if (leavePxToBottom < 1000) {
          this.endIndexSymbolFilter = this.endIndexSymbolFilter + 200
          this.filterSearch.updateData(
            this.symbolFilterList,
            this.endIndexSymbolFilter,
            'lazyLoad'
          )
        }
      })
    accScrollMerge
      .auditTime(1000)
      .map(e => e)
      .subscribe(res => {
        let wrapHeight = this.endIndexAccountFilter * 19
        let leavePxToBottom = wrapHeight - accSuggestWrap.scrollTop
        if (leavePxToBottom < 1000) {
          this.endIndexAccountFilter = this.endIndexAccountFilter + 200
          this.filterAccSearch.updateData(
            this.accountFilterList,
            this.endIndexAccountFilter,
            'lazyLoad'
          )
        }
      })

    let downByKey = keyDowns.filter(e => e.keyCode === 40).subscribe(e => {
      let { targetInput, showPirceFilter } = this.state
      if (!showPirceFilter || targetInput !== 'price') {
        return
      }

      if (this.focusPriceItemIndex < 7) {
        let focusItem = priceListWrap.querySelector(
          `li:nth-child(${this.focusPriceItemIndex})`
        )

        let nextFocusItem = priceListWrap.querySelector(
          `li:nth-child(${this.focusPriceItemIndex + 1})`
        )
        if (focusItem) {
          focusItem.classList.remove(styles['focus'])
        }
        nextFocusItem.classList.add(styles['focus'])
        this.focusPriceItemIndex = this.focusPriceItemIndex + 1
      }
    })
    let upByKey = keyDowns.filter(e => e.keyCode === 38).subscribe(e => {
      let { targetInput, showPirceFilter } = this.state
      if (!showPirceFilter || targetInput !== 'price') {
        return
      }
      if (this.focusPriceItemIndex > 1) {
        let focusItem = priceListWrap.querySelector(
          `li:nth-child(${this.focusPriceItemIndex})`
        )
        let nextFocusItem = priceListWrap.querySelector(
          `li:nth-child(${this.focusPriceItemIndex - 1})`
        )
        focusItem.classList.remove(styles['focus'])
        nextFocusItem.classList.add(styles['focus'])
        this.focusPriceItemIndex = this.focusPriceItemIndex - 1
      }
    })
    this.priceWrapEnter = keyDowns
      .filter(e => e.keyCode === 13)
      .subscribe(e => {
        let { targetInput, showPirceFilter } = this.state
        if (!showPirceFilter || targetInput !== 'price') {
          return
        }
        let focusItem = priceListWrap.querySelector(
          `li:nth-child(${this.focusPriceItemIndex})`
        )
        if (focusItem) {
          focusItem.click()
        }
        this.setState({
          showPirceFilter: false
        })
      })
  }
  render() {
    let { quote, accountList, country, marketName } = this.props
    let prodList = this.props.prodList || []
    let Symbol = quote.get('Symbol')
    let Name = quote.get('Name')
    let APrice =
      quote.get('APrice') && quote.get('APrice') !== '--'
        ? Decimal(quote.get('APrice')).toFixed(3, Decimal.ROUND_DOWN)
        : '--'
    let BPrice =
      quote.get('BPrice') && quote.get('BPrice') !== '--'
        ? Decimal(quote.get('BPrice')).toFixed(3, Decimal.ROUND_DOWN)
        : '--'
    let Price =
      quote.get('Price') && quote.get('Price') !== '--'
        ? Decimal(quote.get('Price')).toFixed(3, Decimal.ROUND_DOWN)
        : '--'
    let Open =
      quote.get('Open') && quote.get('Open') !== '--'
        ? Decimal(quote.get('Open')).toFixed(3, Decimal.ROUND_DOWN)
        : '--'
    let PrePrice =
      quote.get('PrePrice') && quote.get('PrePrice') !== '--'
        ? Decimal(quote.get('PrePrice')).toFixed(3, Decimal.ROUND_DOWN)
        : '--'
    let HighLimitPrice =
      quote.get('HighLimitPrice') && quote.get('HighLimitPrice') !== '--'
        ? Decimal(quote.get('HighLimitPrice')).toFixed(3, Decimal.ROUND_DOWN)
        : '--'
    let LowLimitPrice =
      quote.get('LowLimitPrice') && quote.get('LowLimitPrice') !== '--'
        ? Decimal(quote.get('LowLimitPrice')).toFixed(3, Decimal.ROUND_DOWN)
        : '--'
    let high =
      quote.get('high') && quote.get('high') !== '--'
        ? Decimal(quote.get('high')).toFixed(3, Decimal.ROUND_DOWN)
        : '--'
    let low =
      quote.get('low') && quote.get('low') !== '--'
        ? Decimal(quote.get('low')).toFixed(3, Decimal.ROUND_DOWN)
        : '--'

    let NameArr = Name ? Name.split('/') : ['']
    Name = NameArr.length > 1 ? NameArr[1] : NameArr[0]

    // APrice = parseFloat(APrice) > 0 ? parseFloat(APrice) : APrice
    // BPrice = parseFloat(BPrice) > 0 ? parseFloat(BPrice) : BPrice
    // Price = parseFloat(Price) > 0 ? parseFloat(Price) : Price
    // Open = parseFloat(Open) > 0 ? parseFloat(Open) : Open
    // PrePrice = parseFloat(PrePrice) > 0 ? parseFloat(PrePrice) : PrePrice
    // HighLimitPrice =
    //   parseFloat(HighLimitPrice) > 0
    //     ? parseFloat(HighLimitPrice)
    //     : HighLimitPrice
    // LowLimitPrice =
    //   parseFloat(LowLimitPrice) > 0 ? parseFloat(LowLimitPrice) : LowLimitPrice
    // high = parseFloat(high) > 0 ? parseFloat(high) : high
    // low = parseFloat(low) > 0 ? parseFloat(low) : low

    let pStyle = priceStyle(Price, PrePrice)
    let bPriceStyle = priceStyle(BPrice, PrePrice)
    let aPriceStyle = priceStyle(APrice, PrePrice)
    let openStyle = priceStyle(Open, PrePrice)
    let highStyle = priceStyle(high, PrePrice)
    let lowStyle = priceStyle(low, PrePrice)
    let limitHighStyle = priceStyle(99999, PrePrice)
    let limitLowStyle = priceStyle(0, PrePrice)
    let {
      account,
      symbol,
      volume,
      price,
      orderType,
      date,
      action,
      stockUnit,
      currency
    } = this.state
    let orderPopTitle = marketName
    let { CName } = searchProperty(
      this.props.customerInfo,
      ['CName'],
      ['Account', account]
    )
    return (
      <div className={cx('usorder-wrap')}>
        <div className={cx('action-wrap')}>
          <div className={cx('input-wrap')}>
            <div className={cx('item-wrap', 't1')}>
              <span>帳號：</span>
              <div className={cx('acc-input-wrap')}>
                <input
                  type="text"
                  name="account"
                  value={account}
                  autoComplete="off"
                  onChange={this.handleInputChange}
                  ref={input => {
                    this.inputAcc = input
                  }}
                />
                <div
                  id="accountFilter"
                  ref={e => (this.accountFilter = e)}
                  className={
                    this.state.showAccountFilter
                      ? cx('acc-filter')
                      : cx('acc-filter', 'hide')
                  }
                >
                  <AccountFilterSearch
                    onClick={this.targetSearchAcc}
                    listRef={list => (this.suggestAccList = list)}
                    onEnter={this.targetSearchAccByEnterKey}
                    ref={e => (this.filterAccSearch = e)}
                  />
                </div>
              </div>
            </div>
            <div className={cx('item-wrap', 't1-1')}>
              <span className={cx('name')}>{CName}</span>
            </div>
            <div className={cx('item-wrap', 't2')}>
              <span>股票：</span>
              <div className={cx('stock-input-wrap')}>
                <input
                  type="text"
                  name="symbol"
                  value={this.state.symbol}
                  autoComplete="off"
                  onChange={this.handleInputChange}
                  ref={input => {
                    this.inputSymbol = input
                  }}
                />
                <div
                  id="orderStockFilter"
                  ref={e => (this.orderStockFilter = e)}
                  className={
                    this.state.showSymbolFilter
                      ? cx('stock-filter')
                      : cx('stock-filter', 'hide')
                  }
                >
                  <FilterSearch
                    onClick={this.targetSearchSymbol}
                    onEnter={this.targetSearchSymbolByEnterKey}
                    listRef={list => (this.suggestList = list)}
                    ref={e => (this.filterSearch = e)}
                  />
                </div>
              </div>
            </div>

            <div className={cx('item-wrap', 't3')}>
              <span>數量：</span>
              <input
                type="text"
                name="volume"
                value={this.state.volume}
                autoComplete="off"
                onChange={this.handleInputChange}
                ref={i => (this.volumeInput = i)}
              />
            </div>

            <div className={cx('item-wrap', 't4')}>
              <span>價格：</span>
              <div className={cx('price-input-wrap')}>
                <input
                  type="text"
                  name="price"
                  value={this.state.price}
                  onChange={this.handleInputChange}
                  autoComplete="off"
                  ref={input => {
                    this.inputPrice = input
                  }}
                />
                <span
                  onClick={this.priceStepUp}
                  className={cx('top-triangle')}
                />
                <span
                  onClick={this.priceStepDown}
                  className={cx('bottom-triangle')}
                />
                <div
                  ref={e => (this.priceFilter = e)}
                  className={
                    this.state.showPirceFilter
                      ? cx('price-filter')
                      : cx('price-filter', 'hide')
                  }
                >
                  <div className={cx('price-wrap')}>
                    <ul>
                      <li
                        onClick={this.clickPriceWrap}
                        data-price={
                          parseFloat(BPrice) > 0 ? parseFloat(BPrice) : BPrice
                        }
                      >
                        <span className={cx('left-wrap')}>[+1] 買進價</span>
                        <span className={cx('right-wrap')} style={bPriceStyle}>
                          {BPrice}
                        </span>
                      </li>
                      <li
                        onClick={this.clickPriceWrap}
                        data-price={
                          parseFloat(APrice) > 0 ? parseFloat(APrice) : APrice
                        }
                      >
                        <span className={cx('left-wrap')}>[+2] 賣出價</span>
                        <span className={cx('right-wrap')} style={bPriceStyle}>
                          {APrice}
                        </span>
                      </li>
                      <li
                        onClick={this.clickPriceWrap}
                        data-price={
                          parseFloat(Price) > 0 ? parseFloat(Price) : Price
                        }
                      >
                        <span className={cx('left-wrap')}>[+3] 成交價</span>
                        <span className={cx('right-wrap')} style={bPriceStyle}>
                          {Price}
                        </span>
                      </li>
                      <li
                        onClick={this.clickPriceWrap}
                        data-price={
                          parseFloat(Open) > 0 ? parseFloat(Open) : Open
                        }
                      >
                        <span className={cx('left-wrap')}>[+4] 開盤價</span>
                        <span className={cx('right-wrap')} style={bPriceStyle}>
                          {Open}
                        </span>
                      </li>
                      <li
                        onClick={this.clickPriceWrap}
                        data-price={
                          parseFloat(PrePrice) > 0
                            ? parseFloat(PrePrice)
                            : PrePrice
                        }
                      >
                        <span className={cx('left-wrap')}>[+5] 平盤價</span>
                        <span className={cx('right-wrap')} style={bPriceStyle}>
                          {PrePrice}
                        </span>
                      </li>
                      <li
                        onClick={this.clickPriceWrap}
                        data-price={
                          parseFloat(high) > 0 ? parseFloat(high) : high
                        }
                      >
                        <span className={cx('left-wrap')}>[+6] 今高價</span>
                        <span className={cx('right-wrap')} style={bPriceStyle}>
                          {high}
                        </span>
                      </li>
                      <li
                        onClick={this.clickPriceWrap}
                        data-price={parseFloat(low) > 0 ? parseFloat(low) : low}
                      >
                        <span className={cx('left-wrap')}>[+7] 今低價</span>
                        <span className={cx('right-wrap')} style={bPriceStyle}>
                          {low}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className={cx('item-wrap', 't5')}>
              <span>交易種類：</span>
              <select
                name="orderType"
                value={this.state.orderType}
                onChange={this.handleInputChange}
              >
                <option key="1" value="2">
                  限價
                </option>
              </select>
            </div>
          </div>

          <div className={cx('action')} onClick={this.handleOrderAction}>
            <span data-action="1" className={cx('btn', 'buy')}>
              買[F2]
            </span>
            <span data-action="2" className={cx('btn', 'sell')}>
              賣[F10]
            </span>
          </div>
        </div>
        <div className={cx('info-wrap')}>
          <div className={cx('item-wrap', 'b1')}>
            <span>買進</span>
            <span style={bPriceStyle}>
              <Cell value={BPrice} />
            </span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>賣出</span>
            <span style={aPriceStyle}>
              <Cell value={APrice} />
            </span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>成交</span>
            <span style={pStyle}>
              <Cell value={Price} />
            </span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>開盤價</span>
            <span style={openStyle}>{Open}</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>平盤價</span>
            <span>{PrePrice}</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>漲停價</span>
            <span style={limitHighStyle}>{HighLimitPrice}</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>跌停價</span>
            <span style={limitLowStyle}>{LowLimitPrice}</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>今高價</span>
            <span style={highStyle}>
              <Cell value={high} />
            </span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>今低價</span>
            <span style={lowStyle}>
              <Cell value={low} />
            </span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>股代</span>
            <span>{Symbol}</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>手單位</span>
            <span>{stockUnit}</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>交易幣別</span>
            <span>{currency}</span>
          </div>
          <div className={cx('item-wrap', 'name')}>
            <span>股名</span>
            <span>{Name}</span>
          </div>
        </div>
        <PopUp
          show={this.state.showPopUP}
          width="600px"
          height="300px"
          zIndex="12"
          data={this.state.orderParams}
        >
          <div className={cx('order-popup')}>
            <div className={cx('title')}>
              <span>確認委託（{orderPopTitle}）</span>
            </div>
            <div
              className={
                action === '1' ? cx('main', 'buy') : cx('main', 'sell')
              }
            >
              <div className={cx('left')}>
                <div className={cx('acc-wrap')}>
                  <span className={cx('s1')}>{CName}</span>
                  <span className={cx('s3')}>({account})</span>
                </div>
              </div>
              <div className={cx('right')}>
                <div className={cx('item')}>
                  <span className={cx('s1')}>
                    {action === '1' ? '買' : '賣'}
                  </span>
                  <span className={cx('s2')}>
                    {orderType === '0' ? '限價盤' : '增強限價盤'}
                  </span>
                </div>
                <div className={cx('item')}>
                  <span className={cx('s1')}>{`${Name}`}</span>
                  <span>{`${symbol}`}</span>
                </div>
                <div className={cx('item')}>
                  <span className={cx('s1')}>{volume}</span>
                  <span className={cx('s2')}>股</span>
                </div>
                <div className={cx('item')}>
                  <span className={cx('s2')}>價位</span>
                  <span className={cx('s1')}>{price}</span>
                </div>
              </div>
            </div>
            <div className={cx('bottom')}>
              <div className={cx('button-wrap')}>
                <span onClick={this.order} className={cx('btn', 'enter')}>
                  委託單送出[Enter]
                </span>
                <span onClick={this.closePopUp} className={cx('btn', 'esc')}>
                  取消[Esc]
                </span>
              </div>
            </div>
          </div>
        </PopUp>
        <PopUp
          show={this.state.showOrderParamsCheckPopUP1}
          width="300px"
          height="100px"
          zIndex="12"
          data={this.state.orderParams}
        >
          <div className={cx('check-params-popup')}>
            <div className={cx('main')}>
              <div className={cx('msg')}>{this.state.checkOrderParamsMsg}</div>
            </div>
            <div className={cx('bottom')}>
              <div className={cx('button-wrap')}>
                <span onClick={this.showOrderPopUp} className={cx('btn')}>
                  是
                </span>
                <span onClick={this.closePopUp} className={cx('btn')}>
                  否
                </span>
              </div>
            </div>
          </div>
        </PopUp>
        <PopUp
          show={this.state.showOrderParamsCheckPopUP2}
          width="300px"
          height="100px"
          zIndex="12"
          data={this.state.orderParams}
        >
          <div className={cx('check-params-popup')}>
            <div className={cx('main')}>
              <div className={cx('msg')}>{this.state.checkOrderParamsMsg}</div>
            </div>
            <div className={cx('bottom')}>
              <div className={cx('button-wrap')}>
                <span onClick={this.closePopUp} className={cx('btn')}>
                  確定
                </span>
              </div>
            </div>
          </div>
        </PopUp>
      </div>
    )
  }
}

HkOrder.propTypes = {}

export default HkOrder
