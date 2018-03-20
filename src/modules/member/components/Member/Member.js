import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './member.css'
import classNames from 'classnames/bind'
import { StickyTable, Row, Cell } from 'react-sticky-table'
import PopUp from 'modules/shared/components/PopUp/PopUp.js'

let cx = classNames.bind(styles)
class Member extends PureComponent {
  constructor() {
    super()
    this.state = {
      showPurchasing: false
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
    this.props.getInventory(prams)
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
      showPurchasing: true
    })
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
    return (
      <div className={cx('member-wrap')}>
        <div id="member-table" className={cx('sticky-table')}>
          <StickyTable stickyColumnCount={0}>{rows}</StickyTable>
        </div>
        <PopUp
          show={this.state.showPurchasing}
          width="600px"
          height="300px"
          zIndex="10"
          data={this.state.orderParams}
        >
          <div className={cx('purchasing-popup')}>
            <div className={cx('top')}>
              <span>帳戶：(複委託) 123</span>
              <span className={cx('refersh', 'btn')}>更新</span>
              <a onClick={this.closePurchasing} className={cx('boxclose')} />
            </div>
            <div className={cx('main')}>
              <table>
                <tbody>
                  <tr>
                    <th>幣別</th>
                    <th>HKD</th>
                    <th>USA</th>
                  </tr>
                  <tr>
                    <td>當日委賣</td>
                    <td>123</td>
                    <td>123</td>
                  </tr>
                  <tr>
                    <td>當日委買</td>
                    <td>123</td>
                    <td>123</td>
                  </tr>
                  <tr>
                    <td>在途資金</td>
                    <td>123</td>
                    <td>123</td>
                  </tr>
                  <tr>
                    <td>可出金</td>
                    <td>123</td>
                    <td>123</td>
                  </tr>
                  <tr>
                    <td>總可用</td>
                    <td>123</td>
                    <td>123</td>
                  </tr>
                </tbody>
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
