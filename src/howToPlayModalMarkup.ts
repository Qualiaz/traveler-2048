import keyDownSvg from './assets/key-down.svg'
import keyUpSvg from './assets/key-up.svg'
import keyRightSvg from './assets/key-right.svg'
import keyLeftSvg from './assets/key-right.svg'
import keySpaceSvg from './assets/key-space.svg'

const generateModalHowToPlayMarkup = (): string => {
  return `        
    <div id="modalHowToPlay" class="modal__how-to-play">
    <div class="how-to-play__container animate">
      <span class="how-to-play__title">How to play</span>
      <hr />
      <div class="how-to-play__controllers-container">
        <span class="how-to-play__subtitle">Controllers</span>
        <div class="how-to-play__controllers-keys-container">
          <div class="how-to-play__controllers-keys-move-container">
            <span>Move blocks</span>
            <div class="how-to-play__controllers-keys-move-images">
              <div class="how-to-play__controllers-key-up">
                <img src="${keyUpSvg}" alt="" />
                <span>Up</span>
              </div>
              <div class="how-to-play__controllers-key-down">
                <div class="how-to-play__controllers-key-up">
                  <img src="${keyDownSvg}" alt="" />
                  <span>Down</span>
                </div>
              </div>
              <div class="how-to-play__controllers-key-right">
                <div class="how-to-play__controllers-key-up">
                  <img src="${keyRightSvg}" alt="" />
                  <span>Right</span>
                </div>
              </div>
              <div class="how-to-play__controllers-key-left">
                <div class="how-to-play__controllers-key-up">
                  <img src="${keyLeftSvg}" alt="" />
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
                <img src="${keySpaceSvg}" alt="" />
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

export default generateModalHowToPlayMarkup
