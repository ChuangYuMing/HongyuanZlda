import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './menu.css'
import classNames from 'classnames/bind'
import { searchProperty } from 'tools/other.js'

let cx = classNames.bind(styles)
class Menu extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      market: 'all',
      symbol: 'all',
      partialDeal: false,
      allDeal: false
    }
  }
  logout = () => {
    this.props.logout()
    // this.props.history.replace('/login')
  }
  componentWillReceiveProps(nextProps, nextState) {
    let oldAccount = this.state.account
    let targetAcc = nextProps.targetAccount.get('account')

    if (oldAccount !== targetAcc) {
      this.setState({
        account: targetAcc
      })

      this.props.updateFilterSetting({
        account: targetAcc
      })
    }
  }
  handleInputChange = e => {
    const target = e.target
    let value = target.type === 'checkbox' ? target.checked : target.value
    console.log(value)
    const name = target.name
    this.setState({
      [name]: value
    })
    if (name === 'partialDeal' || name === 'allDeal') {
      this.props.updateFilterSetting({ [name]: value })
    }
  }
  changeTargetAccount = e => {
    let target = e.target
    let account = target.value
    let { Branch: branch } = searchProperty(
      this.props.member,
      ['Branch'],
      ['Account', account]
    )
    console.log('Branch', branch)
    if (account !== '') {
      this.props.changeTargetAccount({ account, branch })
    }
    this.setState({
      account
    })
    this.props.updateFilterSetting({ account })
  }
  changeTargetMarket = e => {
    let target = e.target
    let market = target.value
    let setting = market !== 'all' ? { market, symbol: 'all' } : { market }
    this.setState(setting)
    this.props.updateFilterSetting(setting)
  }
  showBashDeletePopup = () => {
    this.props.showBashDeletePopup(true)
  }
  changeTargetSymbol = e => {
    let target = e.target
    let symbol = target.value
    let setting = symbol !== 'all' ? { symbol, market: 'all' } : { symbol }
    this.setState(setting)
    this.props.updateFilterSetting(setting)
  }
  showChangePwd = () => {
    this.props.showChangePwd()
  }
  render() {
    let { customerInfo, targetAccount, todaySymbols, exchange } = this.props
    let marketOption = []
    exchange.entrySeq().forEach((e, index) => {
      let market = e[0]
      let marketName = e[1].getIn([0, 'MName'])
      marketOption.push(
        <option key={index} value={market}>
          {marketName}
        </option>
      )
    })
    let accountList = customerInfo.map((item, index) => {
      return (
        <option key={index} value={item.get('Account')}>
          {item.get('Account')}
        </option>
      )
    })
    todaySymbols = todaySymbols.sort((a, b) => a > b)
    let symbolList = todaySymbols.map((item, index) => {
      return (
        <option key={index} value={item}>
          {item}
        </option>
      )
    })
    console.log('this.state.account', this.state.account)
    return (
      <div className={cx('menu-wrap')}>
        <div className={cx('item-wrap', 't1')}>
          <span onClick={this.showBashDeletePopup} className={cx('btn')}>
            勾選後刪單
          </span>
        </div>
        <div className={cx('item-wrap', 't2')}>
          <span>選取帳號</span>
          <select
            onChange={this.changeTargetAccount}
            name="account"
            value={this.state.account}
          >
            <option value="">全部帳號</option>
            {accountList}
          </select>
        </div>
        <div className={cx('item-wrap', 't3')}>
          <span>商品代號</span>
          <select
            name="symbol"
            value={this.state.symbol}
            onChange={this.changeTargetSymbol}
          >
            <option value="all">全部商品</option>
            {symbolList}
          </select>
        </div>
        <div className={cx('item-wrap', 't4')}>
          <span>市場交易所</span>
          <select
            name="market"
            value={this.state.market}
            onChange={this.changeTargetMarket}
          >
            <option value="all">全部交易所</option>
            {marketOption}
          </select>
        </div>
        <div className={cx('item-wrap', 't5')}>
          <input
            type="checkbox"
            name="partialDeal"
            onChange={this.handleInputChange}
            checked={this.state.partialDeal}
          />
          <span className={cx('inline')}>顯示尚未完全成交委託</span>
          <br />
          <input
            type="checkbox"
            name="allDeal"
            onChange={this.handleInputChange}
            checked={this.state.allDeal}
          />
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
