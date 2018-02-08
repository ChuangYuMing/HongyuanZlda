import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './information.css'
import classNames from 'classnames/bind'
import { StickyTable, Row, Cell } from 'react-sticky-table'

let cx = classNames.bind(styles)
class Information extends Component {
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
      '刪 改 價',
      '帳號',
      '委託書號',
      '交易時間',
      '股票代碼',
      '買/賣',
      '委/成價',
      '委託數量',
      '成交數量',
      '取消數量',
      '成交均價',
      '未成交數量',
      '狀態'
    ]
    for (let i = 0; i < headers.length; i++) {
      cells.push(
        <Cell className={cx('header-cell')} key={i}>
          {i == 0 ? (
            <div className={cx('header1')}>
              <span className={cx('bt1')}>刪</span>
              <span className={cx('bt2')}>改</span>
              <span className={cx('bt3')}>價</span>
            </div>
          ) : (
            headers[i]
          )}
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
          <Cell key="0">
            <span className={cx('btn')}>刪</span>
            <span className={cx('btn')}>量</span>
            <span className={cx('btn')}>價</span>
          </Cell>
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
          <Cell key="12">cell</Cell>
        </Row>
      )
    })
    for (const row of mainDatas) {
      rows.push(row)
    }
    return (
      <div className={cx('information-wrap')}>
        <div className={cx('sticky-table')}>
          <StickyTable stickyColumnCount={0}>{rows}</StickyTable>
        </div>
      </div>
    )
  }
}

Information.propTypes = {}

export default Information
