<script setup lang="ts">
import { getWordOfTheDay, wordInDictionary } from "./words"
import Maker from "./Maker.vue"
import Board from "./Board.vue"

const { word } = getWordOfTheDay()
</script>

<template>
  <header>
    <h1>CURDLE</h1>
    <h2><span>cu</span>stom wo<span>rdle</span></h2>
    <a v-if="word" id="source-link" href="/">New</a>
  </header>
  <Board v-if="word" :answer="word"></Board>
  <Maker v-else></Maker>
</template>
