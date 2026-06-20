<template>
    <div class="w-full flex flex-col items-center justify-start mt-3">
          <div v-if="props.videoId" class="w-full h-[200px] flex items-center justify-center my-2">
            <div ref="videoRef" class="w-full h-full border"></div>
          </div>

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
import {ref,watch, computed, onMounted, onBeforeUnmount} from 'vue'


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

    if (!player) return
    const chunk = currentTimestamp.value


    if (!chunk) return

    if (chunkTimer) {
        clearInterval(chunkTimer)
        chunkTimer = null
    }
    player.seekTo(chunk.start, true)

    player.setPlaybackRate(currentSpeed.value)

    player.playVideo()


    chunkTimer = setInterval(() => {
        if (!player) return

        const currentTime = player.getCurrentTime()

        if (currentTime >= chunk.end) {
            player.pauseVideo()
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

  player?.destroy?.()
})

</script>