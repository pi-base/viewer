import * as React from 'react'

import { Citation } from '../../types'
import EditLink from '../Form/EditLink'
import Markdown from '../Markdown'
import References from '../References'
import Tex from '../Tex'
import { withRouter } from 'react-router'

interface Detailable {
  description: string
  references: Citation[]
}

type Props<T extends Detailable> = {
  object: T
  showEditLink?: boolean
  children: React.ReactNode
}

const Edit = withRouter(({ match }) => (
  <EditLink to={match.url + '/edit'} className="btn btn-default btn-xs">
    Edit
  </EditLink>
))

const Detail = <T extends Detailable>({ object, showEditLink, children }: Props<T>) => (
  <div>
    <h1>
      {children}
      {showEditLink !== false && <Edit />}
    </h1>
    <Tex><Markdown text={object.description} /></Tex>

    <References references={object.references} />
  </div>
)

export default Detail