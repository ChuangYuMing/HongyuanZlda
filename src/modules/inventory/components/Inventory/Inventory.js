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
    let lists = this.props.inventory
    var rows = []
    var cells = []
    let headers = ['帳號', '股名', '種類', '前日股數', '當日買進', '當日賣出']
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
        <Row className={cx('cell-right')} key={index + 1}>
          <Cell key="0">{item.get('Account')}</Cell>
          <Cell key="1">{item.get('Symbol')}</Cell>
          <Cell key="2">{''}</Cell>
          <Cell key="3">{parseFloat(item.getIn(['100', 'MDEntrySize']))}</Cell>
          <Cell key="4">{parseFloat(item.getIn(['201', 'MDEntrySize']))}</Cell>
          <Cell key="5">{parseFloat(item.getIn(['301', 'MDEntrySize']))}</Cell>
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
