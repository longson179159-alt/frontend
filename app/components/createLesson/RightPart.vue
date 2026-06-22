<template>
  <div class="  ">


    <!-- IMPORT AUDIO PART -->
    <div class="  my-5 flex flex-col gap-3">
      <h2 class="text-center text-blue-500 text-lg font-medium ">Import Audio</h2>
      <div class="flex items-center gap-3">
        <button @click="openWindow = 'audio'" class="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-300"><font-awesome
            icon="plus" /></button>

        <div v-if="audioURL" class="w-full ">
          <div class="flex pr-5 w-full items-center justify-center">
            <button @click="playAudio"><font-awesome :icon="!isPlaying? 'play-circle' : 'pause-circle'" class="inline-block mt-3" /></button>
           
            <audio class="sr-only" ref="audioRef" :src="audioURL" preload="metadata" @timeupdate="onTimeUpdate"
              @loadedmetadata="onLoaded" />
            <AudioSlider class=" w-full mx-2"  :input-max="audioLength" v-model:inputValue="audioProgress"/>
            <button @click="audioURL=''" class="h-8 w-8 rounded-full hover:bg-gray-300 flex justify-center items-center "><img src="/icons/others/trash.svg" alt="trash" /></button>
          </div>

          <div class="flex justify-between px-5 text-xs">
            <span>{{minutesSeconds(Math.floor(audioProgress))}}</span>
            <span>{{minutesSeconds(Math.floor(audioLength))}}</span>
          </div>
          
        </div>
        <buttonn v-else @click="openWindow = 'audio'"  class=" h-8 px-3 flex  cursor-pointer items-center gap-1 hover:bg-gray-300 justify-center rounded-md"><img src="/icons/header/importAudio.svg" alt="importAudio" class="inline-block"/> Audio</buttonn>
        <!-- Open Audio Window -->
        <ImportAudioInLesson v-if="openWindow === 'audio'" @send-file="handleUploadAudio"
            @close-message="openWindow = $event" />
      </div>

      <div class="flex items-center gap-3">
        <button class="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-300"><font-awesome icon="plus" /></button>
        <button class=" h-10 px-3 flex items-center gap-1 hover:bg-gray-300 justify-center rounded-md"><img
            src="/icons/others/urlIcon.svg" alt="importAudio" class="inline-block" /> Original URL</button>
      </div>
      <div class="flex items-center gap-3">
       
      </div>
    </div>

    <!-- IMPORT TEXT PART -->
    <div class="border border-gray-400 py-5 flex flex flex-col gap-3 px-5 rounded-2xl">
      <h2 class="text-center text-blue-500 text-lg font-medium px">Import Text</h2>
      <div class="flex flex-col">  
        <div v-if="!textFile" class="flex flex-col gap-3">
          <span>Input text</span>
          <textarea v-model="inputText" 
          @input="(e) => {
            e.target.style.height = 'auto'
            e.target.style.height = e.target.scrollHeight + 'px'
            emit('sendInputText', inputText)
          }" 
          class="p-3 border border-gray-500 overflow-hidden resize-none rounded-lg focus:outline-none focus:ring-0"></textarea>
          <span class=" text-sm">Or</span>
          <div >
            <label class=" border block border-dashed border-blue-800 p-2 rounded-lg">
              <input type="file" @change="handleUploadText" accept=".txt,.pdf,.epub,.docx" class="sr-only ">
              <div class="flex items-center justify-center flex-wrap text-sm border-[8px] border-blue-300 px-2 py-6">
                <span class="mr-2 text-center">Drag and drop your file here or </span>
                <span class="hover:underline text-blue-600">Select File</span>
              </div>
            </label>
            <span class="block text-sm pt-2 pb-4 text-center w-full">Supported formats: EPUB, PDF, DOCX, TXT</span>
          </div>
        </div>

        <div v-if="textFile" class=" relative px-3 bg-gray-300 rounded-xl py-5">
          <span >{{textFile.name}}</span>
          <button @click="textFile = null; emit('sendTextFile', null)" class="absolute right-2 top-2 flex items-center justify-center rounded-md  h-5 w-5 bg-gray-500"><font-awesome icon="times"/></button>
        </div>
      </div>
    </div>


  </div>
</template>


<script setup>

import AudioSlider from '~/components/homepage/component/AudioSlider.vue';
import ImportAudioInLesson from '../homepage/component/ImportAudioInLesson.vue';
import { ref , watch} from 'vue'



const { minutesSeconds, seconds } = useConvert()



const openWindow = ref("")
const audioRef = ref(null)
const audioProgress = ref(0)
const audioLength = ref(0)
const audioFile = ref(null)
const audioURL = ref("")
const isPlaying = ref(false)
const inputText = ref("")
const textFile = ref(null)
const textFileName = ref('')


const handleUploadAudio = (data) => {
  audioFile.value = data
  openWindow.value = ""
  audioURL.value = URL.createObjectURL(audioFile.value)
  console.log("audioUrl :", audioURL.value)
  console.log("filename :", audioFile.value.name)
  emit("sendAudioFile", audioFile.value)
}

const onLoaded = () => {
  audioLength.value = audioRef.value.duration
}

const onTimeUpdate = () => {
  if (!audioURL.value) return
  audioProgress.value = audioRef.value.currentTime
}


const playAudio = () => {
  
  if (!audioURL.value) return

  if (isPlaying.value) {
    audioRef.value.pause()
  }

  else {
    audioRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}


watch(audioProgress, (newVal) => {
  if (audioURL.value && Math.abs(audioRef.value.currentTime - newVal) > 3)
    audioRef.value.currentTime = newVal
})

const handleUploadText = (e) => {
  const selectedFile = e.target.files?.[0]
  if (!selectedFile) return

  textFile.value = selectedFile
  textFileName.value = selectedFile.name
  emit('sendTextFile', selectedFile)
}

const emit = defineEmits(['sendAudioFile', 'sendTextFile', 'sendInputText'])

</script>
