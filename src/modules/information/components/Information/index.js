import { connect } from 'react-redux'
import Information from './Information'

const mapStateToProps = state => {
  return {
    lists: state.order.orderList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTest: () => {
      alert('test')
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Information)
