import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from 'store/index.js'
import { hot } from 'react-hot-loader'
import App from '../App'

// import withTracker from 'modules/common/withTracker.js'

// let AppWithGA = withTracker(App)
let AppWithGA = App

class AppProvider extends React.Component {
  constructor() {
    super()
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
