<template>
  <Transition>
    <div class="message" v-if="message">
      <p>{{ copied ? "Copied results to clipboard" : message }}</p>
      <p v-show="copied">
        <textarea readonly ref="textarea">{{ paste }}</textarea>
      </p>
      <button v-if="paste" @click="copyPaste">Share</button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { nextTick } from "vue"

const textarea = $ref<HTMLTextAreaElement>()

const props = defineProps({
  message: { type: String, required: true },
  paste: String,
})

let copied = $ref(false)
function copyPaste() {
  copied = true
  navigator.clipboard.writeText(props.paste!)
  textarea.focus()
  nextTick().then(() => textarea.select())
}
</script>

<style scoped>
.message {
  position: absolute;
  left: 50%;
  top: 80px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.85);
  padding: 16px 20px;
  z-index: 2;
  border-radius: 4px;
  transform: translateX(-50%);
  transition: opacity 0.3s ease-out;
  font-weight: 600;
}
.message.v-leave-to {
  opacity: 0;
}
</style>
