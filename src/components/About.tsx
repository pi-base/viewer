import * as React from 'react'
import { Link } from 'react-router-dom'

import Tex from './Tex'

const About = () => (
  <div className="container">
    <h2>Contributing and Collaborating</h2>
    <p>
      The pi-Base is a reflection of the results in general topology
      that have been published in peer-reviewed journals and
      textbooks, including appropriate citations. All contributions made
      are open-sourced at{' '}
      <a href="https://github.com/pi-base">github.com/pi-base</a>.
    </p>
    <p>
      Currently, the pi-Base redesign is in beta and may only be edited by
      invited contributors. However, contributions may still be made by opening
      an Issue on the appropriate GitHub repository.
    </p>
    <ul>
      <li>
        To suggest a contribution or edit for our mathematical content:{' '}
        <a href="https://github.com/pi-base/data/issues">pi-base/data</a>
      </li>
      <li>
        To suggest an improvement or report a bug in this web application:{' '}
        <a href="https://github.com/pi-base/viewer/issues">pi-base/viewer</a>
      </li>
    </ul>

    <h3>On Definitions</h3>
    <Tex>
      Notation on the pi-base attempts to be consistent with modern usage.
      For example, we assume definitions for \(T\)-separation axioms such that
      \(T_i \Rightarrow T_j\) whenever \(i \geq j\). A full style-guide{' '}
      <a href="https://github.com/pi-base/viewer/issues/28">is planned</a>.
    </Tex>

    <h2>Our Team</h2>

    <h3>James Dabbs <small>Lead Software Developer</small></h3>
    <p>
      TODO: add info about James. Email:{' '}
      <a href="mailto:jamesdabbs@gmail.com">
        jamesdabbs@gmail.com
      </a>
    </p>

    <h3>Steven Clontz <small>Lead Mathematical Editor</small></h3>
    <p>
      <a href="http://clontz.org">Steven Clontz</a>{' '}
      serves as Assistant Professor of Mathematics at the
      University of South Alabama. His research focuses on game-theoretic
      characterizations of topological properties. When they were in graduate
      school, Steven co-founded a technology start-up
      with James to provide customer relationship management
      services to collegiate music organizations. Email:{' '}
      <a href="mailto:sclontz@southalabama.edu">
        sclontz@southalabama.edu
      </a>
    </p>

    <h2>Acknowledgements</h2>
    <p>Many people have contributed to this project, and all contributions are
      appreciated, but a few individuals deserve special recognition:</p>
    <ul>
      <li>
        <a href="http://www.montevallo.edu/staff-bio/scott-varagona/">
          Scott Varagona
        </a>{' '}
        for his heroic work entering the initial data used in the original
        launch of the database
      </li>
      <li>
        <a href="http://www.auburn.edu/~gruengf/">Gary Gruenhage</a>,
        mentor for James and Steven's theses at Auburn University,
        for all his support and guidance
      </li>
      <li>
        <a href="http://austinmohr.com/home/">Austin Mohr</a>{' '}
        for his work using
        the pi-Base as a pedagogical tool, and all his invaluable feedback
      </li>
      <li>
        Steen and Seebach for writing{' '}
        <a href="https://en.wikipedia.org/wiki/Counterexamples_in_Topology">
          Counterexamples in Topology
        </a>{' '}
        in the first place and inspiring this project
      </li>
    </ul>
    <p>
      We'd like to thank the following organizations for their support
      of the pi-Base platform.
    </p>
    <ul>
      <li>
        <a href="http://www.southalabama.edu/graduatemajors/graduateschool/research.html">
          USA Faculty Development Council
        </a>
      </li>
    </ul>
  </div>
)

export default About
