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

    const newGameEl = document.getElementById('newGame') as HTMLButtonElement

    const howToPlayBtn = document.getElementById(
      'howToPlayBtn'
    ) as HTMLButtonElement

    // OPEN HOW TO PLAY MODAL
    howToPlayBtn.addEventListener('click', () => {
      document.body.insertAdjacentHTML(
        'afterbegin',
        this.generateModalHowToPlayMarkup()
      )
      const howToPlayCloseBtn = document.getElementById(
        'howToPlayCloseBtn'
      ) as HTMLButtonElement
      howToPlayCloseBtn.addEventListener('click', () => {
        document.getElementById('modalHowToPlay')!.remove()
      })
    })

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

  private generateModalHowToPlayMarkup(): string {
    return `        
    <div id="modalHowToPlay" class="modal__how-to-play">
    <div class="how-to-play__container">
      <span class="how-to-play__title">How to play</span>
      <hr />
      <div class="how-to-play__controllers-container">
        <span class="how-to-play__subtitle">Controllers</span>
        <div class="how-to-play__controllers-keys-container">
          <div class="how-to-play__controllers-keys-move-container">
            <span>Move blocks</span>
            <div class="how-to-play__controllers-keys-move-images">
              <div class="how-to-play__controllers-key-up">
                <img src="./src/assets/key-up.svg" alt="" />
                <span>Up</span>
              </div>
              <div class="how-to-play__controllers-key-down">
                <div class="how-to-play__controllers-key-up">
                  <img src="./src/assets/key-down.svg" alt="" />
                  <span>Down</span>
                </div>
              </div>
              <div class="how-to-play__controllers-key-right">
                <div class="how-to-play__controllers-key-up">
                  <img src="./src/assets/key-right.svg" alt="" />
                  <span>Right</span>
                </div>
              </div>
              <div class="how-to-play__controllers-key-left">
                <div class="how-to-play__controllers-key-up">
                  <img src="./src/assets/key-left.svg" alt="" />
                  <span>Left</span>
                </div>
              </div>
            </div>
          </div>
          <hr class="vertical-hr" />
          <div class="how-to-play__controllers-keys-revert-container">
            <span>Revert board</span>
            <div class="how-to-play__controllers-keys-move-images">
              <div class="how-to-play__controllers-key-space">
                <img src="./src/assets/key-space.svg" alt="" />
                <span>Space</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="how-to-play__rules">
        <span class="how-to-play__subtitle">Rules</span>
        <div class="how-to-play__rules-text-container">
          <br />
          <p>
            Traveler 2048 is a single-player sliding tile puzzle game based on
            the original 2048. The objective of the game is to slide numbered
            tiles on a 4x4 grid to combine them and create a tile with the
            number 2048. Every turn, a new block randomly appears in an empty
            spot on the board with a value of either 2, 4, joker or genius.
            Blocks slide as far as possible in the chosen direction until they
            are stopped by either another block or the edge of the grid. If
            two blocks of the same number collide while moving, they will
            merge into a block with the total value of the two blocks that
            collided. If a block representing a genius collides with another
            block, its value will be multiplied by 2. If a tile representing a
            joker collides with another block, its value will be divided by 2.

            <br />
            <br />

            When you move the blocks there is also a chance of 4% that you
            will get a traveler point. You can use those points to revert the
            board back one step. If you have multiple points you can revert
            multiple times. This can help you escape from bad spots or perhaps
            get rid of a joker.

            <br />
            <br />

            The game is won when a tile with a value of 2048 appears on the
            board. Players can continue beyond that to reach higher scores.
          </p>
        </div>
      </div>
      <hr />
      <div class="how-to-play__btn-close-wrapper">
        <button class="how-to-play__Btn-close" id="howToPlayCloseBtn">
          Close
        </button>
      </div>
    </div>
  </div>`
  }

  render(): void {}

  init(): void {
    this.board.initialBoard()
    this.controller()
    this.updateStats()
  }
}
