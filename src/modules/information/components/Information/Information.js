import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './information.css'
import classNames from 'classnames/bind'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import ValidOrder from '../ValidOrder/index.js'
import DealOrder from '../DealOrder/index.js'
import SocketHandler from '../../socket-handler'

let cx = classNames.bind(styles)
class Information extends PureComponent {
  constructor() {
    super()
    this.state = {
      sortByTime: false
    }
  }
  componentDidMount() {
    SocketHandler.on()
  }
  componentWillUnmount() {
    SocketHandler.off()
  }
  render() {
    return (
      <div className={cx('information-wrap')}>
        <div className={cx('tabs-wrap')}>
          <Tabs>
            <TabList>
              <Tab>目前設定</Tab>
              <Tab>有效委託</Tab>
              <Tab>完全成交</Tab>
            </TabList>

            <TabPanel>
              <ValidOrder />
            </TabPanel>
            <TabPanel>
              <ValidOrder />
            </TabPanel>
            <TabPanel>
              <DealOrder />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    )
  }
}

Information.propTypes = {}

export default Information
