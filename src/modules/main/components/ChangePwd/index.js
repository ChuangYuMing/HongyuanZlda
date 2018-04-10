import { connect } from 'react-redux'
import ChangePwd from './ChangePwd'
import {
  toggleChangePwdPopup,
  updatePwd,
  checkPwd
} from 'modules/main/actions.js'

const mapStateToProps = state => {
  return {
    showChangePwd: state.main.get('showChangePwd'),
    tokenId: state.app.get('userToken'),
    userId: state.app.get('userId'),
    forceUpdatePwd: state.login.get('forceUpdatePwd')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hidePopup: id => {
      dispatch(toggleChangePwdPopup(false))
    },
    updatePwd: params => {
      return new Promise(resolve => {
        if (params['Password'] === '') {
          resolve('不能為空值')
          return
        }
        dispatch(updatePwd(params)).then(res => {
          resolve(res)
        })
      })
    },
    checkPwd: params => {
      return new Promise(resolve => {
        dispatch(checkPwd(params)).then(res => {
          resolve(res)
        })
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePwd)
