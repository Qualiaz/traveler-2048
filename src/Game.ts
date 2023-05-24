import Board from './Board.ts'
import { IBoard, IGame } from './interfaces.ts'

export default class Game implements IGame {
  board: IBoard
  score: number
  highestScore: number
  travelerPoints: number
  controllerKeys: {
    up: string
    down: string
    left: string
    right: string
    space: string
  }

  constructor() {
    this.score = 4
    this.highestScore = 0
    this.board = new Board()
    this.travelerPoints = this.board.travelerPoints

    this.controllerKeys = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
      space: 'Space',
    }
  }

  // new game

  // total score
  private getScore(): IGame {
    this.score = 0
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        const cell = document.getElementById(
          `cell-${row * 4 + col + 1}`
        ) as HTMLElement
        this.score += Number(cell.innerText)
      }
    }

    return this
  }

  private updateDisplayScore(): void {
    const scoreEl = document.getElementById('score') as HTMLElement
    scoreEl.innerText = String(this.score)
  }

  updateScore(): IGame {
    this.getScore()
    this.updateDisplayScore()
    return this
  }

  controller(): IGame {
    this.board.controller()

    return this
  }

  private updateStats(): IGame {
    document.addEventListener('boardMoved', () => {
      this.updateTravelerPoints()
      this.updateScore()
    })

    document.addEventListener('boardReverted', () => {
      if (this.board.travelerPoints > 0) {
        this.board.travelerPoints -= 1
      }
      this.updateTravelerPointsDisplay()
    })
    return this
  }

  private setTravelerPoints(): IGame {
    if (Math.random() < 0.04) {
      this.board.travelerPoints += 1
    }

    return this
  }

  private updateTravelerPointsDisplay(): IGame {
    const travelerPointsEl = document.getElementById(
      'travelerPoints'
    ) as HTMLSpanElement
    travelerPointsEl.innerText = String(this.board.travelerPoints)

    return this
  }

  updateTravelerPoints(): IGame {
    this.setTravelerPoints()
    this.updateTravelerPointsDisplay()

    return this
  }

  gameOver(): IGame {
    return this
  }

  newGame(): IGame {
    return this
  }

  render(): void {}

  init(): void {
    this.board.initialBoard()
    this.controller()
    this.updateStats()
  }
}
