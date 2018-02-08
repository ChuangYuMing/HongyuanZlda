import { connect } from 'react-redux'
import Temp from './Temp'

const mapStateToProps = state => {
  return {
    test: state.app.temp
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTest: () => {
      alert('test')
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Temp)
