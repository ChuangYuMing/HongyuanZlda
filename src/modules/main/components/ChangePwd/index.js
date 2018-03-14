import { connect } from 'react-redux'
import ChangePwd from './ChangePwd'
import { toggleChangePwdPopup, updatePwd } from 'modules/main/actions.js'

const mapStateToProps = state => {
  return {
    showChangePwd: state.main.get('showChangePwd'),
    tokenId: state.app.get('userToken'),
    userId: state.app.get('userId')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hidePopup: id => {
      dispatch(toggleChangePwdPopup(false))
    },
    updatePwd: pwd => {
      return new Promise(resolve => {
        dispatch(updatePwd(pwd)).then(res => {
          resolve(res)
        })
      })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePwd)
