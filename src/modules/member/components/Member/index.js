import { connect } from 'react-redux'
import Member from './Member'
import { changeTargetAccount } from 'modules/main/actions.js'

const mapStateToProps = state => {
  return {
    customerInfo: state.main.get('customerInfo'),
    targetAccount: state.main.get('targetAccount')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeTargetAccount: account => {
      dispatch(changeTargetAccount(account))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Member)
