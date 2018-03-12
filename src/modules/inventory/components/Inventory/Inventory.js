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
    let headers = ['帳號', '股名', '種類', '前日股數', '當日買進']
    for (let i = 0; i < headers.length; i++) {
      cells.push(
        <Cell className={cx('header-cell')} key={i}>
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
