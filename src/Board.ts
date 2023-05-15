import {
  IBoard,
  SpecialItems,
  SpanBlock,
  Direction,
  BlockItem
} from './interfaces.ts'
import './Board.scss'

import imgJoker from './assets/joker-it.png'
import imgGenius from './assets/genius-plato.jpg'

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

    this.updateBoardHistory({ board: this.board, key: null })
    this.updateDisplay()
    return this
  }

  spanNumber(): IBoard {
    return this.spanBlock(2)
  }

  private areLastTwoBoardsEqual(
    arr: { board: BlockItem[][]; key: Direction | null }[]
  ): boolean {
    if (arr.length < 2) return false
    const lastBoard = JSON.stringify(arr[arr.length - 1].board)
    const secondLastBoard = JSON.stringify(arr[arr.length - 2].board)
    return lastBoard === secondLastBoard
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
    this.initBlockAction(direction)

    if (!this.areLastTwoBoardsEqual(this.boardHistory)) {
      if (Math.random() < 0.1) {
        this.spanSpecialItem()
      } else {
        this.spanNumber()
      }
    }

    // console.log('HOW MANY TIMES')
    this.updateBoardHistory({ board: this.board, key: Direction.Up })
    console.log(this.board)
    this.updateDisplay()

    return this
  }

  updateBoardHistory(newBoard: {
    board: BlockItem[][]
    key: Direction | null
  }): IBoard {
    const boardCopy = JSON.parse(JSON.stringify(newBoard))
    this.boardHistory.push(boardCopy)
    return this
  }

  revertBoard(steps: number): IBoard {
    console.log(steps)
    return this
  }

  /* eslint-disable class-methods-use-this */
  // prettier-ignore
  private moveBlock(direction: Direction): IBoard {
      const checkNextCell = (cell: [number, number]): BlockItem => {
          const [row, col] = cell;
          if (direction === Direction.Right) {
              return this.board[row][col + 1];
          }
          if (direction === Direction.Left) {
              return this.board[row][col - 1];
          }
          if (direction === Direction.Down) {
            return this.board[row + 1] && this.board[row + 1][col];
          }
          if (direction === Direction.Up) {
            return this.board[row - 1] && this.board[row - 1][col];
          }
          return 'joker';
      };

      const moveCellsHorizontal = (rowIndex: number, colIndex: number, nextColIndex: number) => {
          const curCell = this.board[rowIndex][colIndex];
          const nextCell = checkNextCell([rowIndex, colIndex]);
          if (nextCell === undefined || !curCell) return;

          if (nextCell === 0 && curCell) {
              while (this.board[rowIndex][nextColIndex] === 0) {
                  this.board[rowIndex][nextColIndex] = this.board[rowIndex][nextColIndex + (direction === Direction.Right ? -1 : 1)];
                  this.board[rowIndex][nextColIndex + (direction === Direction.Right ? -1 : 1)] = 0;
                  nextColIndex += direction === Direction.Right ? 1 : -1;
              }
          }
      };

      const moveCellsVertical = (rowIndex: number, colIndex: number, nextRowIndex: number) => {
        const curCell = this.board[rowIndex][colIndex];
        const nextCell = checkNextCell([rowIndex, colIndex]);
        if (nextCell === undefined || !curCell) return;
    
        if (nextCell === 0 && curCell) {
          while (this.board[nextRowIndex] && this.board[nextRowIndex][colIndex] === 0) {
            this.board[nextRowIndex][colIndex] = this.board[nextRowIndex + (direction === Direction.Down ? -1 : 1)][colIndex];
            this.board[nextRowIndex + (direction === Direction.Down ? -1 : 1)][colIndex] = 0;
            nextRowIndex += direction === Direction.Down ? 1 : -1;
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
      } else if (direction === Direction.Down) {
        for (let colIndex = 0; colIndex < this.board[0].length; colIndex += 1) {
            for (let rowIndex = this.board.length - 2 ; rowIndex >= 0 ; rowIndex -= 1 ) {
            moveCellsVertical(rowIndex, colIndex, rowIndex + 1);
          }
        }
      }
        else if(direction === Direction.Up){
          for(let colIndex = 0; colIndex < this.board[0].length; colIndex += 1){
            for(let rowIndex = 1; rowIndex < this.board.length; rowIndex += 1){
              moveCellsVertical(rowIndex,colIndex,rowIndex - 1)
          }
        }
      }

      return this;
  }

  private mergeBlocks(
    rowIndex: number,
    colIndex: number,
    nextIndex: number,
    isHorizontal: boolean
  ): IBoard {
    const nextValue = isHorizontal
      ? this.board[rowIndex][nextIndex]
      : this.board[nextIndex][colIndex]

    if (nextValue === 0) return this

    const currentValue = this.board[rowIndex][colIndex]

    if (
      currentValue === nextValue ||
      nextValue === 'genius' ||
      currentValue === 'genius'
    ) {
      if (typeof currentValue === 'number')
        this.board[rowIndex][colIndex] = (currentValue as number) * 2
      else this.board[rowIndex][colIndex] = (nextValue as number) * 2
      // if the cur cell is a genius, multiply the other one

      if (isHorizontal) this.board[rowIndex][nextIndex] = 0
      else this.board[nextIndex][colIndex] = 0
    }
    //
    if (nextValue === 'joker' || currentValue === 'joker') {
      if (typeof currentValue === 'number')
        this.board[rowIndex][colIndex] =
          (currentValue as number) > 2 ? (currentValue as number) / 2 : 0
      else
        this.board[rowIndex][colIndex] =
          (nextValue as number) > 2 ? (nextValue as number) / 2 : 0

      if (isHorizontal) this.board[rowIndex][nextIndex] = 0
      else this.board[nextIndex][colIndex] = 0
    }

    return this
  }

  initBlockAction(direction: Direction): IBoard {
    if (direction === Direction.Right) {
      for (let rowIndex = 0; rowIndex < this.board.length; rowIndex += 1) {
        for (
          let colIndex = this.board[rowIndex].length - 1;
          colIndex >= 0;
          colIndex -= 1
        ) {
          const prevColIndex = colIndex - 1
          if (prevColIndex >= 0) {
            this.moveBlock(direction)
            this.mergeBlocks(rowIndex, colIndex, prevColIndex, true)
            this.moveBlock(direction)
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
            this.moveBlock(direction)
            this.mergeBlocks(rowIndex, colIndex, nextColIndex, true)
            this.moveBlock(direction)
          }
        }
      }
    }

    if (direction === Direction.Down) {
      for (let colIndex = 0; colIndex < this.board[0].length; colIndex += 1) {
        for (
          let rowIndex = this.board.length - 1;
          rowIndex >= 0;
          rowIndex -= 1
        ) {
          const prevRowIndex = rowIndex - 1
          if (prevRowIndex >= 0) {
            this.moveBlock(direction)
            this.mergeBlocks(rowIndex, colIndex, prevRowIndex, false)
            this.moveBlock(direction)
          }
        }
      }
    }

    if (direction === Direction.Up) {
      for (let colIndex = 0; colIndex < this.board[0].length; colIndex += 1) {
        for (let rowIndex = 0; rowIndex < this.board.length; rowIndex += 1) {
          const nextRowIndex = rowIndex + 1
          if (nextRowIndex < this.board.length) {
            this.moveBlock(direction)
            this.mergeBlocks(rowIndex, colIndex, nextRowIndex, false)
            this.moveBlock(direction)
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
        case 'h':
          console.log(this.boardHistory)
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
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        const cell = document.getElementById(
          `cell-${row * 4 + col + 1}`
        ) as HTMLElement
        cell.innerText = ''
        if (this.board[row][col] === 0) continue

        if (this.board[row][col] === 'joker') {
          const jokerImg = document.createElement('img')
          jokerImg.src = imgJoker
          cell.appendChild(jokerImg)
          continue
        }
        if (this.board[row][col] === 'genius') {
          const geniusImg = document.createElement('img')
          geniusImg.src = imgGenius
          cell.appendChild(geniusImg)
          continue
        }
        cell.innerText = this.board[row][col] as string
      }
    }

    return this
  }

  animateMove(direction: Direction): IBoard {
    console.log(direction)
    return this
  }

  animateSpanBlock(block: SpanBlock): IBoard {
    console.log(block)
    return this
  }
}
