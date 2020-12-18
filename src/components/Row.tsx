import React from 'react'
import Cell from './Cell'
import {nanoid}  from 'nanoid'

interface IdataID {
  dataId: number
}

const Row: React.FC<IdataID> = ({ dataId }) => {
  const rowArray = [...Array(8)].map((el, index) => {
    return <Cell dataCellId={Number(`${dataId}${index}`)} first={dataId} second={index}  key={nanoid()} />
  })

  return <>{rowArray}</>
}

export default Row
