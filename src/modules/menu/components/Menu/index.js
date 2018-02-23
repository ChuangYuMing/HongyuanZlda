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
  let flag = true
  document.addEventListener('keydown', function(event) {
    console.log(event.keyCode, event.metaKey)
    if (event.keyCode == 82 && event.metaKey) {
      flag = false
    }
  })
  window.addEventListener('beforeunload', function(e) {
    if (flag) {
      let data = Map({
        isLogin: false,
        userToken: ''
      })
      dispatch(updateAppInfo(data))
      dispatch(clearOrder())
    }
    flag = true
  })
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
