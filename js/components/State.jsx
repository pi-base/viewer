import React from 'react'
import {connect} from 'react-redux'

import JSONTree from 'react-json-tree'

const State = ({ state }) => {
  return (
    <div>
      <strong>Redux State</strong>
      <JSONTree data={state}/>
    </div>
  )
}

export default connect(
  (state) => { return { state } }
)(State)
