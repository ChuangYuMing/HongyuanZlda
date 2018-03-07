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

let cx = classNames.bind(styles)
class Main extends Component {
  constructor() {
    super()
    this.windowWith = document.body.clientWidth
  }
  componentDidMount() {
    SocketHandler.on()
  }
  componentWillUnmount() {
    SocketHandler.off()
  }
  closeMainPopup = e => {
    let target = e.target
    let id = target.dataset.id
    this.props.closeMainPopup(id)
  }
  render() {
    if (!this.props.isLogin) {
      return (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: this.props.location }
          }}
        />
      )
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
      </div>
    )
  }
}

Main.propTypes = {}

export default Main
