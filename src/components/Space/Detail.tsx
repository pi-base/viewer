import * as React from 'react'

import { Space } from '../../types'

import Aliases from '../Aliases'
import Markdown from '../Markdown'
import Tex from '../Tex'
import EditLink from '../Form/EditLink';
import { properties } from '../../models/Formula';
import { RouteComponentProps } from 'react-router';
import References from '../References';

type OwnProps = {
  space: Space
  editPreview?: boolean
}
type Props = OwnProps & RouteComponentProps<{}>

const Detail = ({ space, editPreview, match }: Props) => (
  <div>
    <h1>
      <Tex>
        {space.name}
        {space.aliases ? <Aliases aliases={space.aliases} /> : ''}
      </Tex>
    </h1>

    {editPreview
      ? null
      : <EditLink to={match.url + '/edit'} className="btn btn-default btn-sml">
        Edit
      </EditLink>
    }

    <Tex><Markdown text={space.description} /></Tex>

    <References references={space.references} />
  </div>
)

export default Detail