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
      account: 'acc01',
      symbol: '',
      volume: 1,
      price: '',
      orderType: '0',
      date: 20180131,
      items: [],
      showPopUP: false,
      action: '',
      orderParams: {}
    }
  }
  handleInputChange = e => {
    // console.log(this)
    const target = e.target
    let value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    if (parseInt(value)) {
      this.setState({
        [name]: parseInt(value)
      })
    } else {
      this.setState({
        [name]: value
      })
    }
  }
  // 11000=22&48=FB&553=user01&1=acc01&30056=branch01
  handleOrderAction = e => {
    let apiUrl = appGlobal.apiurl
    let action = e.target.dataset.action
    let { account, symbol, volume, price, orderType, date } = this.state
    let params = {
      '11000': 22,
      '48': symbol,
      '1': account,
      '54': action,
      '40': orderType,
      '44': price,
      '38': volume,
      '30056': 'branch01',
      '553': 'user01'
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
  getQuote = e => {
    const target = e.target
    const name = target.name
    let value = target.value
    this.setState({
      [name]: value
    })
    let symbol = [`${value}.US`]
    updtProdThrottle(() => {
      this.props.getQuote(symbol)
    })
  }
  render() {
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
    return (
      <div className={cx('usorder-wrap')}>
        <div className={cx('action-wrap')}>
          <div className={cx('input-wrap')}>
            <div className={cx('item-wrap', 't1')}>
              <span>帳號1：</span>
              <input
                type="text"
                name="account"
                value={this.state.account}
                onChange={this.handleInputChange}
                ref="account"
              />
            </div>
            <div className={cx('item-wrap', 't1-1')}>
              <span className={cx('name')}>黃碧香</span>
            </div>
            <div className={cx('item-wrap', 't2')}>
              <span>股票：</span>
              <input
                type="text"
                name="symbol"
                value={this.state.symbol}
                onChange={this.getQuote}
                ref="symbol"
              />
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
                <option key="1" value="0">
                  現價
                </option>
                <option key="2" value="E">
                  增強限價盤
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
          width="600"
          height="300"
          order={this.props.order}
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
