import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './information.css'
import classNames from 'classnames/bind'
import { StickyTable, Row, Cell } from 'react-sticky-table'
import { orderStatusMaping } from 'tools/format-res-data.js'
import { getDateFromFormat } from 'tools/date.js'
import { Map } from 'immutable'

let cx = classNames.bind(styles)
class Information extends PureComponent {
  constructor() {
    super()
    this.state = {
      sortByTime: false
    }
  }

  render() {
    let { list } = this.props
    // console.log(this.props)
    let hiddenData = Map({
      Account: '255428',
      TransactTime: '20180208-09:32:40.989',
      OrderID: 'X0076',
      Symbol: 'MSTF',
      Side: '買',
      Price: '9999.9999',
      OrderQty: 9999,
      CumQty: 9999,
      CxlQty: 9999,
      LastPx: '9999.9999',
      LeavesQty: 9999,
      OrdStatus: 'E'
    })

    if (this.state.sortByTime) {
      list = list.sort((a, b) => {
        let atime = a.get('TransactTime').split('.')
        let btime = b.get('TransactTime').split('.')
        let adatetime = getDateFromFormat(atime[0], 'yMMdd-HH:mm:ss')
        let bdatetime = getDateFromFormat(btime[0], 'yMMdd-HH:mm:ss')
        adatetime = adatetime + parseInt(atime[1])
        bdatetime = bdatetime + parseInt(btime[1])
        // console.log(adatetime, bdatetime)
        return adatetime - bdatetime
      })
    }
    list = list.push(hiddenData)
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
    let mainDatas = list.map((item, index) => {
      let cells = []
      item.get('Side') == 1 ? '買' : '賣'
      let cxx = cx({
        'cell-right': true,
        'hidden-row': index + 1 === list.size ? true : false
      })
      return (
        <Row
          className={cxx}
          key={index + 1}
          data-id={item.get('assetCode')}
          onClick={this.order}
        >
          <Cell key="0">
            <span className={cx('btn')}>刪</span>
            <span className={cx('btn')}>量</span>
            <span className={cx('btn')}>價</span>
          </Cell>
          <Cell key="1">{item.get('Account')}</Cell>
          <Cell key="2">{item.get('OrderID')}</Cell>
          <Cell key="3">{item.get('TransactTime')}</Cell>
          <Cell key="4">{item.get('Symbol')}</Cell>
          <Cell key="5">{item.get('Side')}</Cell>
          <Cell key="6">{item.get('Price')}</Cell>
          <Cell key="7">{item.get('OrderQty')}</Cell>
          <Cell key="8">{item.get('CumQty')}</Cell>
          <Cell key="9">{item.get('CxlQty')}</Cell>
          <Cell key="10">{item.get('LastPx')}</Cell>
          <Cell key="11">{item.get('LeavesQty')}</Cell>
          <Cell key="12">{orderStatusMaping(item.get('OrdStatus'))}</Cell>
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
