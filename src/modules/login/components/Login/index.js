import { connect } from 'react-redux'
import Login from './Login'
import { login, customerInfo } from '../../actions.js'
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
      let millss = new Date().getMilliseconds()
      let params = {
        MsgSeqNum: 'customerInfo',
        MsgType: '40',
        TokenID: token,
        SenderCompID: '',
        SenderSubID: '',
        SendingTime: `${formatDate(new Date(), 'yyyyMMdd-HH:MM:ss')}.${millss}`,
        TargetCompID: '',
        TargetSubID: '',
        Username: userId,
        RMode: '1'
      }
      console.log(params)
      dispatch(customerInfo(params))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
