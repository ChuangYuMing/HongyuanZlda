import { connect } from 'react-redux'
import HkOrder from './HkOrder'
import { order, getQuote } from '../../actions.js'

const mapStateToProps = state => {
  return {
    quote: state.order.getIn(['orderQuote']),
    userId: state.app.get('userId'),
    targetAccount: state.main.get('targetAccount')
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(HkOrder)
