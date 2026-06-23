<template>
    <div class="w-full flex  flex-col items-center justify-start mt-3">
         
          <div v-show="props.videoId && !isDragOpen"  class=" w-full max-w-[700px] flex flex-col items-center justify-center">
            <button @click="showDrag" class="ml-auto z-50 h-8 w-8 hover:bg-gray-200 rounded-full flex items-center justify-center"><font-awesome icon="times"/></button>
            <div class="relative w-full  h-[180px]  flex flex-col items-center justify-center mb-2">
              <div ref="videoRef" class="w-full h-full "></div>
              <button
                class="absolute inset-0 z-10"
                @click="playAudio"
              ></button>
            </div>
          </div>

          <div
            v-show="props.videoId && isDragOpen"
            ref="dragBoxRef"
            class="fixed flex flex-col min-w-64 z-50 bg-white resize w-72 h-52 border rounded-xl shadow-lg overflow-hidden"
            :style="{ left: dragPosition.x + 'px', top: dragPosition.y + 'px' }"
          >
            <div
              class="h-10 shrink-0 px-3 py-1 cursor-move select-none touch-none w-full flex items-center justify-between bg-white"
              @pointerdown="startDragging"
            >
              <div class="grid grid-cols-3 gap-1">
                <span v-for="i in 9" :key="i" class="w-1 h-1 bg-black"></span>
              </div>

              <button @click="hideDrag" class="h-8 w-8 hover:bg-gray-200 rounded-full flex items-center justify-center">
                <font-awesome icon="times"/>
              </button>
            </div>

            <div class="bg-black relative flex-1">
              <div ref="dragVideoRef" class="w-full h-full"></div>
              <button
                class="absolute inset-0 z-10"
                @click="playAudio"
              ></button>
            </div>
          </div>

            
          

          <!-- CHOOSE AND CHANGE SPEED AREA -->
          <div class="relative h-14 w-14 shrink-0 whitespace-none mb-10">
              <button @click="playAudio" class="border border-gray-600  self-center w-full h-full rounded-full flex items-center justify-center">
                  <img src="/icons/reader/volume.svg" class="w-8 h-8">
              </button>
  
              <div class="absolute relative -right-10 bottom-5 z-10">
                  <button @click="playAudio" class="bg-white h-10 w-10 rounded-full  border border-gray-600 flex items-center justify-center">
                      <img :src= "currentSpeed < 1? '/icons/reader/turtle.svg' : '/icons/reader/rabbit.svg'" class="rabbit">
                  </button>

                  <div ref="speedRef" v-if="openSelectSpeed" class="absolute w-40 flex flex-col top-full right-3 rounded-xl border border-gray-300 shadow-md z-20 bg-white ">
                    <button 
                    v-for="speed in speedLists" :key="speed"
                    :class="['px-3 py-2 hover:bg-gray-200 text-start font-medium text-gray-600 italic', speed === currentSpeed && 'bg-gray-200']"
                    @click="currentSpeed = speed; openSelectSpeed = false"
                    >{{speed}}</button>
                  </div>
      
              </div>
  
              <button 
              @click.stop="openSelectSpeed = !openSelectSpeed"
              class="absolute flex items-center justify-center -right-11 top-12 h-5 w-7 rounded-xl bg-white z-20 border border-gray-600"><font-awesome icon='chevron-down' class="opacity-60 text-sm"/></button>

              
          </div>
        </div>
</template>


<script setup>
import {ref, watch, computed, onMounted, onBeforeUnmount, nextTick} from 'vue'


let player = null
const videoRef = ref(null)
const isPlaying = ref(false)


const props = defineProps({
  currentTimestamp: {type: Object, default: () => ({
    text: '',
    start: 0,
    end: 0,
    idx: 0
  })},


  videoId: {type: String, default: ''}  
})

const currentTimestamp = computed(() => props.currentTimestamp)
watch(currentTimestamp, () => {
  // console.log('currentTimestamp changed', currentTimestamp.value)
})
let chunkTimer = null


