import { connect } from 'react-redux'
import Prototype from './Prototype'

const mapStateToProps = state => {
  return {
    test: state.app
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTest: () => {
      alert('test')
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Prototype)
