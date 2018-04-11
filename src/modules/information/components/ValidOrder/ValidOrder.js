import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from '../Information/information.css'
import validOrderStyles from './valid-order.css'
import classNames from 'classnames/bind'
import { StickyTable, Row, Cell } from 'react-sticky-table'
import { orderStatusMaping } from 'tools/format-res-data.js'
import { getDateFromFormat, formatDate } from 'tools/date.js'
import { changeToLocalTime } from 'tools/other.js'
import PopUp from 'modules/shared/components/PopUp/PopUp.js'
import InformationRow from '../InformationRow/InformationRow.js'
import { Decimal } from 'decimal.js'
import { Observable } from 'rxjs'
import BashDeletePopUp from '../BashDeletePopUp/index.js'

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
      changeDiffPrice: '',
      checkAllDelete: false
    }
  }
  showCancelPopUp = e => {
    const target = e.currentTarget
    let orderid = target.dataset.orderid
    console.log('-----')
    this.targetRow(orderid)
    this.setState({
      showCancelPopUp: true,
      showChangeVolPopUp: false,
      showChangePricePopUp: false
    })
  }
  showChangeVolPopUp = e => {
    return
    const target = e.currentTarget
    let orderid = target.dataset.orderid
    console.log('-----')
    this.targetRow(orderid)
    this.setState({
      showCancelPopUp: false,
      showChangeVolPopUp: true,
      showChangePricePopUp: false
    })
  }
  showChangePricePopUp = () => {
    return
    const target = e.currentTarget
    let orderid = target.dataset.orderid
    console.log('-----')
    this.targetRow(orderid)
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
      showChangePricePopUp: false,
      changeDiffVol: '',
      changeDiffVol2: '',
      changeDiffPrice: ''
    })
  }
  targetRow = orderid => {
    let list = this.props.data

    const index = list.findIndex(i => i.get('OrderID') === orderid)
    if (index !== -1) {
      let targetRow = list.get(index)
      // console.log(targetRow.toJS())
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
    let params = {
      MsgType: 'F',
      OrigClOrdID: targetRow.get('OrigClOrdID'),
      Username: targetRow.get('Username'),
      OrderID: targetRow.get('OrderID'),
      Branch: targetRow.get('Branch'),
      OrderID: targetRow.get('OrderID'),
      Account: targetRow.get('Account'),
      Symbol: targetRow.get('Symbol'),
      Side: targetRow.get('Side'),
      MsgSeqNum: targetRow.get('MsgSeqNum')
    }
    this.props.cancelOrder(params)
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
  handleCheckDelete = event => {
    const target = event.target
    const value = target.checked
    let orderid = target.dataset.orderid
    this.props.checkDeleteRow(orderid, value)
  }
  handleCheckAllDelete = e => {
    const target = e.target
    const value = target.checked
    this.props.checkAllDelete(value)
    this.setState({
      checkAllDelete: value
    })
  }
  inflatDealHistory = e => {
    let target = e.target
    let orderid = target.dataset.orderid
    let flag = target.dataset.flag
    if (flag === undefined) {
      return
    } else {
      flag = flag === 'true' ? false : true
    }
    this.props.inflatDealHistory(orderid, flag)
  }
  componentDidMount() {
    let keyDowns = Observable.fromEvent(document, 'keydown')
    let enterBykey = keyDowns.filter(e => e.keyCode === 13).subscribe(e => {
      let {
        showCancelPopUp,
        showChangePricePopUp,
        showChangeVolPopUp
      } = this.state
      let targetPop
      if (showCancelPopUp) {
        targetPop = 'cancelPop'
      } else if (showChangePricePopUp) {
        targetPop = 'changePricePop'
      } else if (showChangeVolPopUp) {
        targetPop = 'changeVolPop'
      }
      if (targetPop) {
        let enter = document.querySelector(`.${targetPop} .popupEnter`)
        enter.click()
      }
    })
    let escKeyDown = keyDowns.filter(e => e.keyCode === 27).subscribe(e => {
      let {
        showCancelPopUp,
        showChangePricePopUp,
        showChangeVolPopUp
      } = this.state
      let targetPop
      if (showCancelPopUp) {
        targetPop = 'cancelPop'
      } else if (showChangePricePopUp) {
        targetPop = 'changePricePop'
      } else if (showChangeVolPopUp) {
        targetPop = 'changeVolPop'
      }
      if (targetPop) {
        let esc = document.querySelector(`.${targetPop} .popupEsc`)
        esc.click()
      }
    })
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
    let inflatList = List([])
    list.forEach(item => {
      let originOrderVolume = item.get('originOrderVolume')
      if (item.get('OrdStatus') == '2') {
        item = item.set('originOrderVolume', item.get('CumQty'))
      }
      if (item.get('OrdStatus') == '8') {
        item = item.set('originOrderVolume', item.get('OrderQty'))
      }
      if (item.has('dealHistory')) {
        let dealHistory = item.get('dealHistory')
        let totalPrice = Decimal(0)
        let totalVol = 0
        dealHistory.forEach(item => {
          let dealPrice = Decimal(parseFloat(item.get('LastPx')))
          let dealVol = parseInt(item.get('LastQty'))
          totalPrice = totalPrice.plus(dealPrice.times(dealVol))
          totalVol = totalVol + dealVol
        })
        let avgPrice = totalPrice.div(totalVol).toFixed(3, Decimal.ROUND_DOWN)
        item = item.set('avgPrice', avgPrice)
        inflatList = inflatList.push(item)
        if (
          item.has('inflatDealHistory') &&
          item.get('inflatDealHistory') === true
        ) {
          dealHistory.forEach(h => {
            h = h.set('isHistory', true)
            h = h.set('OrderID', h.get('ExecID'))
            if (h.get('OrdStatus') == '2') {
              h = h.set('originOrderVolume', h.get('CumQty'))
            } else {
              h = h.set('originOrderVolume', originOrderVolume)
            }
            inflatList = inflatList.push(h)
          })
        }
      } else {
        inflatList = inflatList.push(item)
      }
    })
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
      let cellData = ''
      if (i == 0) {
        cellData = (
          <div className={cx('header1')}>
            <input
              type="checkbox"
              name="checkAllDelete"
              checked={this.state.checkAllDelete}
              onChange={this.handleCheckAllDelete}
            />
            <span className={cx('bt1')}>刪</span>
            <span className={cx('bt2')}>改</span>
            <span className={cx('bt3')}>價</span>
          </div>
        )
      } else if (i == 1) {
        cellData = (
          <div className={cx('account-wrap')}>
            <a className={cx('inflate-btn', 'hide')} />
            <span className={cx('bt1')}>{headers[i]}</span>
          </div>
        )
      } else {
        cellData = headers[i]
      }
      cells.push(
        <Cell className={cx('header-cell')} key={i}>
          {cellData}
        </Cell>
      )
    }
    rows.push(<Row key={0}>{cells}</Row>)
    let mainDatas = inflatList.map((item, index) => {
      let cells = []
      item = item.update('Side', i => (i == 1 ? '買' : '賣'))
      let cxx = cx({
        'cell-right': true,
        'hidden-row': index + 1 === inflatList.size ? true : false,
        error: item.get('OrdStatus') == '8',
        allDeal: item.get('OrdStatus') == '2',
        dealHistory: item.get('isHistory')
      })
      let sideCx = cx({
        'side-buy': item.get('Side') == '買',
        'side-sell': item.get('Side') == '賣'
      })
      let iRow = () => {
        let TransactTime = item.get('TransactTime')
        TransactTime = changeToLocalTime(TransactTime)

        let showActionWrap = false
        if (item.get('isHistory') == true) {
          showActionWrap = false
        } else if (
          item.get('OrdStatus') == '0' ||
          item.get('OrdStatus') == '1'
        ) {
          showActionWrap = true
        }
        let inflateBtnCx = cx({
          hide: !item.has('inflatDealHistory'),
          'deflate-btn': item.get('inflatDealHistory') === true,
          'inflate-btn': item.get('inflatDealHistory') === false
        })
        return (
          <Row
            className={cxx}
            data-orderid={item.get('OrderID')}
            // onClick={this.targetRow}
          >
            <Cell key="0">
              {!showActionWrap ? (
                <span />
              ) : (
                <div>
                  <input
                    className={
                      showActionWrap
                        ? cx('checkDelete')
                        : cx('checkDelete', 'hide')
                    }
                    type="checkbox"
                    name={item.get('OrderID')}
                    data-orderid={item.get('OrderID')}
                    data-ordstatus={item.get('OrdStatus')}
                    onChange={this.handleCheckDelete}
                    checked={item.get('checkToDelete')}
                  />
                  <span
                    data-orderid={item.get('OrderID')}
                    onClick={this.showCancelPopUp}
                    className={cx('btn')}
                  >
                    刪
                  </span>
                  <span
                    data-orderid={item.get('OrderID')}
                    onClick={this.showChangeVolPopUp}
                    className={cx('btn', 'hide')}
                  >
                    量
                  </span>
                  <span
                    data-orderid={item.get('OrderID')}
                    onClick={this.showChangePricePopUp}
                    className={cx('btn', 'hide')}
                  >
                    價
                  </span>
                </div>
              )}
            </Cell>
            <Cell key="1">
              <div className={cx('account-wrap')}>
                <a
                  data-orderid={item.get('OrderID')}
                  data-flag={item.get('inflatDealHistory')}
                  onClick={this.inflatDealHistory}
                  className={inflateBtnCx}
                />
                <span className={cx('bt1')}>{item.get('Account')}</span>
              </div>
            </Cell>
            <Cell key="2">{item.get('OrderID')}</Cell>
            <Cell key="3">{TransactTime === '' ? '--' : TransactTime}</Cell>
            <Cell key="4">{item.get('Symbol')}</Cell>
            <Cell className={sideCx} key="5">
              {item.get('Side')}
            </Cell>
            <Cell key="6">
              {item.get('isHistory') ? item.get('LastPx') : item.get('Price')}
            </Cell>
            <Cell key="7">{item.get('originOrderVolume')}</Cell>
            <Cell key="8">
              {item.get('isHistory') ? item.get('LastQty') : item.get('CumQty')}
            </Cell>
            <Cell key="9">{item.get('CxlQty')}</Cell>
            <Cell key="10">
              {item.get('avgPrice') ? item.get('avgPrice') : ''}
            </Cell>
            <Cell key="11">{item.get('LeavesQty')}</Cell>
            <Cell key="12">
              {item.get('OrdStatus') === '8'
                ? item.get('errorMsg')
                : orderStatusMaping(item.get('OrdStatus'))}
            </Cell>
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
        <PopUp
          show={this.state.showCancelPopUp}
          width="300px"
          height="350px"
          zIndex="11"
        >
          <div className={validOrderCx('popup', 'cancelPop')}>
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
                    <span>{`${targetRow.get('OrderQty')} 股`}</span>
                  </div>
                </div>
                <div className={validOrderCx('item')}>
                  <div className={validOrderCx('name')}>
                    <span>已成交數量</span>
                  </div>
                  <div className={validOrderCx('value')}>
                    <span>{`${targetRow.get('CumQty')} 股`}</span>
                  </div>
                </div>
                <div className={validOrderCx('item')}>
                  <div className={validOrderCx('name')}>
                    <span>未成交數量</span>
                  </div>
                  <div className={validOrderCx('value')}>
                    <span>{`${targetRow.get('LeavesQty')} 股`}</span>
                  </div>
                </div>
              </div>
              <div className={validOrderCx('btn-wrap')}>
                <span
                  className={validOrderCx('popupEnter')}
                  onClick={this.cancelOrder}
                >
                  委託單送出[Enter]
                </span>
                <span
                  className={validOrderCx('popupEsc')}
                  onClick={this.closePopUp}
                >
                  取消[esc]
                </span>
              </div>
            </div>
          </div>
        </PopUp>
        <PopUp
          show={this.state.showChangeVolPopUp}
          width="300px"
          height="350px"
          zIndex="11"
        >
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
                    <span>{`${targetRow.get('OrderQty')} 股`}</span>
                  </div>
                </div>
                <div className={validOrderCx('item')}>
                  <div className={validOrderCx('name')}>
                    <span>已成交數量</span>
                  </div>
                  <div className={validOrderCx('value')}>
                    <span>{`${targetRow.get('CumQty')} 股`}</span>
                  </div>
                </div>
                <div className={validOrderCx('item')}>
                  <div className={validOrderCx('name')}>
                    <span>未成交數量</span>
                  </div>
                  <div className={validOrderCx('value')}>
                    <span>{`${targetRow.get('LeavesQty')} 股`}</span>
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
                    />股
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
        <PopUp
          show={this.state.showChangePricePopUp}
          width="300px"
          height="350px"
          zIndex="11"
        >
          <div className={validOrderCx('popup', 'changePricePop')}>
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
                    <span>{`${targetRow.get('LeavesQty')} 股`}</span>
                  </div>
                </div>
                <div className={validOrderCx('item')}>
                  <div className={validOrderCx('name')}>
                    <span>原始委託價</span>
                  </div>
                  <div className={validOrderCx('value')}>
                    <span>{`${targetRow.get('Price')} `}</span>
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
                    />股
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
                    />股
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
        <BashDeletePopUp orderList={list} />
      </div>
    )
  }
}

Information.propTypes = {}

export default Information
