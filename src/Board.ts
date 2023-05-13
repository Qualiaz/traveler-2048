import {
  IBoard,
  SpecialItems,
  SpanBlock,
  Direction,
  BlockItem
} from './interfaces.ts'

export default class Board implements IBoard {
  board: (number | SpecialItems)[][]

  boardHistory: { board: number[][]; key: Direction | null }[]

  specialItem: SpecialItems

  controllerKeys: {
    up: string
    down: string
    left: string
    right: string
    space: string
  }

  constructor() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0))
    this.boardHistory = []
    this.specialItem = Math.random() < 0.5 ? 'joker' : 'genius'
    this.controllerKeys = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
      space: 'Space'
    }
  }

  initialBoard(): IBoard {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0))
    this.spanNumber()
    this.spanNumber()
    console.log(this.board)
    return this
  }

  spanNumber(): IBoard {
    return this.spanBlock(2)
  }

  spanSpecialItem(): IBoard {
    return this.spanBlock(this.specialItem)
  }

  private spanBlock(block: SpanBlock): IBoard {
    // find all empty cells
    const emptyCells = this.board.reduce((acc, row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          acc.push({ row: rowIndex, col: colIndex })
        }
      })
      return acc
    }, [] as { row: number; col: number }[])

    // if there are no empty cells, do nothing
    if (emptyCells.length === 0) return this

    // randomly select an empty cell and insert the block
    const index = Math.floor(Math.random() * emptyCells.length)
    const { row, col } = emptyCells[index]
    this.board[row][col] = block

    return this
  }

  updateBoard(direction: Direction): IBoard {
    return this
  }

  updateBoardHistory(newBoard: { board: number[][]; key: Direction }): IBoard {
    return this
  }

  revertBoard(steps: number): IBoard {
    return this
  }

  /* eslint-disable class-methods-use-this */
  randomizeSpecialItem(): SpecialItems {
    return 'joker'
  }

  /* eslint-disable class-methods-use-this */
  combineNumbers(first: number, second: number): number {
    return first + second
  }

  moveBlock(block: number): IBoard {
    return this
  }

  controller(): IBoard {
    return this
  }

  /* eslint-disable class-methods-use-this */
  generateBoardMarkup(): string {
    return ''
  }

  render(): HTMLDivElement {
    return document.createElement('div')
  }

  updateDisplay(): IBoard {
    return this
  }

  animateMove(direction: Direction): IBoard {
    return this
  }

  animateSpanBlock(block: SpanBlock): IBoard {
    return this
  }
}
