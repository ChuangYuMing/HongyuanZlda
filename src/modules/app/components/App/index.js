import { connect } from 'react-redux'
import App from './App'
import { getClientIP } from '../../actions.js'
import { withRouter } from 'react-router-dom'
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
    logout: () => {
      dispatch(updateAppInfo({ login: false }))
    }
  }
}

export default withRouter(connect(mapStateToProps, undefined, mergeProps)(App))
