import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './member.css'
import classNames from 'classnames/bind'
import { StickyTable, Row, Cell } from 'react-sticky-table'

let cx = classNames.bind(styles)
class Member extends PureComponent {
  constructor() {
    super()
  }
  changeTargetAccount = e => {
    let { userToken } = this.props
    let target = e.currentTarget
    let account = target.dataset.account
    let branch = target.dataset.branch
    let prams = {
      Account: account,
      Branch: branch,
      TokenId: userToken
    }
    this.props.changeTargetAccount({ account, branch })
    this.props.getInventory(prams)
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
            <span className={cx('btn', 'info-btn')}>購買力查詢</span>
          </Cell>
        </Row>
      )
    })
    for (const row of mainDatas) {
      rows.push(row)
    }
    return (
      <div className={cx('member-wrap')}>
        <div className={cx('sticky-table')}>
          <StickyTable stickyColumnCount={0}>{rows}</StickyTable>
        </div>
      </div>
    )
  }
}

Member.propTypes = {}

export default Member
