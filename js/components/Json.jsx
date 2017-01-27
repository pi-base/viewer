import React from 'react'

const Json = ({ value }) => {
  if (!value) { return null }

  return (
    <pre>{JSON.stringify(value, null, 2)}</pre>
  )
}

export default Json
