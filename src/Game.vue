<script setup lang="ts">
import { onUnmounted } from 'vue'
import { allWords } from './words'
import Keyboard from './Keyboard.vue'
import { LetterState } from './types'

// Pick a random word from dictonary
const answer = allWords[Math.floor(Math.random() * allWords.length)]

class Tile {
  letter = ''
  state = LetterState.INITIAL
}

const board = $ref(
  Array.from({ length: 6 }, () => {
    return Array.from({ length: 5 }, () => new Tile())
  })
)

let message = $ref('')
let allowInput = true
let currentRowIndex = $ref(0)
let shakeRowIndex = $ref(-1)
const currentRow = $computed(() => board[currentRowIndex])

// keep track of revealed letter state for the keyboard
const letterStates: Record<string, LetterState> = $ref({})

window.addEventListener('keyup', onKeyup)
onUnmounted(() => {
  window.removeEventListener('keyup', onKeyup)
})

function onKeyup(e: KeyboardEvent) {
  onKey(e.key)
}

function onKey(key: string) {
  if (!allowInput) return
  if (/^[a-z]$/.test(key)) {
    fillTile(key)
  } else if (key === 'Backspace') {
    clearTile()
  } else if (key === 'Enter') {
    completeRow()
  }
}

function fillTile(letter: string) {
  for (const tile of currentRow) {
    if (!tile.letter) {
      tile.letter = letter
      break
    }
  }
}

function clearTile() {
  for (const tile of [...currentRow].reverse()) {
    if (tile.letter) {
      tile.letter = ''
      break
    }
  }
}

function completeRow() {
  if (currentRow.every((tile) => tile.letter)) {
    const word = currentRow.map((tile) => tile.letter).join('')
    if (!allWords.includes(word) && word !== answer) {
      shake()
      showMessage(`Not in word list`)
      return
    }

    let correct = true
    currentRow.forEach((tile, i) => {
      if (answer.includes(tile.letter)) {
        if (answer[i] === tile.letter) {
          tile.state = letterStates[tile.letter] = LetterState.CORRECT
        } else {
          tile.state = LetterState.PRESENT
          if (!letterStates[tile.letter]) {
            letterStates[tile.letter] = LetterState.PRESENT
          }
          correct = false
        }
      } else {
        tile.state = letterStates[tile.letter] = LetterState.ABSENT
        correct = false
      }
    })
    if (correct) {
      // yay!
      allowInput = false
      showMessage(
        ['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Phew'][
          currentRowIndex
        ],
        2000
      )
    } else if (currentRowIndex < board.length - 1) {
      // go the next row
      currentRowIndex++
    } else {
      // game over :(
      allowInput = false
      showMessage(answer.toUpperCase(), -1)
    }
  } else {
    shake()
    showMessage('Not enough letters')
  }
}

function showMessage(msg: string, time = 1000) {
  message = msg
  if (time > 0) {
    setTimeout(() => {
      message = ''
    }, time)
  }
}

function shake() {
  shakeRowIndex = currentRowIndex
  setTimeout(() => {
    shakeRowIndex = -1
  }, 1000)
}
</script>

<template>
  <Transition>
    <div class="message" v-if="message">{{ message }}</div>
  </Transition>
  <header>
    <h1>VVORDLE</h1>
    <a
      id="source-link"
      href="https://github.com/yyx990803/vue-wordle"
      target="_blank"
      >Source</a
    >
  </header>
  <div id="board">
    <div
      class="row"
      v-for="(row, index) in board"
      :class="{ shake: shakeRowIndex === index }"
    >
      <div
        v-for="(tile, index) in row"
        :class="[
          'tile',
          tile.letter ? 'filled' : 'empty',
          tile.state && 'revealed'
        ]"
      >
        <div class="front" :style="{ transitionDelay: `${index * 200}ms` }">
          {{ tile.letter }}
        </div>
        <div
          :class="['back', tile.state]"
          :style="{ transitionDelay: `${index * 200}ms` }"
        >
          {{ tile.letter }}
        </div>
      </div>
    </div>
  </div>
  <Keyboard @key="onKey" :letter-states="letterStates" />
</template>

<style scoped>
#board {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 5px;
  padding: 10px;
  box-sizing: border-box;
  width: 350px;
  height: 420px;
  margin: 0px auto;
}
.message {
  position: absolute;
  left: 50%;
  top: 80px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.85);
  padding: 16px 20px;
  z-index: 2;
  border-radius: 8px;
  transform: translateX(-50%);
  transition: opacity 0.3s ease-out;
}
.message.v-leave-to {
  opacity: 0;
}
.row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 5px;
}
.tile {
  width: 100%;
  font-size: 2rem;
  line-height: 2rem;
  font-weight: bold;
  vertical-align: middle;
  text-transform: uppercase;
  user-select: none;
  position: relative;
}
.tile .front,
.tile .back {
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.tile .front {
  border: 2px solid #ccc;
}
.tile .back {
  transform: rotateX(180deg);
}
.tile.filled .front {
  border-color: #999;
  animation: zoom 0.2s;
}
.tile:not(.empty) {
  border: none;
}
.tile.revealed .front {
  transform: rotateX(180deg);
}
.tile.revealed .back {
  transform: rotateX(0deg);
}

@keyframes zoom {
  0% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0% {
    transform: translate(1px);
  }
  10% {
    transform: translate(-2px);
  }
  20% {
    transform: translate(2px);
  }
  30% {
    transform: translate(-2px);
  }
  40% {
    transform: translate(2px);
  }
  50% {
    transform: translate(-2px);
  }
  60% {
    transform: translate(2px);
  }
  70% {
    transform: translate(-2px);
  }
  80% {
    transform: translate(2px);
  }
  90% {
    transform: translate(-2px);
  }
  100% {
    transform: translate(1px);
  }
}
</style>
