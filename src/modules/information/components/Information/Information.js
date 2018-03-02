import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './information.css'
import classNames from 'classnames/bind'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import ValidOrder from '../ValidOrder/index.js'
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
    let { list } = this.props
    let ValidList = list.filter(x => {
      let filterStatus = ['0', '1', '5', '6', '7', 'A', 'E']
      // console.log(x.get('OrdStatus'))
      if (filterStatus.indexOf(x.get('OrdStatus')) !== -1) {
        return true
      }
      return false
    })
    let DealList = list.filter(x => {
      let filterStatus = ['2']
      // console.log(x.get('OrdStatus'))
      if (filterStatus.indexOf(x.get('OrdStatus')) !== -1) {
        return true
      }
      return false
    })
    let ErrorList = list.filter(x => {
      let filterStatus = ['8', 'C']
      // console.log(x.get('OrdStatus'))
      if (filterStatus.indexOf(x.get('OrdStatus')) !== -1) {
        return true
      }
      return false
    })
    console.log(ValidList.toJS())
    return (
      <div className={cx('information-wrap')}>
        <div className={cx('tabs-wrap')}>
          <Tabs>
            <TabList>
              <Tab>目前設定</Tab>
              <Tab>有效委託</Tab>
              <Tab>完全成交</Tab>
              <Tab>錯誤單</Tab>
            </TabList>

            <TabPanel>
              <ValidOrder data={list} />
            </TabPanel>
            <TabPanel>
              <ValidOrder data={ValidList} />
            </TabPanel>
            <TabPanel>
              <ValidOrder data={DealList} />
            </TabPanel>
            <TabPanel>
              <ValidOrder data={ErrorList} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    )
  }
}

Information.propTypes = {}

export default Information
