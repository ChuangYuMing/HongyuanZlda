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
    let prodList = this.props.prodList
    return (
      <div id="orderWrap" className={cx('order-wrap')}>
        <div className={cx('setting-wrap')}>
          <span className={cx('env')}>測試環境下單</span>
          <img src={i1} alt="清除欄位" />
          <img src={i2} alt="設定" />
        </div>
        <div className={cx('tabs-wrap')}>
          <Tabs>
            <TabList>
              <Tab>港股</Tab>
              <Tab>美股</Tab>
            </TabList>

            <TabPanel>
              <HkOrder
                country="HK"
                prodList={prodList['HK']}
                order={this.props.order}
                getQuote={this.props.getQuote}
                accountList={this.props.customerInfo}
              />
            </TabPanel>
            <TabPanel>
              <HkOrder
                country="US"
                prodList={prodList['US']}
                order={this.props.order}
                getQuote={this.props.getQuote}
                accountList={this.props.customerInfo}
              />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    )
  }
}

Order.propTypes = {}

export default Order
