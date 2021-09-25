import React from 'react'
import { Col, Row } from 'react-bootstrap'

import { Space, useStore } from '../../models'
import { Proof, default as S } from '../../models/Store'
import Theorems from '../Theorems/SummaryList.svelte'
import Traits from '../Spaces/Traits'
import { Svelte } from '../Svelte'

export default function ({ space, proof }: { space: Space; proof: Proof }) {
  const store = useStore()

  const theorems = proof.theorems.map((id: string) => S.theorem(store, id)!)
  const properties = proof.properties.map(
    (id: string) => S.property(store, id)!
  )

  return (
    <>
      <p>Automatically deduced from the following</p>
      <Row>
        <Col xs="6">
          <h5>Properties</h5>
          <Traits space={space} properties={properties} filter={false} />
        </Col>
        <Col xs="6">
          <h5>Theorems</h5>
          <Svelte component={Theorems} props={{ theorems }} />
        </Col>
      </Row>
    </>
  )
}
