import { connect } from 'react-redux'
import Member from './Member'

const mapStateToProps = state => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(Member)
