import { connect } from 'react-redux'
import Information from './Information'

const mapStateToProps = state => {
  return {
    list: state.order.getIn(['orderList']),
    filterSetting: state.menu.get('filterSetting'),
    exchange: state.main.get('exchange')
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
