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
    let lists = [1, 2, 3, 4]
    lists = [...lists, ...lists]
    lists = [...lists, ...lists]
    var rows = []
    var cells = []
    let headers = ['帳號', '名稱', '刪委託', '現沖', '融沖', '   ']
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
          <Cell key="0">cell</Cell>
          <Cell key="1">cell</Cell>
          <Cell className={cx('cell-center')} key="2">
            <span className={cx('btn', 'delete-btn')}>刪委託</span>
          </Cell>
          <Cell key="3">cell</Cell>
          <Cell key="4">cell</Cell>
          <Cell key="5">
            <span className={cx('btn', 'info-btn')}>維持率查詢</span>
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
