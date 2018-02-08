import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './order.css'
import classNames from 'classnames/bind'

let cx = classNames.bind(styles)
class Order extends Component {
  constructor() {
    super()
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
    let action = e.target.dataset.action
    let { account, symbol, volume, price, orderType, date } = this.state
    var formData = new FormData()
    formData.append('Mode', 22)
    formData.append('Account', account)
    formData.append('Symbol', symbol)
    formData.append('Side', action)
    formData.append('OrdType', orderType)
    formData.append('Price', price)
    formData.append('OrderQty', volume)
    fetch(`http://192.168.12.166:8080/api/order`, {
      method: 'POST',
      body: formData
    })
      .then(res => {
        return res.text()
      })
      .then(res => {})
  }
  render() {
    return (
      <div className={cx('order-wrap')}>
        <div className={cx('action-wrap')}>
          <div className={cx('input-wrap')}>
            <div className={cx('item-wrap', 't1')}>
              <span>帳號：</span>
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
          <div className={cx('item-wrap', 'name')}>
            <span className={cx('name')}>股名</span>
            <span className={cx('name')}>自動資料處理公司</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span className={cx('name')}>買進</span>
            <span className={cx('name')}>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span className={cx('name')}>賣出</span>
            <span className={cx('name')}>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span className={cx('name')}>成交</span>
            <span className={cx('name')}>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span className={cx('name')}>開盤價</span>
            <span className={cx('name')}>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span className={cx('name')}>平盤價</span>
            <span className={cx('name')}>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span className={cx('name')}>漲停價</span>
            <span className={cx('name')}>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span className={cx('name')}>跌停價</span>
            <span className={cx('name')}>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span className={cx('name')}>今高價</span>
            <span className={cx('name')}>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span className={cx('name')}>今低價</span>
            <span className={cx('name')}>113.950</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span className={cx('name')}>股代</span>
            <span className={cx('name')}>XXX</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span className={cx('name')}>手單位</span>
            <span className={cx('name')}>XXX</span>
          </div>
          <div className={cx('item-wrap', 'b1')}>
            <span className={cx('name')}>交易幣別</span>
            <span className={cx('name')}>XXX</span>
          </div>
        </div>
      </div>
    )
  }
}

Order.propTypes = {}

export default Order