const {speakEnglish} = useGooleTranslate()
const playAudio = () => {
  if (props.videoId === '') {
    speakEnglish(currentTimestamp.value.text, currentSpeed.value)
    return
  }

  const activePlayer = isDragOpen.value ? dragPlayer : player
  if (!activePlayer) return

  if (activePlayer.getPlayerState?.() === YT.PlayerState.PLAYING) {
    activePlayer.pauseVideo()
    return
  }

  const chunk = currentTimestamp.value
  if (!chunk) return

  if (chunkTimer) {
    clearInterval(chunkTimer)
    chunkTimer = null
  }

  activePlayer.seekTo(chunk.start, true)
  activePlayer.setPlaybackRate(currentSpeed.value)
  activePlayer.playVideo()

  chunkTimer = setInterval(() => {
    if (!activePlayer) return

    const currentTime = activePlayer.getCurrentTime()

    if (currentTime >= chunk.end) {
      activePlayer.pauseVideo()
      clearInterval(chunkTimer)
      chunkTimer = null
    }
  }, 100)
}


const speedLists = [0.5, 0.6, 0.75, 0.85, 1, 1.25, 1.5, 2]
const openSelectSpeed = ref(false)
const speedRef = ref(null)
const currentSpeed = ref(1)


const loadYoutubeAPI = () => {
  return new Promise((resolve) => {
    if (window.YT?.Player) return resolve()

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)

    window.onYouTubeIframeAPIReady = () => resolve()
  })
}


const handleClickOutside = (event) => {
  if (speedRef.value && !speedRef.value.contains(event.target)) {
    openSelectSpeed.value = false
  }
}

let dragPlayer = null
const dragBoxRef = ref(null)
const dragVideoRef = ref(null)

const isDragOpen = ref(false)
const dragPosition = ref({ x: 0, y: 0 })
const isDragging = ref(false)

let startX = 0
let startY = 0
let startLeft = 0
let startTop = 0


const showDrag = async () => {
  player?.pauseVideo?.()
  isDragOpen.value = true
  isDragOpen.value = true

  if (!dragPosition.value.x && !dragPosition.value.y) {
    const boxWidth = 288
    const boxHeight = 220
    dragPosition.value.x = Math.max(12, window.innerWidth - boxWidth - 24)
    dragPosition.value.y = Math.max(12, window.innerHeight - boxHeight - 24)
  }

  await nextTick()

  if (!window.YT?.Player || dragPlayer || !dragVideoRef.value) return

  dragPlayer = new YT.Player(dragVideoRef.value, {
    videoId: props.videoId,
    playerVars: {
      controls: 0,
      modestbranding: 1,
      rel: 0
    },
    events: {
      onReady: () => {
        dragPlayer.pauseVideo()
      }
    }
  })
}

const hideDrag = () => {
  dragPlayer?.pauseVideo?.()
  isDragOpen.value = false
}


const startDragging = (e) => {
  if (!dragBoxRef.value || isDragging.value) return

  isDragging.value = true

  startLeft = dragBoxRef.value.getBoundingClientRect().left
  startTop = dragBoxRef.value.getBoundingClientRect().top
  startX = e.clientX
  startY = e.clientY

  window.addEventListener('pointermove', handleDragging)
  window.addEventListener('pointerup', stopDragging)
}

const handleDragging = (e) => {
  if (e.pointerType === 'mouse' && (e.buttons & 1) === 0) {
    stopDragging()
    return
  }

  if (!isDragging.value || !dragBoxRef.value) return

  const boxRect = dragBoxRef.value.getBoundingClientRect()
  const w = boxRect.width
  const h = boxRect.height

  const newLeft = startLeft + e.clientX - startX
  const newTop = startTop + e.clientY - startY

  dragPosition.value.x = Math.min(Math.max(-w / 2, newLeft), window.innerWidth - w / 2)
  dragPosition.value.y = Math.min(Math.max(-h / 2, newTop), window.innerHeight - h / 2)
}

const stopDragging = () => {
  isDragging.value = false
  window.removeEventListener('pointermove', handleDragging)
  window.removeEventListener('pointerup', stopDragging)
}

// add keyboard a as play playAudioTextTime, guard input and textarea
const handleKeydown = (event) => {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return

  if (event.key.toLowerCase() === 'a') {
    playAudio()
  }
}


onMounted(async () => {

  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
  if (!props.videoId) return


  await loadYoutubeAPI()

  player = new YT.Player(videoRef.value, {
    videoId: props.videoId,

    playerVars: {
      controls: 0,
      modestbranding: 1,
      rel: 0
    },

    events: {
      onReady: () => {
        player.pauseVideo()
      },

      onStateChange: (e) => {
        isPlaying.value = e.data === YT.PlayerState.PLAYING
      }
    }
  })

  
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
  if (chunkTimer) {
    clearInterval(chunkTimer)
    chunkTimer= null
  }
  stopDragging()
  dragPlayer?.destroy?.()
  player?.destroy?.()
})

</script>