<template>
  <Message :message="message"></Message>
  <form id="maker" @submit="copyLinkToClipboard">
    <p>Enter a 5-letter word:</p>
    <p><input type="text" v-model="word" /></p>
    <p class="indicator">{{ indication }}</p>
    <p><b>Optional:</b> Who created this Curdle?</p>
    <p><input type="text" v-model="sender" /></p>
    <div class="link">
      <p>Copy this link to share your Curdle:</p>
      <p>
        <a :href="link">{{ link }}</a>
      </p>
      <p><input type="submit" value="COPY" /></p>
    </div>
  </form>
</template>

<script setup lang="ts">
import Message from "./Message.vue"
import { indications, wordInDictionary } from "./words"

let word = $ref("")
let indication = $ref("")
let sender = $ref("")

let message = $ref("")
let link = $computed(
  () => `${location.origin}${location.pathname}?game=${gameId}`
)

let gameId = $computed(() => {
  word = word.toUpperCase()
  word = word.replaceAll(/[^A-Z]/g, "")
  if (word.length < 5) {
    indication = indications.notEnoughLetters
    return ""
  }
  if (word.length > 5) word = word.slice(0, 5)
  indication = indications[wordInDictionary(word)]
  return btoa(sender + word)
})

function copyLinkToClipboard(event: Event) {
  navigator.clipboard.writeText(link)
  showMessage("Copied!")
  event.preventDefault()
}

function showMessage(msg: string, time = 1000) {
  message = msg
  if (time > 0) setTimeout(() => (message = ""), time)
}
</script>

<style scoped>
.link {
  padding: 1rem;
  background-color: #eee;
  border-radius: 1rem;
}

.indicator {
  margin-top: -1rem;
}

form#maker {
  flex: 1;
  margin-top: 10%;
}
</style>
