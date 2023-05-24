import _ from 'lodash'
import {
  IBoard,
  SpecialItems,
  SpanBlock,
  Direction,
  BlockItem,
} from './interfaces.ts'
import './Board.scss'
import imgJoker from './assets/joker-it.png'
import imgGenius from './assets/genius-plato.jpg'

export default class Board implements IBoard {
  board: BlockItem[][]

  boardHistory: { board: BlockItem[][]; key: Direction | null }[]

  specialItem: SpecialItems

  travelerPoints: number

  controllerKeys: {
    up: string
    down: string
    left: string
    right: string
    space: string
  }

  private secondLastBoard: BlockItem[][] = Array.from({ length: 4 }, () =>
    Array(4).fill(0)
  )

  private isSpecialItemOnBoard = false

  constructor() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0))
    this.boardHistory = []
    this.specialItem = Math.random() < 0.5 ? 'joker' : 'genius'
    this.travelerPoints = 0
    this.controllerKeys = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
      space: 'Space',
    }
  }

  resetBoard(): IBoard {
    this.travelerPoints = 0
    this.secondLastBoard = Array.from({ length: 4 }, () => Array(4).fill(0))
    this.boardHistory = []
    this.initialBoard()

    return this
  }

  private didBlocksMove(
    oldBoard: BlockItem[][],
    newBoard: BlockItem[][]
  ): boolean {
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        if (oldBoard[i][j] !== newBoard[i][j]) {
          return true
        }
      }
    }
    return false
  }

  private checkSpecialItemOnBoard(): boolean {
    this.isSpecialItemOnBoard = false
    this.board.forEach((row) => {
      row.forEach((cell) => {
        if (cell === 'joker' || cell === 'genius') {
          this.isSpecialItemOnBoard = true
        }
      })
    })

    return this.isSpecialItemOnBoard
  }

  initialBoard(): IBoard {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0))
    this.spanNumber()
    this.spanNumber()

    this.updateBoardHistory({ board: this.board, key: null })
    this.updateDisplay()

    return this
  }

  updateBoard(direction: Direction): IBoard {
    this.secondLastBoard = _.cloneDeep(this.board)
    this.initBlockAction(direction)
    const blocksMoved = this.didBlocksMove(this.secondLastBoard, this.board)
    this.checkSpecialItemOnBoard()

    if (blocksMoved) {
      const event = new Event('boardMoved')
      document.dispatchEvent(event)

      if (Math.random() < 0.1 && !this.isSpecialItemOnBoard) {
        this.spanSpecialItem()
      } else {
        this.spanNumber()
      }
      this.updateBoardHistory({ board: this.board, key: Direction.Up })
    }

    this.updateDisplay()

    return this
  }

  updateBoardHistory(newBoard: {
    board: BlockItem[][]
    key: Direction | null
  }): IBoard {
    const boardCopy = _.cloneDeep(newBoard)
    this.boardHistory.push(boardCopy)
    return this
  }

  private removeLastBoardFromHistory(): IBoard {
    this.boardHistory.pop()
    return this
  }

  revertBoard(): IBoard {
    console.log(this.travelerPoints)
    if (this.boardHistory.length < 2 || !this.travelerPoints) return this
    this.board = _.cloneDeep(
      this.boardHistory[this.boardHistory.length - 2].board
    )
    this.removeLastBoardFromHistory()
    this.updateDisplay()

    const boardRevertedEvent = new Event('boardReverted')
    document.dispatchEvent(boardRevertedEvent)

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
          return 'joker'
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

    const currentValue = this.board[rowIndex][colIndex]

    const prevValue = isHorizontal ? this.board[rowIndex][colIndex - 1] : null

    if (nextValue === 0 && !prevValue) return this
    // if (currentValue === 0) return this

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
            // this.moveBlock(direction)
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

  /* eslint-disable class-methods-use-this */
  generateBoardMarkup(): string {
    return ''
  }

  controller(): IBoard {
    document.addEventListener('keydown', (e) => {
      switch (e.code) {
        case this.controllerKeys.up:
          this.updateBoard(Direction.Up)
          //prevents in case of up and down scrolling
          e.preventDefault()
          break
        case this.controllerKeys.down:
          this.updateBoard(Direction.Down)
          e.preventDefault()
          break
        case this.controllerKeys.left:
          this.updateBoard(Direction.Left)
          break
        case this.controllerKeys.right:
          this.updateBoard(Direction.Right)
          break
        case 'KeyH':
          console.log(this.boardHistory)
          break
        case this.controllerKeys.space:
          this.revertBoard()
          break
        default:
          console.log('no key')
      }
    })
    return this
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
        this.updateColor(cell)
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
        this.updateColor(cell)
      }
    }
    return this
  }

  private updateColor(cell: HTMLElement): IBoard {
    const cellNumber = Number(cell.innerText)
    switch (cellNumber) {
      case 0:
        cell.style.backgroundColor = '#1f1f1f'
        break
      case 2:
        cell.style.backgroundColor = '#F8E3BC'
        break
      case 4:
        cell.style.backgroundColor = '#FDD891'
        break
      case 8:
        cell.style.backgroundColor = '#FEBE46'
        break
      case 16:
        cell.style.backgroundColor = '#E9B3A7'
        break
      case 32:
        cell.style.backgroundColor = '#E49887'
        break
      case 64:
        cell.style.backgroundColor = '#E77056'
        break
      case 128:
        cell.style.backgroundColor = '#E5DE92'
        break
      case 256:
        cell.style.backgroundColor = '#DBCF5B'
        break
      case 512:
        cell.style.backgroundColor = '#DFCB03'
        break
      case 1024:
        cell.style.backgroundColor = '#7ACD53'
        break
      case 2048:
        cell.style.backgroundColor = '#4470E2'
        break
      default:
        cell.style.backgroundColor = '#681875'
        break
    }

    return this
  }

  initRenderActionBlocks(direction: Direction): IBoard {
    console.log(direction)
    return this
  }

  animateSpanBlock(block: SpanBlock): IBoard {
    console.log(block)
    return this
  }

  init(): IBoard {
    this.controller()

    return this
  }
}
