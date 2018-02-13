import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './inventory.css'
import classNames from 'classnames/bind'
import { StickyTable, Row, Cell } from 'react-sticky-table'

let cx = classNames.bind(styles)
class Inventory extends PureComponent {
  constructor() {
    super()
  }
  render() {
    let lists = [1, 2, 3, 4]
    lists = [...lists, ...lists]
    lists = [...lists, ...lists]
    var rows = []
    var cells = []
    let headers = [
      '清',
      '帳號',
      '股名',
      '買/賣',
      '種類',
      '清倉股數',
      '當沖股數',
      '前日股數',
      '委買',
      '委賣',
      '當日買進',
      '當日賣出'
    ]
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
          <Cell key="2">cell</Cell>
          <Cell key="3">cell</Cell>
          <Cell key="4">cell</Cell>
          <Cell key="5">cell</Cell>
          <Cell key="6">cell</Cell>
          <Cell key="7">cell</Cell>
          <Cell key="8">cell</Cell>
          <Cell key="9">cell</Cell>
          <Cell key="10">cell</Cell>
          <Cell key="11">cell</Cell>
        </Row>
      )
    })
    for (const row of mainDatas) {
      rows.push(row)
    }
    return (
      <div className={cx('inventory-wrap')}>
        <div className={cx('top-wrap')}>
          <span>庫存：(複委託)xxxxx | </span>
          <div className={cx('search-wrap')}>
            <span>搜尋：</span>
            <input type="text" />
          </div>
        </div>
        <div className={cx('sticky-table')}>
          <StickyTable stickyColumnCount={0}>{rows}</StickyTable>
        </div>
      </div>
    )
  }
}

Inventory.propTypes = {}

export default Inventory
