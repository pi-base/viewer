import React from 'react'

import Icon from './Icon'

class Limiter extends React.Component {
  render() {
    const { limit, found, total, onClick } = this.props

    let icon, text

    if (limit && total > limit) {
      icon = "chevron-down"
      text = `Show All ${total}`
    } else if (found > limit) {
      icon = "chevron-up"
      text = "Collapse"
    } else {
      return <span/>
    }

    return <div className="limiter">
      <button
        className="btn btn-default btn-sm pull-right"
        onClick={onClick}
      >
        <Icon type={icon}/>
        {' ' + text}
      </button>
    </div>
  }
}

export default Limiter
