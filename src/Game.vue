<script setup lang="ts">
import { onUnmounted } from 'vue'
import { allWords } from './words'
import Keyboard from './Keyboard.vue'
import { LetterState } from './types'

// try to guess this by actually playing the game :)
const answer = atob('aGVsbG8=')

class Tile {
  letter = ''
  state = LetterState.INITIAL
}

const board = $ref(
  Array.from({ length: 6 }, () => {
    return Array.from({ length: 5 }, () => new Tile())
  })
)

let allowInput = true
let currentRowIndex = $ref(0)
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
      alert(`"${word}" is not a valid word.`)
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
      requestIdleCallback(() => alert('yay!'))
    } else if (currentRowIndex < board.length - 1) {
      // go the next row
      currentRowIndex++
    } else {
      // game over :(
      allowInput = false
      requestIdleCallback(() => alert('oops'))
    }
  }
}
</script>

<template>
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
    <div class="row" v-for="row in board">
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
</style>
