import { connect } from 'react-redux'
import Member from './Member'
import { changeTargetAccount } from 'modules/main/actions.js'
import { getInventory } from 'modules/inventory/actions.js'

const mapStateToProps = state => {
  return {
    customerInfo: state.main.get('customerInfo'),
    targetAccount: state.main.get('targetAccount'),
    userToken: state.app.get('userToken')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeTargetAccount: data => {
      dispatch(changeTargetAccount(data))
    },
    getInventory: params => {
      dispatch(getInventory(params))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Member)
