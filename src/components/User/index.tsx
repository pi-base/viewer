import * as React from 'react'
import { graphql, gql } from 'react-apollo'

interface GraphProps {
  me: {
    name: string
  }
}

interface Props {
  data: GraphProps
}

function User(data: any) {
  if (!data.me) { return <span/> }

  return (
    <p>Name: {data.me.name}</p>
  )
}

export default graphql(gql`{
  me {
    name
  }
}`)(User)
