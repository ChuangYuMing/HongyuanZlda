import { connect } from 'react-redux'
import Inventory from './Inventory'

const mapStateToProps = state => {
  return {
    targetAccount: state.main.get('targetAccount'),
    customerInfo: state.main.get('customerInfo')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTest: () => {
      alert('test')
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Inventory)
