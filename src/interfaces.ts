export type SpecialItems = 'joker' | 'genius'
export type SpanBlock = 2 | SpecialItems
export type BlockItem = number | SpecialItems

export enum Direction {
  Up = 'up',
  Down = 'down',
  Right = 'right',
  Left = 'left',
  Reverse = 'reverse'
}

export interface IBoard {
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

  initialBoard(): IBoard
  spanNumber(): IBoard
  spanSpecialItem(): IBoard
  updateBoard(direction: Direction): IBoard
  updateBoardHistory(newBoard: { board: number[][]; key: Direction }): IBoard
  revertBoard(steps: number): IBoard
  randomizeSpecialItem(): SpecialItems
  combineNumbers(first: number, second: number): number
  moveBlock(block: number): IBoard

  // controller
  controller(): IBoard

  // view
  generateBoardMarkup(): string
  render(): HTMLDivElement
  updateDisplay(): IBoard
  animateMove(direction: Direction): IBoard
  animateSpanBlock(block: SpanBlock): IBoard
}

export interface IGame {
  board: IBoard
  score: number
  highestScore: number
  timeTravelPoints: number
  gameOver(): IGame
  newGame(): IGame

  controller(): IGame // new game / how to play / change colors / board controller

  displayScore(): IGame
  render(): void
  on(): void
}
