import React from 'react'
import ReactDom from 'react-dom'
import Popup from 'react-popup'
import { Route, Switch } from 'react-router-dom'
import classNames from 'classnames/bind'
import styles from './App.scss'
import Temp from 'modules/temp/components/Temp'
import Order from 'modules/order/components/Order'
import OrderList from 'modules/order-list/components/OrderList'
import Menu from 'modules/menu/components/Menu'
import BottomMenu from 'modules/menu/components/BottomMenu/index.js'
import Login from 'modules/login/components/Login'
import SelfStock from 'modules/self-stock/components/SelfStock'
import OrderHistory from 'modules/order-history/components/OrderHistory'
import DealList from 'modules/deal-list/components/DealList'
import DealHistory from 'modules/deal-history/components/DealHistory'
import StockInventory from 'modules/stock-inventory/components/StockInventory'
import InvestmentAnalysis from 'modules/investment-analysis/components/InvestmentAnalysis'
import TransferMoney from 'modules/transfer-money/components/TransferMoney'
import TransferMoneyHistory from 'modules/transfer-money-history/components/TransferMoneyHistory'
import RiseRankingList from 'modules/rise-ranking-list/components/RiseRankingList'
import GameRanking from 'modules/game-ranking/components/GameRanking'
import FinanceEntrance from 'modules/finance-entrance/components/FuncBoard'
import BackBlock from 'modules/finance-entrance/components/BackBlock'
import GoogleAnalytics from 'react-ga'
import Quotes from 'modules/quotes/components/Quotes/Quotes.js'
import SearchCompany from 'modules/other/components/SearchCompany'
import RiskAssess from 'modules/other/components/RiskAssess'
import ForeignExchange from 'modules/other/components/ForeignExchange'
import InternationStock from 'modules/other/components/InternationStock'
import { getCookie, setCookie } from 'tools/cookie.js'
import SuggestFund from 'modules/other/components/SuggestFund'
import HotFund from 'modules/other/components/HotFund'
import Futures from 'modules/other/components/Futures'
import Temp2 from 'modules/temp/components/Temp2'
import Teaching from 'modules/teaching/components/Teaching'

let cx = classNames.bind(styles)
class App extends React.Component {
  constructor(props) {
    console.log('constructor')
    super(props)
    let newVersion = '1070201'
    let oldVersion = getCookie('version')
    // console.log(oldVersion)
    this.props.setApiDomain()
    let apiDomain =
      this.props.apiDomain || window.localStorage.getItem('apiDomain')
    if (oldVersion !== newVersion) {
      this.props.logout()
      setCookie('version', newVersion, 365)

      let isTeaching = window.localStorage.getItem('isTeaching')
      window.localStorage.clear()
      if (isTeaching === 'false') {
        window.localStorage.setItem('isTeaching', isTeaching)
      }
      if (window.location.pathname !== '/login') {
        window.location.replace(`/login?ip=${apiDomain}`)
      }
    }
    if (!this.props.isLogin && window.location.pathname !== '/login') {
      window.location.replace(`/login?ip=${apiDomain}`)
    }
  }
  // componentWillMount() {}
  componentDidMount() {
    console.log('componentDidMount')
    // this.props.setApiDomain()
    // console.log(this.props)
    this.props.getClientIP()
    ReactDom.render(<Popup />, document.getElementById('popupContainer'))
    if (window.performance) {
      setTimeout(() => {
        let pefTime = performance.timing
        let renderTime = pefTime.domComplete - pefTime.domLoading
        let pageLoadTime = pefTime.loadEventEnd - pefTime.navigationStart
        let connectTime = pefTime.responseEnd - pefTime.requestStart
        GoogleAnalytics.timing({
          category: 'page performance',
          variable: ' render time',
          value: renderTime
        })
        GoogleAnalytics.timing({
          category: 'page performance',
          variable: 'total page load time',
          value: pageLoadTime
        })
        GoogleAnalytics.timing({
          category: 'page performance',
          variable: 'response time',
          value: connectTime
        })
      }, 2000)
    }
  }
  render() {
    let { isLogin, haveTaifex } = this.props
    let isLoginPage = window.location.pathname === '/login'
    return (
      <div>
        {!isLoginPage && isLogin ? <Menu /> : ''}
        <Switch>
          <Route exact path={'/'} component={Temp} />
          <Route exact path={'/temp2'} component={Temp2} />
          <Route path={'/login'} component={Login} />
          <Route path={'/order/list'} component={OrderList} />
          <Route path={'/order/history'} component={OrderHistory} />
          <Route path={'/order'} component={Order} />
          <Route path={'/selfstock'} component={SelfStock} />
          <Route path={'/deal/list'} component={DealList} />
          <Route path={'/deal/history'} component={DealHistory} />
          <Route path={'/stock-inventory'} component={StockInventory} />
          <Route path={'/transfer-money'} component={TransferMoney} />
          <Route
            path={'/transfer-money-history'}
            component={TransferMoneyHistory}
          />
          <Route path={'/investment-analysis'} component={InvestmentAnalysis} />
          <Route path={'/rise-ranking-list'} component={RiseRankingList} />
          <Route path={'/game-ranking'} component={GameRanking} />
          <Route path={'/finance-entrance'} component={FinanceEntrance} />
          <Route path={'/quotes'} component={Quotes} />
          <Route path={'/searchCompany'} component={SearchCompany} />
          <Route path={'/risk-assess'} component={RiskAssess} />
          <Route path={'/foreign-exchange'} component={ForeignExchange} />
          <Route path={'/internation-stock'} component={InternationStock} />
          <Route path={'/suggest-fund'} component={SuggestFund} />
          <Route path={'/hot-fund'} component={HotFund} />
          <Route path={'/derived/futures'} component={Futures} />
          <Route path={'/teaching'} component={Teaching} />
        </Switch>
        {!isLoginPage && isLogin ? <BottomMenu /> : ''}
        <div id="popupContainer" />
      </div>
    )
  }
}

export default App
