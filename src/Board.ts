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
    this.spanSpecialItem()

    // will move
    this.updateBoardHistory({ board: this.board, key: null })
    console.log(this.board)
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
    this.setRandomizedSpecialItem()
    this.spanBlock(this.specialItem)
    return this
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
    }, [] as { row: BlockItem; col: BlockItem }[])

    // if there are no empty cells, do nothing
    if (emptyCells.length === 0) return this

    // randomly select an empty cell and insert the block
    const index = Math.floor(Math.random() * emptyCells.length)
    const { row, col } = emptyCells[index]
    this.board[row as number][col as number] = block

    return this
  }

  updateBoard(direction: Direction): IBoard {
    this.moveBlock(direction)
    console.log(this.board)
    this.mergeBlocks(direction)

    if (Math.random() < 0.1) {
      this.spanSpecialItem()
    } else {
      this.spanNumber()
    }
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
  // prettier-ignore
  moveBlock(direction: Direction): IBoard {
    const checkNextCell = (cell: [number, number]): BlockItem => {
        const [row, col] = cell;
        if (direction === Direction.Right) {
            return this.board[row][col + 1];
        }
        if (direction === Direction.Left) {
            return this.board[row][col - 1];
        }
        return 'joker';
    };

    const moveCellsHorizontal = (rowIndex: number, colIndex: number, nextColIndex: number) => {
        const curCell = this.board[rowIndex][colIndex];
        const nextCell = checkNextCell([rowIndex, colIndex]);
        if (nextCell === undefined || !curCell) return;

        if (nextCell === 0 && curCell) {
          console.log(curCell)
            while (this.board[rowIndex][nextColIndex] === 0) {
                this.board[rowIndex][nextColIndex] = this.board[rowIndex][nextColIndex + (direction === Direction.Right ? -1 : 1)];
                this.board[rowIndex][nextColIndex + (direction === Direction.Right ? -1 : 1)] = 0;
                nextColIndex += direction === Direction.Right ? 1 : -1;
            }
        }
    };

    if (direction === Direction.Right) {
        for (let rowIndex = 0; rowIndex < this.board.length; rowIndex += 1) {
            for (let colIndex = 3; colIndex >= 0; colIndex -= 1) {
                moveCellsHorizontal(rowIndex, colIndex, colIndex + 1);
            }
        }
    } else if (direction === Direction.Left) {
        for (let rowIndex = 0; rowIndex < this.board.length; rowIndex += 1) {
            for (let colIndex = 0; colIndex < this.board[rowIndex].length; colIndex += 1) {
                moveCellsHorizontal(rowIndex, colIndex, colIndex - 1);
            }
        }
    }

    return this;
}

  mergeBlocks(direction: Direction): IBoard {
    const mergeCellsHorizontal = (
      rowIndex: number,
      colIndex: number,
      nextColIndex: number
    ) => {
      if (this.board[rowIndex][nextColIndex] === 0) return

      if (
        this.board[rowIndex][colIndex] === this.board[rowIndex][nextColIndex] ||
        this.board[rowIndex][nextColIndex] === 'genius' ||
        this.board[rowIndex][colIndex] === 'genius'
      ) {
        if (typeof this.board[rowIndex][colIndex] === 'number')
          this.board[rowIndex][colIndex] =
            (this.board[rowIndex][colIndex] as number) * 2
        else
          this.board[rowIndex][colIndex] =
            (this.board[rowIndex][nextColIndex] as number) * 2
        // if the cur cell is a genius, multiply the other one

        this.board[rowIndex][nextColIndex] = 0
      }
      //
      else if (
        this.board[rowIndex][nextColIndex] === 'joker' ||
        this.board[rowIndex][colIndex] === 'joker'
      ) {
        if (typeof this.board[rowIndex][colIndex] === 'number')
          this.board[rowIndex][colIndex] =
            (this.board[rowIndex][colIndex] as number) > 2
              ? (this.board[rowIndex][colIndex] as number) / 2
              : 0
        else
          this.board[rowIndex][colIndex] =
            (this.board[rowIndex][nextColIndex] as number) * 2

        this.board[rowIndex][nextColIndex] = 0
      }
      //
      else {
        this.moveBlock(direction)
      }
    }

    if (direction === Direction.Right) {
      for (let rowIndex = 0; rowIndex < this.board.length; rowIndex += 1) {
        for (
          let colIndex = this.board[rowIndex].length - 1;
          colIndex >= 0;
          colIndex -= 1
        ) {
          const prevColIndex = colIndex - 1
          if (prevColIndex >= 0) {
            mergeCellsHorizontal(rowIndex, colIndex, prevColIndex)
          }
        }
      }
    }

    if (direction === Direction.Left) {
      for (let rowIndex = 0; rowIndex < this.board.length; rowIndex += 1) {
        for (
          let colIndex = 0;
          colIndex < this.board[rowIndex].length;
          colIndex += 1
        ) {
          const nextColIndex = colIndex + 1
          if (nextColIndex < this.board[rowIndex].length) {
            mergeCellsHorizontal(rowIndex, colIndex, nextColIndex)
          }
        }
      }
    }

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
          console.log('no key')
      }
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
