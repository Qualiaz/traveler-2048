import { IPlayer, Direction, IGame } from './interfaces.ts'

export default class Player extends Game implements IPlayer {
  totalScore: number

  timeTravelPoints: number

  controller: {
    up: string
    down: string
    left: string
    right: string
    space: string
  }

  constructor() {
    super()
    this.totalScore = 0
    this.timeTravelPoints = 0
    this.controller = {
      up: '',
      down: '',
      left: '',
      right: '',
      space: ''
    }
  }

  moveBlock(direction: Direction, board: IBoard): IPlayer {
    // implementation here
    return this
  }

  updateScore(board: IBoard): IPlayer {
    // implementation here
    return this
  }
}
