import React from 'react'
import { observer } from 'mobx-react-lite'

import Row from './Row'
import {nanoid}  from 'nanoid'

const Field = observer(() => {
  const fieldArray = [...Array(9)].map((el, index) => {
    return <Row dataId={index} key={nanoid()} />
  })

  return <div className='field'>{fieldArray}</div>
})

export default Field
