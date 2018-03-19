import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './main.css'
import classNames from 'classnames/bind'
import Order from 'modules/order/components/Order'
import Information from 'modules/information/components/Information'
import Member from 'modules/member/components/Member'
import Inventory from 'modules/inventory/components/Inventory'
import Menu from 'modules/menu/components/Menu'
import { Redirect } from 'react-router-dom'
import SplitPane from 'react-split-pane'
import PopUp from 'modules/shared/components/PopUp/PopUp.js'
import SocketHandler from '../../socket-handler'
import WsConnect from 'modules/app/ws-connect.js'
import WsQuoteConnect from 'modules/app/ws-quote-connect.js'
import Loading from 'modules/shared/components/Loading2/Loading2.js'
import ChangePwd from '../ChangePwd/index.js'

let cx = classNames.bind(styles)
class Main extends Component {
  constructor() {
    super()
    this.windowWith = document.body.clientWidth
    this.state = {
      hasLoadData: false
    }
  }
  componentDidMount() {
    let { userToken } = this.props
    let promise1 = this.props.getProds(['US', 'HK'])
    let promise2 = this.props.getCustomerInfo({
      Username: this.props.userId,
      TokenID: this.props.userToken
    })

    let promise3 = this.props.getOrderStatus({
      Username: this.props.userId,
      TokenID: this.props.userToken
    })
    let promise4 = this.props.getExchange({ TokenID: userToken })
    let promise5 = this.props.getProd2({ TokenID: userToken })
    Promise.all([promise2, promise3, promise4]).then(res => {
      this.setState({
        hasLoadData: true
      })
    })
    this.WsConnect = new WsConnect(this.props.userToken)
    this.WsQuoteConnect = new WsQuoteConnect()
    this.WsConnect.connect()
    this.WsQuoteConnect.connect()
    SocketHandler.on()
  }
  componentWillUnmount() {
    this.WsConnect.close()
    this.WsQuoteConnect.close()
    SocketHandler.off()
  }
  closeMainPopup = e => {
    let target = e.target
    let id = target.dataset.id
    this.props.closeMainPopup(id)
  }
  render() {
    console.log('Main')
    let { prodList } = this.props
    let gotProdList = Object.keys(prodList).length > 0
    if (!this.props.isLogin) {
      return (
        <Redirect
          to={{
            pathname: '/order/login',
            state: { from: this.props.location }
          }}
        />
      )
    }
    if (!this.state.hasLoadData) {
      return <Loading />
    }
    let popup = []
    let { mainPopupMsg } = this.props
    mainPopupMsg.forEach(item => {
      let id = item.get('id')
      let msg = item.get('msg')
      let status = item.get('status')
      let statuscx = cx({
        mainPopup: true,
        success: status === 'success',
        error: status === 'error',
        deal: status === 'deal'
      })
      let data = (
        <PopUp
          key={id}
          show={true}
          width="400px"
          height="60px"
          top="initial"
          bottom="126px"
        >
          <div className={statuscx}>
            <a
              data-id={id}
              onClick={this.closeMainPopup}
              className={cx('boxclose')}
            />
            <div
              className={cx('msg')}
              dangerouslySetInnerHTML={{ __html: msg }}
            />
          </div>
        </PopUp>
      )
      popup.push(data)
    })
    return (
      <div className={cx('main-wrap')}>
        <div className={cx('menu')}>
          <Menu />
        </div>
        <div className={cx('pane-wrap')}>
          <SplitPane split="horizontal" minSize={70} defaultSize={190}>
            <div className={cx('information')}>
              <Information />
            </div>
            <SplitPane
              split="vertical"
              minSize={200}
              defaultSize={this.windowWith / 2}
            >
              <div className={cx('members')}>
                <Member />
              </div>
              <div className={cx('inventory')}>
                <Inventory />
              </div>
            </SplitPane>
          </SplitPane>
        </div>
        <div className={cx('order')}>
          <Order />
        </div>
        {popup}
        <ChangePwd />
      </div>
    )
  }
}

Main.propTypes = {}

export default Main
