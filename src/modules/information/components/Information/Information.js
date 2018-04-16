import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styles from './information.css'
import classNames from 'classnames/bind'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import ValidOrder from '../ValidOrder/index.js'
import SocketHandler from '../../socket-handler'
import compose from 'lodash/fp/compose'

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
    let { list, filterSetting, exchange } = this.props
    let symbol = filterSetting.get('symbol')
    let account = filterSetting.get('account')
    let market = filterSetting.get('market')
    let partialDeal = filterSetting.get('partialDeal')
    let allDeal = filterSetting.get('allDeal')

    let filterByAcc = list => {
      if (account === '') {
        return list
      } else {
        return list.filter(item => {
          let acc = item.get('Account')
          if (acc === account) {
            return true
          }
        })
      }
    }
    let filterBySymbol = list => {
      if (symbol === 'all') {
        return list
      } else {
        return list.filter(item => {
          let sym = item.get('Symbol')
          if (sym === symbol) {
            return true
          }
        })
      }
    }
    let filterByMarket = list => {
      if (market === 'all') {
        return list
      } else {
        return list.filter(item => {
          let exDestination = item.get('ExDestination')
          let mkt = ''
          exchange.keySeq().forEach(key => {
            exchange.get(key).forEach(item => {
              if (item.get('ExDestination') === exDestination) {
                mkt = key
              }
            })
          })
          if (mkt === market) {
            return true
          }
        })
      }
    }
    let filterBySetting = compose(filterByAcc, filterBySymbol, filterByMarket)

    let filterList = filterBySetting(list)

    // console.log('filterList@@', filterList.toJS())

    let NowSettingList = filterList.filter(x => {
      let filterStatus = []
      if (partialDeal) {
        filterStatus.push('1')
      }
      if (allDeal) {
        filterStatus.push('2')
      }

      if (filterStatus.length > 0) {
        if (filterStatus.indexOf(x.get('OrdStatus')) !== -1) {
          return true
        }
        return false
      } else {
        return true
      }
    })

    let ValidList = filterList.filter(x => {
      let filterStatus = ['0', '1', '5', '6', '7', 'A', 'E']
      // console.log(x.get('OrdStatus'))
      if (filterStatus.indexOf(x.get('OrdStatus')) !== -1) {
        return true
      }
      return false
    })
    let DealList = filterList.filter(x => {
      let filterStatus = ['2']
      // console.log(x.get('OrdStatus'))
      if (filterStatus.indexOf(x.get('OrdStatus')) !== -1) {
        return true
      }
      if (x.get('OrdStatus') === '4' && parseInt(x.get('CumQty')) > 0) {
        return true
      }
      return false
    })
    let ErrorList = filterList.filter(x => {
      let filterStatus = ['8', 'C']
      // console.log(x.get('OrdStatus'))
      if (filterStatus.indexOf(x.get('OrdStatus')) !== -1) {
        return true
      }
      return false
    })
    // console.log(ValidList.toJS())
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
              <ValidOrder data={NowSettingList} />
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
