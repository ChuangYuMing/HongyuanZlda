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
import { Observable } from 'rxjs'
import { keyWordStockFilter } from 'tools/other.js'

let cx = classNames.bind(styles)
let updtProdThrottle = throttle(
  callback => {
    // console.log('%c 更新quote', 'color: #e30e0e')
    callback()
  },
  1000,
  { leading: false }
)

class HkOrder extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      account: props.targetAccount,
      symbol: '',
      volume: 1,
      price: '',
      orderType: '2',
      date: 20180131,
      items: [],
      showPopUP: false,
      action: '',
      orderParams: {},
      showSymbolFilter: false
    }
    props.resetData()
    this.prodList = this.props.prodList
    this.endIndexSymbolFilter = 100
    this.symbolFilterList = []
  }
  handleInputChange = e => {
    // console.log(this)
    const target = e.target
    let value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }
  componentWillReceiveProps(nextProps) {
    let account = this.state.account
    let newTarget = nextProps.targetAccount
    if (account !== newTarget) {
      this.setState({
        account: newTarget
      })
    }
  }
  handleOrderAction = e => {
    let action = e.target.dataset.action
    let { account, symbol, volume, price, orderType, date } = this.state
    // let account = this.props.targetAccount
    let params = {
      MsgType: 'D',
      Symbol: symbol,
      Account: account,
      Side: action,
      OrdType: orderType,
      Price: price,
      OrderQty: volume,
      Branch: 'branch01',
      Username: this.props.userId
    }
    this.setState({
      showPopUP: true,
      action,
      orderParams: params
    })
    // this.props.order(params)
  }
  order = () => {
    let params = this.state.orderParams
    this.props.order(params)
    this.closePopUp()
  }
  closePopUp = () => {
    this.setState({
      showPopUP: false
    })
  }
  // getQuote = e => {
  //   console.log('getquote')
  //   let country = this.props.country
  //   const target = e.target
  //   const name = target.name
  //   let value = target.value
  //   this.setState({
  //     [name]: value
  //   })
  //   let symbol = [`${value}.${country}`]
  //   updtProdThrottle(() => {
  //     this.props.getQuote(symbol)
  //   })
  // }
  targetSearchSymbol = e => {
    let country = this.props.country
    let target = e.currentTarget
    let symbol = target.dataset.symbol
    this.setState({
      symbol
    })
    this.props.getQuote([`${symbol}.${country}`])
  }
  componentDidMount() {
    let prodList = this.prodList
    let symbolSearch = this.inputSymbol
    let suggestList = this.suggestList
    let suggestWrap = this.orderStockFilter
    let keyword = Observable.fromEvent(symbolSearch, 'input')
    let focus = Observable.fromEvent(symbolSearch, 'focus')
    let unfocus = Observable.fromEvent(symbolSearch, 'focusout')
    let wheelSuggest = Observable.fromEvent(suggestWrap, 'wheel')
    let scrollSuggest = Observable.fromEvent(suggestWrap, 'scroll')
    let scrollMerge = Observable.merge(wheelSuggest, scrollSuggest)
    let targetValue = ''
    focus.map(e => e).subscribe(res => {
      // console.log(res)
      this.setState({
        showSymbolFilter: true
      })
    })
    unfocus.map(e => e).subscribe(res => {
      // console.log(res)
      this.setState({
        showSymbolFilter: false
      })
      let { symbol } = this.state
      let { country } = this.props
      this.props.getQuote([`${symbol}.${country}`])
    })
    keyword
      .debounceTime(100)
      .switchMap(e => {
        targetValue = e.target.value
        return Observable.create(observer => {
          let list = keyWordStockFilter(prodList, targetValue)
          observer.next(list)
        })
      }, (e, res) => res)
      .subscribe(list => {
        let endIndex = this.endIndexSymbolFilter
        this.symbolFilterList = list
        this.endIndexSymbolFilter = 100
        this.filterSearch.updateData(list, endIndex)
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
            this.endIndexSymbolFilter
          )
        }
      })
  }
  render() {
    let prodList = this.props.prodList || []
    let quote = this.props.quote
    let Symbol = quote.get('Symbol')
    let Name = quote.get('Name')
    let APrice = quote.get('APrice')
    let BPrice = quote.get('BPrice')
    let Price = quote.get('Price')
    let Open = quote.get('Open')
    let PrePrice = quote.get('PrePrice')
    let HighLimitPrice = quote.get('HighLimitPrice')
    let LowLimitPrice = quote.get('LowLimitPrice')
    let high = quote.get('high')
    let low = quote.get('low')

    let pStyle = priceStyle(Price, PrePrice)
    let bPriceStyle = priceStyle(BPrice, PrePrice)
    let aPriceStyle = priceStyle(APrice, PrePrice)
    let openStyle = priceStyle(Open, PrePrice)
    let highStyle = priceStyle(high, PrePrice)
    let lowStyle = priceStyle(low, PrePrice)
    let limitHighStyle = priceStyle(99999, PrePrice)
    let limitLowStyle = priceStyle(0, PrePrice)
    let { account, symbol, volume, price, orderType, date, action } = this.state
    // let { targetAccount: account } = this.props
    console.log(account)
    return (
      <div className={cx('usorder-wrap')}>
        <div className={cx('action-wrap')}>
          <div className={cx('input-wrap')}>
            <div className={cx('item-wrap', 't1')}>
              <span>帳號1：</span>
              <input
                type="text"
                name="account"
                value={account}
                onChange={this.handleInputChange}
                ref="account"
              />
            </div>
            <div className={cx('item-wrap', 't1-1')}>
              <span className={cx('name')}>黃碧香</span>
            </div>
            <div className={cx('item-wrap', 't2')}>
              <span>股票：</span>
              <div className={cx('stock-input-wrap')}>
                <input
                  type="text"
                  name="symbol"
                  value={this.state.symbol}
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
                onChange={this.handleInputChange}
                ref="volume"
              />
            </div>

            <div className={cx('item-wrap', 't4')}>
              <span>價格：</span>
              <input
                type="text"
                name="price"
                value={this.state.price}
                onChange={this.handleInputChange}
                ref="price"
              />
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
              買
            </span>
            <span data-action="2" className={cx('btn', 'sell')}>
              賣
            </span>
          </div>
        </div>
        <div className={cx('info-wrap')}>
          <div className={cx('item-wrap', 'b1')}>
            <span>買進</span>
            <span style={bPriceStyle}>{BPrice}</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>賣出</span>
            <span style={aPriceStyle}>{APrice}</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>成交</span>
            <span style={pStyle}>{Price}</span>
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
            <span style={highStyle}>{high}</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>今低價</span>
            <span style={lowStyle}>{low}</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>股代</span>
            <span>{Symbol}</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>手單位</span>
            <span>XXX</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>交易幣別</span>
            <span>XXX</span>
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
          zIndex="11"
          data={this.state.orderParams}
        >
          <div className={cx('order-popup')}>
            <div className={cx('title')}>
              <span>確認委託（港交所）</span>
            </div>
            <div
              className={
                action === '1' ? cx('main', 'buy') : cx('main', 'sell')
              }
            >
              <div className={cx('left')}>
                <span className={cx('s1', 'acc')}>{account}</span>
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
                  <span className={cx('s1')}>{symbol}</span>
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
                <span onClick={this.order} className={cx('btn')}>
                  委託單送出
                </span>
                <span onClick={this.closePopUp} className={cx('btn')}>
                  取消
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
