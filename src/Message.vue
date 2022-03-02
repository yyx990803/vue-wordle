<template>
  <Transition>
    <div class="message" v-if="message">
      <p>{{ copied ? "Copied results to clipboard" : message }}</p>

      <button v-if="paste" @click="copyPaste">Share</button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps({
  message: { type: String, required: true },
  paste: String,
})

let copied = $ref(false)
function copyPaste() {
  navigator.clipboard.writeText(props.paste!)
  copied = true
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
