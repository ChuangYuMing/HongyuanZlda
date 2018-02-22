import { connect } from 'react-redux'
import Main from './Main'

const mapStateToProps = state => {
  return {
    isLogin: state.app.get('isLogin')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTest: () => {
      alert('test')
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
