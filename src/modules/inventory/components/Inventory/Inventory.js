import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './inventory.css'
import classNames from 'classnames/bind'
import { StickyTable, Row, Cell } from 'react-sticky-table'
import SocketHandler from '../../socket-handler'
import { keyWordOtherFilter } from 'tools/other.js'

let cx = classNames.bind(styles)
class Inventory extends PureComponent {
  constructor() {
    super()
    this.state = {
      symbolFilter: ''
    }
  }
  handleInputChange = e => {
    const target = e.target
    let value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }
  componentWillReceiveProps(nextProps) {
    let targetAccount = nextProps.targetAccount
    let old = this.props.targetAccount
    if (!old.equals(targetAccount)) {
      let params = {
        Account: targetAccount.get('account'),
        Branch: targetAccount.get('branch'),
        TokenID: this.props.token
      }
      this.props.getInventory(params)
    }
  }

  componentDidMount() {
    SocketHandler.on()
  }
  componentWillUnmount() {
    SocketHandler.off()
  }
  render() {
    let lists = this.props.inventory
    var rows = []
    var cells = []
    let headers = ['帳號', '股名', '種類', '前日股數', '當日買進', '當日賣出']
    let targetAcc = this.props.targetAccount.get('account')
    let { symbolFilter } = this.state
    lists = keyWordOtherFilter(lists, symbolFilter, 'Symbol')
    targetAcc = targetAcc ? targetAcc : ''
    for (let i = 0; i < headers.length; i++) {
      cells.push(
        <Cell className={cx('header-cell')} key={i}>
          {headers[i]}
        </Cell>
      )
    }
    rows.push(<Row key={0}>{cells}</Row>)
    lists = lists.filter(item => {
      let symbol = item.get('Symbol')
      return symbol.match(symbolFilter)
    })
    let mainDatas = lists.map((item, index) => {
      let cells = []
      let filterInfo = item.get('filterInfo')
      let firstHalf = filterInfo.get('firstHalf')
      let secondHalf = filterInfo.get('secondHalf')
      let key = filterInfo.get('key')
      return (
        <Row className={cx('cell-right')} key={index + 1}>
          <Cell key="0">{item.get('Account')}</Cell>
          <Cell key="1">
            <div className={cx('symbol-wrap')}>
              {firstHalf}
              <span className={cx('key')}>{key}</span>
              {secondHalf}
            </div>
          </Cell>
          <Cell key="2">{''}</Cell>
          <Cell key="3">
            {parseFloat(item.getIn(['100', 'MDEntrySize'])) || 0}
          </Cell>
          <Cell key="4">
            {parseFloat(item.getIn(['201', 'MDEntrySize'])) || 0}
          </Cell>
          <Cell key="5">
            {parseFloat(item.getIn(['301', 'MDEntrySize'])) || 0}
          </Cell>
        </Row>
      )
    })
    for (const row of mainDatas) {
      rows.push(row)
    }
    return (
      <div className={cx('inventory-wrap')}>
        <div className={cx('top-wrap')}>
          <span>{`庫存：(複委託)  ${targetAcc} | `}</span>
          <div className={cx('search-wrap')}>
            <span>搜尋：</span>
            <input
              value={this.state.filter}
              name="symbolFilter"
              type="text"
              onChange={this.handleInputChange}
            />
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
