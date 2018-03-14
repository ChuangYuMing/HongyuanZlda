import { connect } from 'react-redux'
import Login from './Login'
import { login } from '../../actions.js'
import { formatDate } from 'tools/date.js'

const mapStateToProps = state => {
  return {
    isLogin: state.app.get('isLogin')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login: async data => {
      let { token, userId } = await dispatch(login(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
