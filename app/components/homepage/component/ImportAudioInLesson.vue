<template>
  <div class="fixed inset-0 h-screen bg-gray-500/50 z-20  px-5 w-full flex flex-col items-center justify-center">
    <div  class=" max-w-[600px] md:w-[600px] px-3 border bg-white p-5 rounded-2xl">

      <!-- upper part -->
      <div class="flex justify-between">
        <span class="inline-flex gap-5 whitespace-nowrap items-center">
          <img src="/icons/header/importAudio.svg" alt="importAudio" class="inline-block h-6 w-6">
          <span class="font-bold text-xl">Audio</span>
        </span>

        <button @click="ClosePopup"
          class="h-10 w-10 hover:bg-gray-300 rounded-full flex items-center justify-center"><font-awesome
            icon="times" /></button>
      </div>
      <span class="text-lg inline-block my-5">
        Now you can import audio files such as Podcasts and audiobooks, and have them automatically transcribed.
      </span>
      
      <label for="audio-input" class="cursor-pointer ">
        <input id="audio-input" type="file" accept=".mp3, .wav" @change="handleFile" class="sr-only">
        <div class="border border-dashed w-full h-20 border-blue-300 p-2 flex min-h-60 rounded-md ">
          <div class="  border-8 border-blue-300 flex-1 flex flex-col items-center justify-center flex-wrap gap-2">
            <span class="text-xl text-center text-blue-500 font-medium">Drag and drop your file here </span>
            <span class="text-xl text-blue-500 font-medium">or</span>
            <span class="bg-gray-200 hover:bg-gray-300  px-3 py-3  font-semibold rounded-lg">Select file</span>
          </div>
        </div>
      </label>

      <span class="text-center mt-3 block">Supported formats: <span class="text-red-600">.mp3, .wav, .m4a</span></span>
    </div>

  </div>
</template>


<script setup>
import { ref } from "vue"


const emit = defineEmits(["send-file", "close-message"])

const ClosePopup = () => {
 
  emit('close-message', "close")
}

const handleFile = async (e) => {
  const uploadAudioFile = e.target.files[0]
    emit("send-file", uploadAudioFile)
    ClosePopup()
}
</script>
