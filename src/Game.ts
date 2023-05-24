import Board from './Board.ts'
import { IBoard, IGame } from './interfaces.ts'
import generateModalHowToPlayMarkup from './howToPlayModalMarkup.ts'

export default class Game implements IGame {
  board: IBoard
  score: number
  highestScore: number
  travelerPoints: number

  constructor() {
    this.score = 4
    this.highestScore = 0
    this.board = new Board()
    this.travelerPoints = this.board.travelerPoints
  }

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

    // OPEN HOW TO PLAY MODAL
    const howToPlayBtn = document.getElementById(
      'howToPlayBtn'
    ) as HTMLButtonElement
    howToPlayBtn.addEventListener('click', () => {
      document.body.insertAdjacentHTML(
        'afterbegin',
        generateModalHowToPlayMarkup()
      )
      const howToPlayCloseBtn = document.getElementById(
        'howToPlayCloseBtn'
      ) as HTMLButtonElement
      howToPlayCloseBtn.addEventListener('click', () => {
        document.getElementById('modalHowToPlay')!.remove()
      })
    })

    const newGameEl = document.getElementById('newGame') as HTMLButtonElement
    newGameEl.addEventListener('click', () => {
      this.board.resetBoard()
      this.updateTravelerPoints()
      this.updateScore()
    })

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
