import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './member.css'
import classNames from 'classnames/bind'
import { StickyTable, Row, Cell } from 'react-sticky-table'
import PopUp from 'modules/shared/components/PopUp/PopUp.js'
import { Decimal } from 'decimal.js'

let cx = classNames.bind(styles)
class Member extends PureComponent {
  constructor() {
    super()
    this.state = {
      showPurchasing: false,
      targetAccount: ''
    }
  }
  changeTargetAccount = e => {
    let { userToken } = this.props
    let target = e.currentTarget
    let account = target.dataset.account
    let branch = target.dataset.branch
    let prams = {
      Account: account,
      Branch: branch,
      TokenID: userToken
    }
    this.props.changeTargetAccount({ account, branch })
    // this.props.getInventory(prams)
  }
  closePurchasing = () => {
    this.setState({
      showPurchasing: false
    })
  }
  getPurchasing = e => {
    let target = e.target
    let { account, branch } = target.dataset
    let params = {
      Account: account,
      Branch: branch
    }
    this.setState({
      showPurchasing: true,
      targetAccount: account,
      targetBranch: branch
    })
    this.props.getPurchasing(params)
  }
  refreshPurchasing = () => {
    let { targetAccount, targetBranch } = this.state
    let params = {
      Account: targetAccount,
      Branch: targetBranch
    }
    this.props.getPurchasing(params)
  }
  componentDidUpdate() {
    let wrap = document.getElementById('member-table')
    let target = wrap.querySelector(`.${[styles['focus']]}`)
    if (target) {
      let parent = target.offsetParent
      let table = wrap.querySelector('#sticky-table-y-wrapper')
      let offset = target.offsetTop - table.clientHeight / 2
      if (offset > 0) {
        table.scrollTop = offset
      } else {
        table.scrollTop = 0
      }
    }
  }
  render() {
    let lists = this.props.customerInfo
    var rows = []
    var cells = []
    let headers = ['帳號', '名稱', '   ']
    let { targetAccount } = this.props
    for (let i = 0; i < headers.length; i++) {
      cells.push(
        <Cell
          className={
            i == 2 ? cx('header-cell', 'cell-center') : cx('header-cell')
          }
          key={i}
        >
          {headers[i]}
        </Cell>
      )
    }
    rows.push(<Row key={0}>{cells}</Row>)
    let mainDatas = lists.map((item, index) => {
      let cells = []
      let Account = item.get('Account')
      let Branch = item.get('Branch')
      let CName = item.get('CName')
      let cc = cx({
        focus: targetAccount.get('account') === Account
      })
      return (
        <Row
          className={cx('cell-right')}
          key={index + 1}
          data-id={item.assetCode}
          data-account={Account}
          data-branch={Branch}
          onDoubleClick={this.changeTargetAccount}
        >
          <Cell className={cc} key="0">
            {Account}
          </Cell>
          <Cell className={cc} key="1">
            {CName}
          </Cell>
          <Cell key="2">
            <span
              data-account={Account}
              data-branch={Branch}
              onClick={this.getPurchasing}
              className={cx('btn', 'info-btn')}
            >
              購買力查詢
            </span>
          </Cell>
        </Row>
      )
    })
    for (const row of mainDatas) {
      rows.push(row)
    }
    let { purchasing } = this.props
    let currency = {}
    if (purchasing.get('NoMDEntries')) {
      purchasing.get('NoMDEntries').forEach(item => {
        currency[item.get('Currency')] = {
          BankMoney: parseFloat(item.get('BankMoney')),
          BankMeta: parseFloat(item.get('BankMeta')),
          ReFund: parseFloat(item.get('ReFund')),
          Currency: item.get('Currency')
        }
      })
    }
    if (purchasing.get('Items')) {
      purchasing.get('Items').forEach(item => {
        let cur = item.get('Currency')
        let obj = {
          TodayBuy: parseFloat(item.get('TodayBuy')),
          TodaySell: parseFloat(item.get('TodaySell'))
            ? parseFloat(item.get('TodaySell'))
            : 0,
          TransitMoney: parseFloat(item.get('TransitMoney')),
          Market: item.get('Market')
        }
        currency[cur] = Object.assign({}, currency[cur], obj)
      })
    }
    for (const key in currency) {
      const e = currency[key]
      let total = Decimal(0)
      try {
        total = total
          .plus(e.TransitMoney)
          .plus(e.TodayBuy)
          .plus(e.TodaySell)
          .plus(e.BankMoney)
          .plus(e.BankMeta)
          .minus(e.ReFund)
      } catch (error) {
        //no order data
        total = total
          .plus(e.BankMoney)
          .plus(e.BankMeta)
          .minus(e.ReFund)
      }

      currency[key].total = total.toPrecision()
    }
    let keys = Object.keys(currency)
    let title = [
      { name: '幣別', tag: 'Currency' },
      { name: '當日委賣', tag: 'TodaySell' },
      { name: '當日委買', tag: 'TodayBuy' },
      { name: '在途資金', tag: 'TransitMoney' },
      { name: '待出帳金額', tag: 'BankMeta' },
      { name: '退款', tag: 'ReFund' },
      { name: '可出金', tag: 'BankMoney' },
      { name: '總可用', tag: 'total' }
    ]
    let purchasingPopData = title.map((item, index) => {
      let subData = []
      for (let index = 0; index < keys.length; index++) {
        const cur = keys[index]
        let d = (
          <td key={index}>
            {currency[cur][item.tag] ? currency[cur][item.tag] : 0}
          </td>
        )
        subData.push(d)
      }
      return (
        <tr key={index}>
          <td>{item.name}</td>
          {subData}
        </tr>
      )
    })
    console.log(purchasingPopData)
    // Object.keys(currency).forEach(item => {
    //   purchasingPopData = <tbody>{purchasingPopData}</tbody>
    // })
    console.log('currency', currency)
    return (
      <div className={cx('member-wrap')}>
        <div id="member-table" className={cx('sticky-table')}>
          <StickyTable stickyColumnCount={0}>{rows}</StickyTable>
        </div>
        <PopUp
          show={this.state.showPurchasing}
          width="600px"
          height="300px"
          zIndex="11"
          data={this.state.orderParams}
        >
          <div className={cx('purchasing-popup')}>
            <div className={cx('top')}>
              <span>帳戶：(複委託) {this.state.targetAccount}</span>
              <span
                onClick={this.refreshPurchasing}
                className={cx('refersh', 'btn')}
              >
                更新
              </span>
              <a onClick={this.closePurchasing} className={cx('boxclose')} />
            </div>
            <div className={cx('main')}>
              <table>
                <tbody>{purchasingPopData}</tbody>
              </table>
            </div>
          </div>
        </PopUp>
      </div>
    )
  }
}

Member.propTypes = {}

export default Member
