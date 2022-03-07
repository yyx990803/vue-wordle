<template>
  <Transition>
    <div class="message" v-if="message">
      <p>{{ message }}</p>
      <p v-if="copied">Copied results to clipboard</p>
      <p v-if="paste">
        <textarea readonly ref="textarea">{{ paste }}</textarea>
      </p>
      <p v-if="paste">
        <button @click="copyPaste">Copy</button>
        <button v-if="canShare" @click="sharePaste">Share</button>
      </p>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const textarea = $ref<HTMLTextAreaElement>()

const props = defineProps({
  message: { type: String, required: true },
  paste: String,
})

let copied = $ref(false)
function copyPaste() {
  textarea.focus()
  textarea.select()
  document.execCommand("copy")
  copied = true
}

const canShare = $computed(
  () =>
    Boolean(navigator.canShare) &&
    Boolean(navigator.share) &&
    navigator.canShare({ text: props.paste })
)
function sharePaste() {
  navigator.share({ text: props.paste })
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

button {
  padding: 0.5rem;
}
</style>
