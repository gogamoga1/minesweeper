import { autorun, reaction } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import React, { useState, useEffect } from 'react'
import store from '../store/store'

interface ICellID {
  dataCellId: number
  first: number
  second: number
}
const calcMinesCount = (first: number, second: number): number => {
  let minesCount = 0
  if (second + 1 <= 7 && store.fieldState?.[first]?.[second + 1] === 1) minesCount += 1
  if (second - 1 >= 0 && store.fieldState?.[first]?.[second - 1] === 1) minesCount += 1
  if (first + 1 <= 8 && store.fieldState?.[first + 1]?.[second] === 1) minesCount += 1
  if (first - 1 >= 0 && store.fieldState?.[first - 1]?.[second] === 1) minesCount += 1
  if (first + 1 <= 8 && second + 1 <= 7 && store.fieldState?.[first + 1]?.[second + 1] === 1)
    minesCount += 1
  if (first + 1 <= 8 && second - 1 >= 0 && store.fieldState?.[first + 1]?.[second - 1] === 1)
    minesCount += 1
  if (first - 1 >= 0 && second + 1 <= 7 && store.fieldState?.[first - 1]?.[second + 1] === 1)
    minesCount += 1
  if (first - 1 >= 0 && second - 1 >= 0 && store.fieldState?.[first - 1]?.[second - 1] === 1)
    minesCount += 1

  return minesCount
}
const recurseCellCount = (first: number, second: number): void => {
  if (store.openedCells.has(Number(`${first}${second}`))) return
  const minecount: number = calcMinesCount(first, second)
  if (minecount > 0) {
    store.setOpenedCells(Number(`${first}${second}`), minecount)
    return
  }
  if (minecount === 0) {
    store.setOpenedCells(Number(`${first}${second}`), minecount)
  }
  second + 1 <= 7 && recurseCellCount(first, second + 1)
  second - 1 >= 0 && recurseCellCount(first, second - 1)
  first + 1 <= 8 && recurseCellCount(first + 1, second)
  first - 1 >= 0 && recurseCellCount(first - 1, second)
  first + 1 <= 8 && second + 1 <= 7 && recurseCellCount(first + 1, second + 1)
  first + 1 <= 8 && second - 1 >= 0 && recurseCellCount(first + 1, second - 1)
  first - 1 >= 0 && second + 1 <= 7 && recurseCellCount(first - 1, second + 1)
  first - 1 >= 0 && second - 1 >= 0 && recurseCellCount(first - 1, second - 1)
}

const Cell: React.FC<ICellID> = observer(({ dataCellId, first, second }) => {


  const hasMine = useLocalObservable(() => ({
    mine: store.checkMine(first, second),
  }))
  const [cellClassName, setCellClassName] = useState<string | null>(null)
  const [cellContent, setCellContent] = useState<number | string>('')
  const [nearbyMines, setNearbyMines] = useState<number>(() => calcMinesCount(first, second))

  const onLeftClick = () => {
    // first mine condition
    if (cellClassName || store.currentStatus === 'GAME_OVER') return
    if (
      hasMine.mine &&
      (store.currentStatus === 'NEW_GAME' || store.currentStatus === 'GAME_RESET')
    ) {
      store.setUpGameBoard()
    }
    if (hasMine.mine && store.currentStatus === 'IN_PROGRESS') {
      setCellClassName('fired')
      store.setGameState('GAME_OVER')
      return
    }
    store.setGameState('IN_PROGRESS')
    setCellClassName('opened')
    setCellContent(nearbyMines > 0 ? nearbyMines : '')
    if (nearbyMines !== 0) store.setOpenedCells(Number(`${first}${second}`), nearbyMines)
    if (nearbyMines === 0) recurseCellCount(first, second)
  }

  const onRightClick = (e: React.MouseEvent) => {
    if (
      (cellClassName !== 'marked' && cellClassName !== null) ||
      store.currentStatus === 'GAME_OVER'
    )
      return
    e.preventDefault()
    if (cellClassName === 'marked') setCellClassName(null), store.setNumOfMines(+1)
    if (cellClassName !== 'marked' && store.minesCount !== 0)
      setCellClassName('marked'), store.setNumOfMines(-1)
  }

  useEffect(() => {
    autorun(() => {
      if (store.currentStatus === 'GAME_RESET') {
        hasMine.mine = store.checkMine(first, second)
        setNearbyMines(calcMinesCount(first, second))
        setCellClassName(null)
        setCellContent('')
      }
    })
  }, [])

  useEffect(() => {
    reaction(
      () => store.openedCells.get(dataCellId),
      (value) => {
        if (value === undefined) return
        setCellClassName('opened')
        value !== 0 && setCellContent(value)
      }
    )
  }, [])

  useEffect(() => {
    reaction(
      () => store.currentStatus,
      (value: string) => {
        if (value === 'GAME_OVER' && hasMine.mine) {
          setCellClassName('fired')
        }
      }
    )
  }, [])

  return (
    <div
      className={'cell' + (cellClassName ? ' ' + cellClassName : '')}
      data-cell-id={dataCellId}
      onClick={onLeftClick}
      onContextMenu={onRightClick}
    >
      {cellContent && cellContent}
    </div>
  )
})

export default Cell
