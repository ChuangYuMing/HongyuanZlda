import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './menu.css'
import classNames from 'classnames/bind'

let cx = classNames.bind(styles)
class Menu extends PureComponent {
  constructor(props) {
    super(props)
  }
  logout = () => {
    this.props.logout()
    // this.props.history.replace('/login')
  }
  changeTargetAccount = e => {
    let target = e.target
    let value = target.value
    console.log('value', value)
    this.props.changeTargetAccount(value)
  }
  showChangePwd = () => {
    this.props.showChangePwd()
  }
  render() {
    let { customerInfo, targetAccount } = this.props
    let accountList = customerInfo.map((item, index) => {
      return (
        <option key={index} value={item.get('Account')}>
          {item.get('Account')}
        </option>
      )
    })
    return (
      <div className={cx('menu-wrap')}>
        <div className={cx('item-wrap', 't1')}>
          <span className={cx('btn')}>勾選後刪單</span>
        </div>
        <div className={cx('item-wrap', 't2')}>
          <span>選取帳號</span>
          <select
            onChange={this.changeTargetAccount}
            name="acc"
            value={targetAccount.get('account')}
          >
            <option value="">全部帳號</option>
            {accountList}
          </select>
        </div>
        <div className={cx('item-wrap', 't3')}>
          <span>商品代號</span>
          <select name="acc">
            <option value="1">全部商品</option>
          </select>
        </div>
        <div className={cx('item-wrap', 't4')}>
          <span>市場交易所</span>
          <select name="acc">
            <option value="1">全部交易所</option>
          </select>
        </div>
        <div className={cx('item-wrap', 't5')}>
          <input type="checkbox" />
          <span className={cx('inline')}>顯示尚未完全成交委託</span>
          <br />
          <input type="checkbox" />
          <span className={cx('inline')}>顯示完全成交委託</span>
        </div>
        <div className={cx('item-wrap', 't6')}>
          <select name="acc">
            <option value="1">帳務視窗</option>
          </select>
          <span onClick={this.showChangePwd} className={cx('btn', 'inline-bk')}>
            修改密碼
          </span>
        </div>
        <span onClick={this.logout} className={cx('logout')}>
          登出
        </span>
      </div>
    )
  }
}

Menu.propTypes = {}

export default Menu
