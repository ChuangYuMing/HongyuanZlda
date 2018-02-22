import { connect } from 'react-redux'
import Menu from './Menu'
import { updateAppInfo } from 'modules/app/actions.js'
import { clearOrder } from 'modules/order/actions.js'

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
        userToken: ''
      })
      dispatch(updateAppInfo(data))
      dispatch(clearOrder())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
