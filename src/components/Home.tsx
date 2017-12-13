import * as React from 'react'
import { Link } from 'react-router-dom'

import Tex from './Tex'

const Home = () => (
  <div>
    <div className="jumbotron">
      <Tex className="container">
        <h1>pi-Base</h1>
        <p>a community database of topological examples supporting expressive searches</p>
        <p>• Find <Link to="/spaces?q=compact%20%2B%20connected%20%2B%20t_2%20%2B%20~metrizable">non-metric continua</Link></p>
        <p>• List spaces described as <Link to="/spaces?text=compactification">compactifications</Link></p>
        <p>• Show counter-examples witnessing that <Link to="/theorems/I000112">$T_5$ ⇒ $T_4$ does not reverse</Link></p>
      </Tex>
    </div>
    <div className="container">
      <h2>Our Purpose</h2>
      <p>
        To paraphrase Mary Ellen Ruden in her{' '}
        <a href="http://www.jstor.org/stable/2318037?origin=crossref&seq=2#page_scan_tab_contents">
          review
        </a>{' '}
        of Lynn Arthur Steen and J. Arthur Seebach, Jr.'s {' '}
        <a href="https://en.wikipedia.org/wiki/Counterexamples_in_Topology">
          Counterexamples in Topology
        </a>:
      </p>
      <blockquote>
         Topology is a dense forest of counterexamples, and a usable map of the forest is a fine thing.
      </blockquote>
      <p>
        Inspired by this quote and the work done by Steen and Seebach,
        the pi-Base serves as a living database that catalogs topological
        spaces, their properties, and the theorems that connect them.
        The{' '}
        <a href="#">pi-Base team</a>{' '}
        hopes that active researchers of general topology
        will benefit from the organization and uniformity provided by the pi-Base, and that mathematicians and students exploring new branches of topology will benefit from having the pi-Base as a guide.
      </p>
      <p>
        <Link to="/about">
          Learn more about the pi-Base. »
        </Link>
      </p>
    </div>
  </div>
)

export default Home
