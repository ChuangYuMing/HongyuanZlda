import { connect } from 'react-redux'
import HkOrder from './HkOrder'
import { order, getQuote } from '../../actions.js'

const mapStateToProps = state => {
  return {
    quote: state.order.getIn(['orderQuote'])
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(HkOrder)
