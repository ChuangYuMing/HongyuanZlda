import { connect } from 'react-redux'
import Menu from './Menu'
import { updateAppInfo } from 'modules/app/actions.js'
import { clearOrder } from 'modules/order/actions.js'
import { showBashDeletePopup } from 'modules/information/actions.js'
import {
  changeTargetAccount,
  toggleChangePwdPopup
} from 'modules/main/actions.js'
import { logout, updateFilterSetting } from '../../actions.js'
import { history } from '../../../../history.js'

const mapStateToProps = state => {
  return {
    customerInfo: state.main.get('customerInfo'),
    targetAccount: state.main.get('targetAccount'),
    member: state.main.get('customerInfo'),
    todaySymbols: state.menu.get('todaySymbols')
  }
}

const mapDispatchToProps = dispatch => {
  let flag = true
  let keydownMaping = []
  document.addEventListener('keydown', function(event) {
    // console.log(event.keyCode, event.metaKey)
    // console.log(event)
    let key = event.keyCode
    if (key === 17 || key === 82) {
      keydownMaping.push(key)
    }
    if (keydownMaping[0] === 17 && keydownMaping[1] === 82) {
      flag = false
    }

    if (
      (key == 82 && event.metaKey) ||
      (key == 82 && event.ctrlKey) ||
      key == 116
    ) {
      flag = false
    }
  })
  document.addEventListener('keyup', function(event) {
    keydownMaping.length = 0
  })
  window.addEventListener('beforeunload', function(e) {
    if (flag) {
      let data = Map({
        isLogin: false,
        userToken: ''
      })
      dispatch(logout())
      // dispatch(updateAppInfo(data))
      // dispatch(clearOrder())
    }
    flag = true
  })
  return {
    logout: () => {
      // let data = Map({
      //   isLogin: false,
      //   userToken: ''
      // })
      // dispatch(updateAppInfo(data))
      // dispatch(clearOrder())
      dispatch(logout())
      window.location.replace('/order/login')
    },
    changeTargetAccount: account => {
      dispatch(changeTargetAccount(account))
    },
    showChangePwd: () => {
      dispatch(toggleChangePwdPopup(true))
    },
    updateFilterSetting: (tag, value) => {
      dispatch(updateFilterSetting(tag, value))
    },
    showBashDeletePopup: value => {
      dispatch(showBashDeletePopup(value))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
