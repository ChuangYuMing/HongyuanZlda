import { connect } from 'react-redux'
import Main from './Main'
import { closeMainPopup } from '../../actions.js'

const mapStateToProps = state => {
  return {
    isLogin: state.app.get('isLogin'),
    mainPopupMsg: state.main.get('mainPopupMsg')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closeMainPopup: id => {
      dispatch(closeMainPopup(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
