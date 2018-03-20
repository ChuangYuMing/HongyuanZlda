import { connect } from 'react-redux'
import Menu from './Menu'
import { updateAppInfo } from 'modules/app/actions.js'
import { clearOrder } from 'modules/order/actions.js'
import {
  changeTargetAccount,
  toggleChangePwdPopup
} from 'modules/main/actions.js'

const mapStateToProps = state => {
  return {
    customerInfo: state.main.get('customerInfo'),
    targetAccount: state.main.get('targetAccount'),
    member: state.main.get('customerInfo')
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
      // dispatch(updateAppInfo(data))
      // dispatch(clearOrder())
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
    },
    changeTargetAccount: account => {
      dispatch(changeTargetAccount(account))
    },
    showChangePwd: () => {
      dispatch(toggleChangePwdPopup(true))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
