import React, { PureComponent } from 'react'
import styles from './bash-delete-popup.css'
import classNames from 'classnames/bind'
import { StickyTable, Row, Cell } from 'react-sticky-table'
import PopUp from 'modules/shared/components/PopUp/PopUp.js'
import trash from 'static/image/icons/trash_bin.png'

let cx = classNames.bind(styles)
class BashDeletePopUp extends PureComponent {
  constructor(props) {
    super(props)
  }

  bashCancel = list => {
    this.props.toggleBashDeletePopup(false)
    for (let index = 0; index < list.size; index++) {
      const item = list.get(index)
      let params = {
        MsgType: 'F',
        OrigClOrdID: item.get('OrigClOrdID'),
        Username: item.get('Username'),
        OrderID: item.get('OrderID'),
        Branch: item.get('Branch'),
        OrderID: item.get('OrderID'),
        Account: item.get('Account'),
        Symbol: item.get('Symbol'),
        Side: item.get('Side'),
        MsgSeqNum: item.get('MsgSeqNum')
      }
      this.props.cancelOrder(params)
    }
  }
  closePopUp = () => {
    this.props.toggleBashDeletePopup(false)
  }
  checkDeleteRow = e => {
    let target = e.target
    let { orderid } = target.dataset
    this.props.checkDeleteRow(orderid, false)
  }
  render() {
    if (!this.props.showBashDeletePopup) {
      return <div className={cx('hide')} />
    }
    let list = this.props.orderList
    list = list.filter(item => item.get('checkToDelete') === true)
    console.log('@@list')
    var rows = []
    var cells = []
    let headers = ['移除', '動作', '帳號', '委託書號', '買/賣', '股票', '數量']
    for (let i = 0; i < headers.length; i++) {
      let cellData = headers[i]
      cells.push(
        <Cell className={cx('header-cell')} key={i}>
          {cellData}
        </Cell>
      )
    }
    rows.push(<Row key={0}>{cells}</Row>)
    let mainDatas = list.map((item, index) => {
      return (
        <Row key={index + 1} data-orderid={item.get('OrderID')}>
          <Cell key="0">
            <img
              data-orderid={item.get('OrderID')}
              onClick={this.checkDeleteRow}
              className={cx('trash')}
              src={trash}
            />
          </Cell>
          <Cell key="1">刪單</Cell>
          <Cell key="2">{item.get('Account')}</Cell>
          <Cell key="3">{item.get('OrderID')}</Cell>
          <Cell key="4">{item.get('Side') == '1' ? '買' : '賣'}</Cell>
          <Cell key="5">{item.get('Symbol')}</Cell>
          <Cell key="6">{item.get('LeavesQty')}股</Cell>
        </Row>
      )
    })
    for (const row of mainDatas) {
      rows.push(row)
    }
    return (
      <div className={cx('sticky-table')}>
        <PopUp
          show={this.props.showBashDeletePopup}
          width="850px"
          height="400px"
          zIndex="11"
        >
          <div className={cx('popup', 'checkToDeletPop')}>
            <div className={cx('title')}>
              <span>批次刪單</span>
            </div>
            <div className={cx('main')}>
              <div className={cx('info-wrap')}>
                <StickyTable stickyColumnCount={0}>{rows}</StickyTable>
              </div>
            </div>
            <div className={cx('btn-wrap')}>
              <span
                onClick={() => {
                  this.bashCancel(list)
                }}
              >
                委託單送出
              </span>
              <span onClick={this.closePopUp}>取消</span>
            </div>
          </div>
        </PopUp>
      </div>
    )
  }
}

export default BashDeletePopUp
