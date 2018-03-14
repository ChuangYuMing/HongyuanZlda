import { connect } from 'react-redux'
import Login from './Login'
import { login } from '../../actions.js'
import { formatDate } from 'tools/date.js'

const mapStateToProps = state => {
  return {
    isLogin: state.app.get('isLogin'),
    errorMsg: state.login.get('errorMsg')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login: data => {
      dispatch(login(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
