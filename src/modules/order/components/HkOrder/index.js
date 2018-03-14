import { connect } from 'react-redux'
import HkOrder from './HkOrder'
import { order, getQuote, registerTick, clearQuote } from '../../actions.js'
import appGlobal from 'modules/common/app-global.js'

const mapStateToProps = state => {
  return {
    quote: state.order.getIn(['orderQuote']),
    userId: state.app.get('userId'),
    targetAccount: state.main.get('targetAccount')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetData: () => {
      let sessionId = appGlobal.wsQuoteSessionId
      dispatch(clearQuote())
      // unregisterTick
      dispatch(registerTick(sessionId, ''))
      console.log('resetData')
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HkOrder)
