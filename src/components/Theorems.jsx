import React from 'react'
import Relay from 'react-relay'
import { Link } from 'react-router'

import Formula from './Formula'
import Tex from './Tex'
import U from './U'

class Theorems extends React.Component {
  hydrate(theorem) {
    const t = this.props.universe.hydrateTheorem(theorem)

    return <span>
      <Formula formula={t.antecedent} link={false}/>
      {' ⇒ '}
      <Formula formula={t.consequent} link={false}/>
    </span>
  }

  render() {
    const theorems = this.props.viewer.theorems.slice(0, 10)

    return (
      <section className="theorems">
        <h1>Theorems</h1>
        {theorems.map(t =>
          <Tex key={t.uid}>
            <h3>
              <Link to={`/theorems/${t.uid}`}>
                {this.hydrate(t.name)}
              </Link>
            </h3>
            <div>{t.preview}</div>
          </Tex>
        )}
      </section>
    )
  }
}

export default Relay.createContainer(U(Theorems), {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        theorems {
          uid
          name
          preview
        }
      }
    `
  }
})
