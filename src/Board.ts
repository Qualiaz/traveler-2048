import {
  IBoard,
  SpecialItems,
  SpanBlock,
  Direction,
  BlockItem
} from './interfaces.ts'

export default class Board implements IBoard {
  board: BlockItem[][]

  boardHistory: { board: BlockItem[][]; key: Direction | null }[]

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

    // will move
    this.updateBoardHistory({ board: this.board, key: null })
    return this
  }

  spanNumber(): IBoard {
    return this.spanBlock(2)
  }

  private setRandomizedSpecialItem(): IBoard {
    this.specialItem = Math.random() < 0.5 ? 'joker' : 'genius'
    return this
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
    // this.spanNumber()
    this.spanSpecialItem()
    this.moveBlock(direction)
    this.updateBoardHistory({ board: this.board, key: null })
    return this
  }

  updateBoardHistory(newBoard: {
    board: BlockItem[][]
    key: Direction | null
  }): IBoard {
    this.boardHistory.push(newBoard)
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

  moveBlock(direction: Direction): IBoard {
    const newBoard: BlockItem[][] = this.board.map((row) => [...row])

    const isEmptyCell = (row: number, col: number) => newBoard[row][col] === 0

    const moveBlockTo = (
      row: number,
      col: number,
      newRow: number,
      newCol: number
    ) => {
      newBoard[newRow][newCol] = newBoard[row][col]
      newBoard[row][col] = 0
    }

    if (direction === Direction.Up) {
      for (let col = 0; col < 4; col += 1) {
        let newRow = 0
        for (let row = 0; row < 4; row += 1) {
          if (!isEmptyCell(row, col)) {
            if (row !== newRow) {
              moveBlockTo(row, col, newRow, col)
            }
            newRow += 1
          }
        }
      }
    } else if (direction === Direction.Down) {
      for (let col = 0; col < 4; col += 1) {
        let newRow = 3
        for (let row = 3; row >= 0; row -= 1) {
          if (!isEmptyCell(row, col)) {
            if (row !== newRow) {
              moveBlockTo(row, col, newRow, col)
            }
            newRow -= 1
          }
        }
      }
    } else if (direction === Direction.Left) {
      for (let row = 0; row < 4; row += 1) {
        let newCol = 0
        for (let col = 0; col < 4; col += 1) {
          if (!isEmptyCell(row, col)) {
            if (col !== newCol) {
              moveBlockTo(row, col, row, newCol)
            }
            newCol += 1
          }
        }
      }
    } else if (direction === Direction.Right) {
      for (let row = 0; row < 4; row += 1) {
        let newCol = 3
        for (let col = 3; col >= 0; col -= 1) {
          if (!isEmptyCell(row, col)) {
            if (col !== newCol) {
              moveBlockTo(row, col, row, newCol)
            }
            newCol -= 1
          }
        }
      }
    }

    // update the board and history
    this.board = newBoard
    this.updateBoardHistory({ board: this.board, key: direction })

    return this
  }

  controller(): IBoard {
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case this.controllerKeys.up:
          this.updateBoard(Direction.Up)
          break
        case this.controllerKeys.down:
          this.updateBoard(Direction.Down)
          break
        case this.controllerKeys.left:
          this.updateBoard(Direction.Left)
          break
        case this.controllerKeys.right:
          this.updateBoard(Direction.Right)
          break
        default:
          null
      }
      console.log(this.board)
    })

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
