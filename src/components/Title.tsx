import * as React from 'react'

import { Helmet } from 'react-helmet'

const Title = ({ title }: { title: string }) => (
  <Helmet>
    <title>{title} | π-Base</title>
  </Helmet>
)

export default Title