import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import AppProvider from './modules/app/components/AppProvider'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  )
}

// if (module.hot) {
//   module.hot.accept('./modules/app/components/AppProvider', () => {
//     const AppProvider = require('./modules/app/components/AppProvider').default
//     render(AppProvider)
//   })
// }
render(AppProvider)
// ReactDOM.render(<div>333</div>, document.getElementById('root'))
// render(<div>3332</div>)
