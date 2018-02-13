import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from 'store/index.js'
import { hot } from 'react-hot-loader'
import WsConnect from 'modules/app/ws-connect.js'
import WsQuoteConnect from 'modules/app/ws-quote-connect.js'
import App from '../App'

// import withTracker from 'modules/common/withTracker.js'

// let AppWithGA = withTracker(App)
let AppWithGA = App

class AppProvider extends React.Component {
  constructor() {
    super()
  }
  componentDidMount() {
    WsConnect.connect()
    WsQuoteConnect.connect()
    window.apexTest = WsConnect
  }
  componentWillUnmount() {
    // WsConnect.close()
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Route component={AppWithGA} />
        </Router>
      </Provider>
    )
  }
}

export default hot(module)(AppProvider)
