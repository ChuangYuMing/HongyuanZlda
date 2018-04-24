import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './order.css'
import classNames from 'classnames/bind'
import appGlobal from 'modules/common/app-global.js'
import SocketHandler from '../../socket-handler'
import i1 from 'static/image/i1.png'
import i2 from 'static/image/i2.png'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import UsOrder from '../UsOrder/UsOrder.js'
import HkOrder from '../HkOrder/index.js'

let cx = classNames.bind(styles)
class Order extends Component {
  constructor() {
    super()
  }
  componentDidMount() {
    SocketHandler.on()
  }
  componentWillUnmount() {
    SocketHandler.off()
  }

  render() {
    let { prodList, exchange } = this.props
    let tabs = []
    let tabPanels = []
    exchange.entrySeq().forEach((e, index) => {
      let market = e[0]
      let marketName = e[1].getIn([0, 'MName'])
      tabs.push(<Tab key={index}>{`${marketName}`}</Tab>)
      tabPanels.push(
        <TabPanel key={index}>
          <HkOrder
            country={market}
            marketName={marketName}
            prodList={prodList[`${market}`]}
            order={this.props.order}
            getQuote={this.props.getQuote}
            accountList={this.props.customerInfo}
            changeTargetAccount={this.props.changeTargetAccount}
            tradeUnit={this.props.tradeUnit.get(`${market}`)}
            customerInfo={this.props.customerInfo}
          />
        </TabPanel>
      )
    })
    return (
      <div id="orderWrap" className={cx('order-wrap')}>
        <div className={cx('setting-wrap')}>
          <span className={cx('env')}>測試環境下單</span>
          <img src={i1} alt="清除欄位" />
          <img src={i2} alt="設定" />
        </div>
        <div className={cx('tabs-wrap')}>
          <Tabs>
            <TabList>{tabs}</TabList>

            {tabPanels}
          </Tabs>
        </div>
      </div>
    )
  }
}

Order.propTypes = {}

export default Order
