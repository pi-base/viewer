import { connect } from 'react-redux'

const U = connect(
  (state) => {
    return {
      universe: state.get('universe')
    }
  }
)

export default U
