import React, { PropTypes } from 'react'

import * as I from 'immutable'

class Suggestions extends React.Component {
  render() {
    const { suggestions, selected, visible, onSelect } = this.props

    const divStyle = {
      display:   (visible ? 'block' : 'none'),
      marginTop: '5px'
    }

    return (
      <div className="list-group" style={divStyle}>
        {suggestions.map((p,i) =>
          <a
            className={"list-group-item " + (selected === i ? "active" : "")}
            key={p.get('uid')}
            onMouseDown={() => onSelect(i)}
            href="#">
            {p.get('name')}
          </a>
        )}
      </div>
    )
  }
}

Suggestions.propTypes = {
  suggestions: PropTypes.instanceOf(I.List), // TODO: isRequired
  selected:    PropTypes.number.isRequired,
  visible:     PropTypes.bool.isRequired,
  onSelect:    PropTypes.func.isRequired
}

export default Suggestions
