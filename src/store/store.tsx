import { makeAutoObservable } from 'mobx'
let generateTenMines = 10
function shuffle(array: number[][]) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}
function generateArrayWithMines(): number[][] {
  const tempArray: number[][] = [...Array(9)].map(() => {
    return [...Array(8)].map(() =>
      Math.random() > 0.7 && generateTenMines > 0 ? (generateTenMines--, 1) : 0
    )
  })
  return shuffle(tempArray)
}

class Store {
  constructor() {
    makeAutoObservable(this)
  }

  fieldState: number[][] = generateArrayWithMines()
  gameState = 'NEW_GAME'
  openedCells = new Map<number,number>()

  setOpenedCells(value: number, count: number): void {
    this.openedCells.set(value, count)
    this.openedCells.size === 62 && this.minesCount === 0 ? this.setGameState('GAME_WON') : null
  }

  minesCount: number = (() => {
    return this.fieldState.reduce((acc, cur) => {
      cur.forEach((item) => (item === 1 ? (acc += 1) : null))
      return acc
    }, 0)
  })()

  get numOfMines() {
    return this.fieldState.reduce((acc, cur) => {
      cur.forEach((item) => (item === 1 ? (acc += 1) : null))
      return acc
    }, 0)
  }
  setNumOfMines(value: number) {
    this.minesCount += value
  }
  checkMine(first: number, second: number): boolean {
    return this.fieldState[first][second] === 1
  }

  setGameState(value: string) {
    this.gameState = value
  }

  setUpGameBoard(): void {
    generateTenMines = 10
    this.openedCells.clear()
    this.fieldState = generateArrayWithMines()
    this.setGameState('GAME_RESET')
    this.minesCount = this.numOfMines
  }

  get currentStatus() {
    return this.gameState
  }
}

export default new Store()
