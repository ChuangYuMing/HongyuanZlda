import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './menu.css'
import classNames from 'classnames/bind'

let cx = classNames.bind(styles)
class Menu extends Component {
  constructor() {
    super()
  }
  render() {
    return (
      <div className={cx('menu-wrap')}>
        <div className={cx('item-wrap', 't1')}>
          <span className={cx('btn')}>勾選後刪單</span>
        </div>
        <div className={cx('item-wrap', 't2')}>
          <span>選取帳號</span>
          <select name="acc">
            <option value="1">255428</option>
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
          <span className={cx('btn', 'inline-bk')}>另存條件</span>
        </div>
      </div>
    )
  }
}

Menu.propTypes = {}

export default Menu