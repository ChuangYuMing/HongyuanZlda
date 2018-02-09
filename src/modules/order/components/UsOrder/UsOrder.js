import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import styles from './us-order.css'
import styles from '../Order/order.css'
import classNames from 'classnames/bind'
import appGlobal from 'modules/common/app-global.js'
import SocketHandler from '../../socket-handler'
import i1 from 'static/image/i1.png'
import i2 from 'static/image/i2.png'

let cx = classNames.bind(styles)

class UsOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      account: 255428,
      symbol: 'MSFT',
      volume: 1,
      price: '',
      orderType: '0',
      date: 20180131,
      items: []
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
  handleOrderAction = e => {
    let apiUrl = appGlobal.apiurl
    let action = e.target.dataset.action
    let { account, symbol, volume, price, orderType, date } = this.state
    let params = {
      Mode: 22,
      Symbol: symbol,
      Account: account,
      Side: action,
      OrdType: orderType,
      Price: price,
      OrderQty: volume
    }
    this.props.order(params)
  }
  render() {
    return (
      <div className={cx('usorder-wrap')}>
        <div className={cx('action-wrap')}>
          <div className={cx('input-wrap')}>
            <div className={cx('item-wrap', 't1')}>
              <span>帳號2：</span>
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
                onChange={this.handleInputChange}
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
            <span>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>賣出</span>
            <span>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>成交</span>
            <span>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>開盤價</span>
            <span>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>平盤價</span>
            <span>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>漲停價</span>
            <span>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>跌停價</span>
            <span>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>今高價</span>
            <span>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>今低價</span>
            <span>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span>股代</span>
            <span>XXX</span>
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
            <span>自動資料處理公司</span>
          </div>
        </div>
      </div>
    )
  }
}

UsOrder.propTypes = {}

export default UsOrder
