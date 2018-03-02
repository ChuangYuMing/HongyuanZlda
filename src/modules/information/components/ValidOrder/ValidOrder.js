import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from '../Information/information.css'
import validOrderStyles from './valid-order.css'
import classNames from 'classnames/bind'
import { StickyTable, Row, Cell } from 'react-sticky-table'
import { orderStatusMaping } from 'tools/format-res-data.js'
import { getDateFromFormat } from 'tools/date.js'
import PopUp from 'modules/shared/components/PopUp/PopUp.js'
import InformationRow from '../InformationRow/InformationRow.js'

let cx = classNames.bind(styles)
let validOrderCx = classNames.bind(validOrderStyles)
class Information extends PureComponent {
  constructor() {
    super()
    this.state = {
      sortByTime: false,
      showCancelPopUp: false,
      showChangeVolPopUp: false,
      showChangePricePopUp: false,
      targetRow: Map({}),
      changeDiffVol: '',
      changeDiffVol2: '',
      changeDiffPrice: ''
    }
  }
  showCancelPopUp = () => {
    console.log('-----')
    this.setState({
      showCancelPopUp: true,
      showChangeVolPopUp: false,
      showChangePricePopUp: false
    })
  }
  showChangeVolPopUp = () => {
    console.log('-----')
    this.setState({
      showCancelPopUp: false,
      showChangeVolPopUp: true,
      showChangePricePopUp: false
    })
  }
  showChangePricePopUp = () => {
    console.log('-----')
    this.setState({
      showChangePricePopUp: true,
      showCancelPopUp: false,
      showChangeVolPopUp: false
    })
  }
  closePopUp = () => {
    this.setState({
      showCancelPopUp: false,
      showChangeVolPopUp: false,
      showChangePricePopUp: false
    })
  }
  targetRow = e => {
    let list = this.props.data
    const target = e.currentTarget
    let orderid = target.dataset.orderid
    const index = list.findIndex(i => i.get('OrderID') === orderid)
    if (index !== -1) {
      let targetRow = list.get(index)
      this.setState({
        targetRow,
        changeDiffVol2: targetRow.get('LeavesQty'),
        changeDiffPrice: targetRow.get('Price')
      })
    }
  }
  handleInputChange = e => {
    // console.log(this)
    const target = e.target
    let value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    if (parseInt(value)) {
      this.setState({
        [name]: parseInt(value)
      })
    } else {
      this.setState({
        [name]: value
      })
    }
  }
  cancelOrder = () => {
    let targetRow = this.state.targetRow
    this.props.cancelOrder(targetRow)
    this.closePopUp()
  }
  changeOrderVol = () => {
    let targetRow = this.state.targetRow
    let value = this.state.changeDiffVol
    this.props.changeOrderVol({ targetRow, value })
    this.closePopUp()
  }
  changeOrderPrice = () => {
    let targetRow = this.state.targetRow
    let value = {
      vol: this.state.changeDiffVol2,
      price: this.state.changeDiffPrice
    }

    this.props.changeOrderPrice({ targetRow, value })
    this.closePopUp()
  }
  render() {
    let list = this.props.data
    let targetRow = this.state.targetRow
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
      let iRow = () => {
        let TransactTime = item.get('TransactTime')
        TransactTime = TransactTime
          ? TransactTime.split('-')[1].split('.')[0]
          : ''
        return (
          <Row
            className={cxx}
            data-orderid={item.get('OrderID')}
            onClick={this.targetRow}
          >
            <Cell key="0">
              <span onClick={this.showCancelPopUp} className={cx('btn')}>
                刪
              </span>
              <span onClick={this.showChangeVolPopUp} className={cx('btn')}>
                量
              </span>
              <span onClick={this.showChangePricePopUp} className={cx('btn')}>
                價
              </span>
            </Cell>
            <Cell key="1">{item.get('Account')}</Cell>
            <Cell key="2">{item.get('OrderID')}</Cell>
            <Cell key="3">{TransactTime}</Cell>
            <Cell key="4">{item.get('Symbol')}</Cell>
            <Cell key="5">{item.get('Side')}</Cell>
            <Cell key="6">{item.get('Price')}</Cell>
            <Cell key="7">{item.get('OrderQty') * 1000}</Cell>
            <Cell key="8">{item.get('CumQty') * 1000}</Cell>
            <Cell key="9">{item.get('CxlQty') * 1000}</Cell>
            <Cell key="10">{item.get('LastPx')}</Cell>
            <Cell key="11">{item.get('LeavesQty') * 1000}</Cell>
            <Cell key="12">{orderStatusMaping(item.get('OrdStatus'))}</Cell>
          </Row>
        )
      }

      let WrapRow = InformationRow(iRow)

      return <WrapRow key={index + 1} data={item} />
    })
    for (const row of mainDatas) {
      rows.push(row)
    }
    return (
      <div className={cx('sticky-table')}>
        <StickyTable stickyColumnCount={0}>{rows}</StickyTable>
        <PopUp show={this.state.showCancelPopUp} width="300" height="350">
          <div className={validOrderCx('popup')}>
            <div className={validOrderCx('title')}>
              <span>刪單</span>
            </div>
            <div className={validOrderCx('main')}>
              <div className={validOrderCx('info-wrap')}>
                <span className={validOrderCx('bold')}>
                  {targetRow.get('Account')}
                </span>
                <span className={validOrderCx('bold')}>
                  {targetRow.get('Symbol')}
                </span>
                <span
                  className={
                    targetRow.get('Side') == '1'
                      ? validOrderCx('orderType', 'buy')
                      : validOrderCx('orderType', 'sell')
                  }
                >
                  {targetRow.get('Side') == '1' ? '買' : '賣'}
                </span>
                <span className={validOrderCx('price')}>
                  {targetRow.get('Price')}
                </span>
              </div>

              <div className={validOrderCx('other-wrap')}>
                <div className={validOrderCx('item')}>
                  <div className={validOrderCx('name')}>
                    <span>原始委託量</span>
                  </div>
                  <div className={validOrderCx('value')}>
                    <span>{`${targetRow.get('OrderQty')} 張`}</span>
                  </div>
                </div>
                <div className={validOrderCx('item')}>
                  <div className={validOrderCx('name')}>
                    <span>已成交數量</span>
                  </div>
                  <div className={validOrderCx('value')}>
                    <span>{`${targetRow.get('CumQty')} 張`}</span>
                  </div>
                </div>
                <div className={validOrderCx('item')}>
                  <div className={validOrderCx('name')}>
                    <span>未成交數量</span>
                  </div>
                  <div className={validOrderCx('value')}>
                    <span>{`${targetRow.get('LeavesQty')} 張`}</span>
                  </div>
                </div>
              </div>
              <div className={validOrderCx('btn-wrap')}>
                <span onClick={this.cancelOrder}>委託單送出</span>
                <span onClick={this.closePopUp}>取消</span>
              </div>
            </div>
          </div>
        </PopUp>
        <PopUp show={this.state.showChangeVolPopUp} width="300" height="350">
          <div className={validOrderCx('popup', 'changeVolPop')}>
            <div className={validOrderCx('title')}>
              <span>改量</span>
            </div>
            <div className={validOrderCx('main')}>
              <div className={validOrderCx('info-wrap')}>
                <span className={validOrderCx('bold')}>
                  {targetRow.get('Account')}
                </span>
                <span className={validOrderCx('bold')}>
                  {targetRow.get('Symbol')}
                </span>
                <span
                  className={
                    targetRow.get('Side') == '1'
                      ? validOrderCx('orderType', 'buy')
                      : validOrderCx('orderType', 'sell')
                  }
                >
                  {targetRow.get('Side') == '1' ? '買' : '賣'}
                </span>
                <span className={validOrderCx('price')}>
                  {targetRow.get('Price')}
                </span>
              </div>

              <div className={validOrderCx('other-wrap')}>
                <div className={validOrderCx('item')}>
                  <div className={validOrderCx('name')}>
                    <span>原始委託量</span>
                  </div>
                  <div className={validOrderCx('value')}>
                    <span>{`${targetRow.get('OrderQty')} 張`}</span>
                  </div>
                </div>
                <div className={validOrderCx('item')}>
                  <div className={validOrderCx('name')}>
                    <span>已成交數量</span>
                  </div>
                  <div className={validOrderCx('value')}>
                    <span>{`${targetRow.get('CumQty')} 張`}</span>
                  </div>
                </div>
                <div className={validOrderCx('item')}>
                  <div className={validOrderCx('name')}>
                    <span>未成交數量</span>
                  </div>
                  <div className={validOrderCx('value')}>
                    <span>{`${targetRow.get('LeavesQty')} 張`}</span>
                  </div>
                </div>
                <div className={validOrderCx('item')}>
                  <div className={validOrderCx('name')}>
                    <span>數量</span>
                  </div>
                  <div className={validOrderCx('value')}>
                    <input
                      className={validOrderCx('volume-input')}
                      onChange={this.handleInputChange}
                      value={this.state.changeDiffVol}
                      name="changeDiffVol"
                      type="number"
                    />張
                  </div>
                </div>
              </div>
              <div className={validOrderCx('btn-wrap')}>
                <span onClick={this.changeOrderVol}>委託單送出</span>
                <span onClick={this.closePopUp}>取消</span>
              </div>
            </div>
          </div>
        </PopUp>
        <PopUp show={this.state.showChangePricePopUp} width="300" height="400">
          <div className={validOrderCx('popup')}>
            <div className={validOrderCx('title')}>
              <span>改價</span>
            </div>
            <div className={validOrderCx('main')}>
              <div className={validOrderCx('info-wrap')}>
                <span className={validOrderCx('bold')}>
                  {targetRow.get('Account')}
                </span>
                <span className={validOrderCx('bold')}>
                  {targetRow.get('Symbol')}
                </span>
                <span
                  className={
                    targetRow.get('Side') == '1'
                      ? validOrderCx('orderType', 'buy')
                      : validOrderCx('orderType', 'sell')
                  }
                >
                  {targetRow.get('Side') == '1' ? '買' : '賣'}
                </span>
                <span className={validOrderCx('price')}>
                  {targetRow.get('Price')}
                </span>
              </div>

              <div className={validOrderCx('other-wrap')}>
                <div className={validOrderCx('item')}>
                  <div className={validOrderCx('name')}>
                    <span>未成交數量</span>
                  </div>
                  <div className={validOrderCx('value')}>
                    <span>{`${targetRow.get('LeavesQty')} 張`}</span>
                  </div>
                </div>
                <div className={validOrderCx('item')}>
                  <div className={validOrderCx('name')}>
                    <span>原始委託價</span>
                  </div>
                  <div className={validOrderCx('value')}>
                    <span>{`${targetRow.get('Price')} 張`}</span>
                  </div>
                </div>
                <div className={validOrderCx('item')}>
                  <div className={validOrderCx('name')}>
                    <span>改價數量</span>
                  </div>
                  <div className={validOrderCx('value')}>
                    <input
                      className={validOrderCx('volume-input')}
                      onChange={this.handleInputChange}
                      value={this.state.changeDiffVol2}
                      name="changeDiffVol2"
                      type="number"
                    />張
                  </div>
                </div>
                <div className={validOrderCx('item')}>
                  <div className={validOrderCx('name')}>
                    <span>新委託價</span>
                  </div>
                  <div className={validOrderCx('value')}>
                    <input
                      className={validOrderCx('price-input')}
                      onChange={this.handleInputChange}
                      value={this.state.changeDiffPrice}
                      name="changeDiffPrice"
                      type="number"
                    />張
                  </div>
                </div>
                <div className={validOrderCx('item')}>
                  <div className={validOrderCx('name')}>
                    <span>來源</span>
                  </div>
                  <div className={validOrderCx('value')}>
                    <span>電話單</span>
                  </div>
                </div>
              </div>
              <div className={validOrderCx('btn-wrap')}>
                <span onClick={this.changeOrderPrice}>委託單送出</span>
                <span onClick={this.closePopUp}>取消</span>
              </div>
            </div>
          </div>
        </PopUp>
      </div>
    )
  }
}

Information.propTypes = {}

export default Information
