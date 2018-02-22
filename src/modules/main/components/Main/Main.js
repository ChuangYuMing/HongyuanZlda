import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './main.css'
import classNames from 'classnames/bind'
import Order from 'modules/order/components/Order'
import Information from 'modules/information/components/Information'
import Member from 'modules/member/components/Member'
import Inventory from 'modules/inventory/components/Inventory'
import Menu from 'modules/menu/components/Menu'
import { Redirect } from 'react-router-dom'

let cx = classNames.bind(styles)
class Main extends Component {
  constructor() {
    super()
  }
  render() {
    if (!this.props.isLogin) {
      return (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: this.props.location }
          }}
        />
      )
    }
    return (
      <div className={cx('main-wrap')}>
        <div className={cx('menu')}>
          <Menu />
        </div>
        <div className={cx('information')}>
          <Information />
        </div>
        <div className={cx('middle-wrap')}>
          <div className={cx('members')}>
            <Member />
          </div>
          <div className={cx('inventory')}>
            <Inventory />
          </div>
        </div>
        <div className={cx('order')}>
          <Order />
        </div>
      </div>
    )
  }
}

Main.propTypes = {}

export default Main
