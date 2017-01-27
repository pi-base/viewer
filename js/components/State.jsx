import React from 'react'
import {connect} from 'react-redux'

const State = ({ state }) => {
    return (
        <pre>{JSON.stringify(state, null, 2)}</pre>
    )
}

export default connect(
    (state) => { return { state } }
)(State)
