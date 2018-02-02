import { connect } from 'react-redux'
import App from './App'
import { getClientIP } from '../../actions.js'
import { withRouter } from 'react-router-dom'
import api from 'api'
import queryString from 'query-string'
import { updateAppInfo } from '../../actions.js'

const mapStateToProps = state => {
  return {
    isLogin: state.app.login,
    apiDomain: state.app.apiDomain,
    haveTaifex: state.app.haveTaifex
  }
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  let { dispatch } = dispatchProps
  return {
    ...stateProps,
    ...ownProps,
    getClientIP: () => {
      dispatch(getClientIP())
    },
    setApiDomain: () => {
      let apiDomain
      const parsed = queryString.parse(location.search)
      apiDomain =
        parsed.ip ||
        stateProps.apiDomain ||
        window.localStorage.getItem('apiDomain')
      console.log(apiDomain)
      window.localStorage.setItem('apiDomain', apiDomain)
      api.setApiDomain(apiDomain)
      dispatch(updateAppInfo({ apiDomain: apiDomain }))
    },
    logout: () => {
      dispatch(updateAppInfo({ login: false }))
    }
  }
}

export default withRouter(connect(mapStateToProps, undefined, mergeProps)(App))
