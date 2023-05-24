export type SpecialItems = 'joker' | 'genius'
export type SpanBlock = 2 | SpecialItems
export type BlockItem = number | SpecialItems

export enum Direction {
  Up = 'up',
  Down = 'down',
  Right = 'right',
  Left = 'left',
}

export interface IBoard {
  board: (number | SpecialItems)[][]
  boardHistory: { board: BlockItem[][]; key: Direction | null }[]
  specialItem: SpecialItems
  controllerKeys: {
    up: string
    down: string
    left: string
    right: string
    space: string
  }
  travelerPoints: number

  initialBoard(): IBoard
  spanNumber(): IBoard
  spanSpecialItem(): IBoard
  updateBoard(direction: Direction): IBoard
  // prettier-ignore
  updateBoardHistory(newBoard: { board: BlockItem[][]; key: Direction | null }): IBoard
  revertBoard(steps: number): IBoard
  controller(): IBoard

  initBlockAction(direction: Direction): IBoard
  init(): IBoard
  resetBoard(): IBoard

  // view
  generateBoardMarkup(): string
  render(): HTMLDivElement
  updateDisplay(): IBoard
  initRenderActionBlocks(direction: Direction): IBoard
  animateSpanBlock(block: SpanBlock): IBoard
}

export interface IGame {
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

  gameOver(): IGame
  newGame(): IGame
  updateTravelerPoints(): IGame
  controller(): IGame // new game / how to play / change colors / board controller
  updateScore(): IGame
  init(): void

  render(): void
}
