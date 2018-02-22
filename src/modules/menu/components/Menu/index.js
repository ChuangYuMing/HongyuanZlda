import { connect } from 'react-redux'
import Menu from './Menu'
import { updateAppInfo } from 'modules/app/actions.js'

const mapStateToProps = state => {
  return {
    test: state.app
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      let data = Map({
        isLogin: false,
        userTolen: ''
      })
      dispatch(updateAppInfo(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
