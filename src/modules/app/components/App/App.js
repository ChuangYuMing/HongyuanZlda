import React from 'react'
import ReactDom from 'react-dom'
import { Route, Switch } from 'react-router-dom'
import classNames from 'classnames/bind'
import styles from './App.css'
import Temp from 'modules/temp/components/Temp'
import Temp2 from 'modules/temp/components/Temp2'
import Main from 'modules/main/components/Main'
import Loading from '../Loading/Loading.js'
import Login from 'modules//login/components/Login'
import WsConnect from 'modules/app/ws-connect.js'
import WsQuoteConnect from 'modules/app/ws-quote-connect.js'

let cx = classNames.bind(styles)
class App extends React.PureComponent {
  constructor(props) {
    super(props)
    this.haveload = false
    this.WsConnect = ''
    this.WsQuoteConnect = ''
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isLogin && this.props.isLogin !== nextProps.isLogin) {
      this.WsConnect = new WsConnect(this.props.userToken)
      this.WsQuoteConnect = new WsQuoteConnect()
      this.WsConnect.connect()
      this.WsQuoteConnect.connect()
    }
  }
  componentWillUnmount() {
    this.WsConnect.close()
    this.WsQuoteConnect.close()
  }
  componentDidMount() {
    if (this.props.isLogin) {
      let Ws = new WsConnect(this.props.userToken)
      Ws.connect()
      WsQuoteConnect.connect()
    }
    this.props.getClientIP()
  }
  render() {
    let { rehydrated } = this.props
    if (!rehydrated) {
      return <Loading />
    } else {
      return (
        <div>
          <Switch>
            <Route exact path={'/'} component={Main} />
            <Route exact path={'/temp'} component={Temp} />
            <Route exact path={'/temp2'} component={Temp2} />
            <Route exact path={'/login'} component={Login} />
          </Switch>
          <div id="popupContainer" />
        </div>
      )
    }
  }
}

export default App
