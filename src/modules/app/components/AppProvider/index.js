import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { persistStore, autoRehydrate } from 'redux-persist'
import history from '../../../../history'
import { store } from 'store/index.js'
import App from '../App'
import withTracker from 'modules/common/withTracker.js'

let AppWithGA = withTracker(App)

function rehydrated() {
  let whiteList = ['app']
  const persistConfig = {
    whitelist: whiteList
  }
  return new Promise((resolve, reject) => {
    persistStore(store, persistConfig, () => {
      console.log('rehydration complete')
      resolve(true)
    })
  })
}

function getSessionId() {
  return new Promise((resolve, reject) => {
    resolve(true)
  })
}

class AppProvider extends React.Component {
  constructor() {
    super()
    this.state = {
      load: false
    }
  }

  componentWillMount() {
    Promise.all([rehydrated(), getSessionId()])
      .then(results => {
        this.setState({ load: true })
      })
      .catch(e => {
        console.log(e)
        // alert(e)
      })
  }

  render() {
    console.log('render app')
    if (!this.state.load) {
      return <div />
    }
    return (
      <Provider store={store}>
        <Router>
          <Route component={AppWithGA} />
        </Router>
      </Provider>
    )
  }
}

export default AppProvider
