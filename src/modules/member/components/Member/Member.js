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
  render() {
    let lists = this.props.customerInfo
    let { Account, CName } = lists
    var rows = []
    var cells = []
    let headers = ['帳號', '名稱', '   ']
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
      return (
        <Row
          className={cx('cell-right')}
          key={index + 1}
          data-id={item.assetCode}
          onClick={this.order}
        >
          <Cell key="0">{`${Account}${index}`}</Cell>
          <Cell key="1">{`${CName}${index}`}</Cell>
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
