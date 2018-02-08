import React from 'react'
import ReactDom from 'react-dom'
import { Route, Switch } from 'react-router-dom'
import classNames from 'classnames/bind'
import styles from './App.css'
import Temp from 'modules/temp/components/Temp'

let cx = classNames.bind(styles)
class App extends React.Component {
  constructor(props) {
    super(props)
    // let newVersion = '1070201'
    // let oldVersion = getCookie('version')
    // this.props.setApiDomain()
    // let apiDomain =
    //   this.props.apiDomain || window.localStorage.getItem('apiDomain')
    // if (oldVersion !== newVersion) {
    //   this.props.logout()
    //   setCookie('version', newVersion, 365)
    //   window.localStorage.clear()
    //   if (window.location.pathname !== '/login') {
    //     window.location.replace(`/login`)
    //   }
    // }
    // if (!this.props.isLogin && window.location.pathname !== '/login') {
    //   window.location.replace(`/login`)
    // }
  }
  // componentWillMount() {}
  componentDidMount() {
    console.log('componentDidMount')
    // this.props.setApiDomain()
    // console.log(this.props)
    this.props.getClientIP()
    // if (window.performance) {
    //   setTimeout(() => {
    //     let pefTime = performance.timing
    //     let renderTime = pefTime.domComplete - pefTime.domLoading
    //     let pageLoadTime = pefTime.loadEventEnd - pefTime.navigationStart
    //     let connectTime = pefTime.responseEnd - pefTime.requestStart
    //     GoogleAnalytics.timing({
    //       category: 'page performance',
    //       variable: ' render time',
    //       value: renderTime
    //     })
    //     GoogleAnalytics.timing({
    //       category: 'page performance',
    //       variable: 'total page load time',
    //       value: pageLoadTime
    //     })
    //     GoogleAnalytics.timing({
    //       category: 'page performance',
    //       variable: 'response time',
    //       value: connectTime
    //     })
    //   }, 2000)
    // }
  }
  render() {
    return (
      <div>
        <Switch>
          <Route exact path={'/'} component={Temp} />
          <Route exact path={'/temp'} component={Temp} />
        </Switch>
        <div id="popupContainer" />
      </div>
    )
  }
}

export default App
