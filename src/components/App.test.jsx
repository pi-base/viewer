import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'


// N.B. we appear to have some problems with jsdom / history
// TODO: resolve these, add --env=jsdom to `npm test`, fix router history
it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render( < App / > , div)
})
