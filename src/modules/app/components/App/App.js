import React from 'react'
import ReactDom from 'react-dom'
import { Route, Switch } from 'react-router-dom'
import classNames from 'classnames/bind'
import styles from './App.css'
import Temp from 'modules/temp/components/Temp'
import Temp2 from 'modules/temp/components/Temp2'
import Temp3 from 'modules/temp/components/Temp3/Temp3.js'
import Main from 'modules/main/components/Main'
import Loading from '../Loading/Loading.js'
import Login from 'modules//login/components/Login'

let cx = classNames.bind(styles)
class App extends React.PureComponent {
  constructor(props) {
    super(props)
    this.haveload = false
    this.WsConnect = ''
    this.WsQuoteConnect = ''
  }

  componentDidMount() {
    this.props.getClientIP()
    this.props.getApiUrl()
  }
  render() {
    let { rehydrated, fetchApiUrl } = this.props
    // console.log('fetchApiUrl', fetchApiUrl)
    if (!rehydrated || !fetchApiUrl) {
      return <div />
    } else {
      return (
        <div>
          <Switch>
            <Route exact path={'/order'} component={Main} />
            <Route exact path={'/temp'} component={Temp} />
            <Route exact path={'/temp2'} component={Temp2} />
            <Route exact path={'/temp3'} component={Temp3} />
            <Route exact path={'/order/login'} component={Login} />
          </Switch>
        </div>
      )
    }
  }
}

export default App
