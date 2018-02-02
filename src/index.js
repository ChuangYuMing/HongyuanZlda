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

if (module.hot) {
  module.hot.accept()
  render(AppProvider)
} else {
  render(AppProvider)
  console.log()
}
// render(<AppContainer><AppProvider /></AppContainer>, document.getElementById('root'))
