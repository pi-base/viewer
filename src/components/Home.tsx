import * as React from 'react'
import { Link } from 'react-router-dom'

import Tex from './Tex'

const Home = () => (
  <div>
    <div className="jumbotron">
      <div className="container">
        <h1>π-Base</h1>
        <p>a community database of topological examples with expressive searches like</p>
        <p>□ <Link to="/spaces?q=compact%20%2B%20connected%20%2B%20t_2%20%2B%20~metrizable">Non-metric continua</Link></p>
        <p>□ <Link to="/spaces?text=compactification">Compactifications</Link></p>
        <p>□ <Link to="/theorems/I000112">Evidence that $T_5$ ⇒ $T_4$ does not reverse</Link></p>
      </div>
    </div>
    <div className="container">
      <h2>Contributing and Collaborating</h2>
      <div className="alert alert-info">
        <p><span className="glyphicon glyphicon-alert" /> There is a major
          data cleanup and standardization effort underway
          <a href="https://github.com/jamesdabbs/pi-base-data">on Github</a>.
          Data will be in-flux while that effort is in progress.
        </p>
      </div>
      <p>See something wrong? Want to add a property or theorem of your own?</p>
      <p>The data powering this site is hosted
        <a href="https://github.com/jamesdabbs/pi-base-data">on Github</a>
        and pull requests are welcome. If you're interested in getting involved
        but unsure about how this all works, do feel free to post an issue on the
        <a href="http://github.com/jamesdabbs/pi-base-viewer/issues">issue tracker</a>
        or get in touch <a href="mailto:jamesdabbs@gmail.com">by email</a>.
      </p>

      <h3>On Definitions</h3>
      <Tex>
        We have broken with Counterexamples in a few notable places, mostly to
        update things like the separation axioms to their more modern useage
        (where $T_i$ ⇒ $T_j$ whenever $i > j$). Our definitions should
        match those given in e.g.
        <a href="http://www.amazon.com/General-Topology-Dover-Books-Mathematics/dp/0486434796">
          Willard's <i>General Topology</i></a>.
      </Tex>

      <h3> Acknowledgements</h3>
      <p> Many people have contributed to this project, and all contributions are
        appreciated, but a few individuals deserve special recognition:</p>
      <ul>
        <li>
          <a href="http://clontz.org/">Steven Clontz</a> for continued advice and friendship</li>
        <li>
          <a href="http://www.montevallo.edu/staff-bio/scott-varagona/">Scott Varagona</a>
          for his heroic work entering data into the database</li>
        <li>
          My advisor, <a href="http://www.auburn.edu/~gruengf/">Gary Gruenhage</a>
          for all his support and guidance</li>
        <li>
          <a href="http://austinmohr.com/home/">Austin Mohr</a> for his work using
          the 𝜋-Base as a pedagogical tool, and all his invaluable feedback</li>
        <li>
          Steen and Seebach for writing
          <a href="http://www.amazon.com/Counterexamples-Topology-Dover-Books-Mathematics/dp/048668735X">
            Counterexamples in Topology</a> in the first place and inspiring this project</li>
      </ul>
    </div>
    </div>
)

export default Home
