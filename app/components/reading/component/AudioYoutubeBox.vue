<template>

    <div 
  
    ref = 'boxRef'
    class="fixed flex flex-col min-w-64 z-10 bg-white resize w-72 aspect-video border rounded-xl shadow-lg overflow-hidden"
    :style="{left : videoPosition.x + 'px', top : videoPosition.y + 'px'}"
    >
      <div class="h-10 shrink-0 px-3 py-1 cursor-move select-none touch-none w-full flex items-center justify-between"
      @pointerdown="startDragging"
      >
        <div class="grid grid-cols-3 gap-1 ">
          <span v-for="i in 9" :key="i" class="w-1 h-1 bg-black "></span>
        </div>

        <button @click="emit('closeAudioBox', false)" class="h-8 w-8 hover:bg-gray-300 rounded-full">
          <font-awesome icon="times" />
        </button>

      </div>

      <div class="bg-black   flex-1 ">
        <div ref="videoRef" class=" w-full h-full rounded "></div>
      </div>

    </div>


    <div class="w-96  border bg-white rounded-3xl shadow-md px-2 pb-1 flex items-center justify-between">
      <button @click="playAudio" class="h-10 w-10 rounded-full bg-black/80 shawdow-md flex items-center justify-center whitespace-nowrap shrink-0">
            <img :src="!isPlaying? '/icons/reader/play.svg' : '/icons/reader/pause.svg'" alt="play or pause">
        </button>

      <div class="flex flex-col w-full px-2">
            <div
              @mousedown="onSeekStart"
              @mouseup="onSeekEnd"
            >         
                <AudioSlider :key="duration"  :input-max="duration" v-model:input-value="currentTime"/>
                <span class="flex text-sm justify-between px-2 ">
                    <span>{{minutesSeconds(Math.round(currentTime))}}</span>
                    <span>{{minutesSeconds(Math.round(duration))}} </span>
                </span>
            </div>

            <div class="w-full flex justify-between gap-1 mt-1">
                <button @click="back" class="h-8 px-1 hover:bg-gray-300 rounded-lg flex items-center justify-center"><img src="/icons/reader/fiveSecondBack.svg" alt="fiveSecondback"/></button>
                <button @click="next" class="h-8 px-1 hover:bg-gray-300 rounded-lg flex items-center justify-center"><img src="/icons/reader/fiveSecondNext.svg" alt="fiveSecondnext"/></button>
                <button @click="isLoop = !isLoop " :class="isLoop && 'bg-gray-300'" class="h-8 px-1 rounded-lg flex items-center justify-center"><img src="/icons/reader/repeat.svg" alt="repeat"/></button>
                <div ref="speedOptionsRef" class="relative">
                    <button @click="openAudioOptions = !openAudioOptions" class="w-16 h-8 px-1 hover:bg-gray-300 rounded-lg italic flex items-center justify-center gap-1 text">{{`${audioSpeed}x`}}  <font-awesome icon="chevron-up"  class="text-xs mt-1"/></button>
                    <div v-if="openAudioOptions"
                    class="absolute w-36  bg-white border shadow z-10 right-0 top-0 rounded-xl -translate-y-full
                    flex flex-col overflow-hidden">
                        <button
                          v-for="speed in speedLists" 
                          class="" 
                          :class="[' w-full text-start py-1 px-5 text-lg hover:bg-gray-100', (speed === audioSpeed) && 'bg-gray-100']"
                          @click="changeAudioSpeed(speed)"           
                          >
                            {{speed}}
                        </button>
                    </div>
                </div>
                <NuxtLink class="h-8 px-1 hover:bg-gray-300 rounded-lg flex items-center justify-center"><img src="/icons/reader/zoomIn.svg" alt="zoomIn"/></NuxtLink>
            </div>

      </div>

      <button @click="emit('closeAudioBox', false)" class="h-10 w-10 hover:bg-gray-300 rounded-full shrink-0">
          <font-awesome icon="times"/>
      </button>
    </div>



</template>

<script setup>
import {ref, onMounted, watch, onBeforeUnmount} from 'vue'
import AudioSlider from '~/components/UI/AudioSlider.vue'
const {minutesSeconds} = useConvert()

let player = null
let timer = null
const boxRef = ref(null)
const videoRef = ref(null)

const props = defineProps({
    youtubeData : {type : Object}
})


const currentTime = ref(props.youtubeData.youtube_start_time?? 0)
const duration = ref(0)

const waitForDuration = () => {
  const t = setInterval(() => {
    const d = Number(player?.getDuration?.() || 0)
    if (d > 0) {
      duration.value = d
      clearInterval(t)
    }
  }, 200)
}

const isPlayRready = ref(false)

const isPlaying = ref(false)

const isUserSeeking = ref(false)
const isLoop = ref(false)


const speedLists = [2, 1.5, 1.25, 1, 0.85, 0.75, 0.6, 0.5]
const openAudioOptions = ref(false)
const audioSpeed = ref(speedLists[3])

const emit = defineEmits(['closeAudioBox', 'sendCurrentTimeToParent'])



const loadYoutubeAPI = () =>
  new Promise((resolve) => {
    if (window.YT?.Player) return resolve()

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)

    window.onYouTubeIframeAPIReady = () => resolve()
})






const stopTracking = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const startTracking = () => {
  stopTracking()

  timer = setInterval(() => {
    if (player?.getCurrentTime && !isUserSeeking.value) {
      currentTime.value = player.getCurrentTime()
    }
  }, 200)
}

const handleEnd = () => {
  if (!player) return

  stopTracking()
  player.seekTo(0, true)

  player.pauseVideo()

  if (isLoop.value) {
    player.playVideo()
  }

  else {
    isPlaying.value = false
  }
}

const handleStateChange = (e)=> {
    if (e.data === YT.PlayerState.ENDED) {
      handleEnd()
      return
    }

    isPlaying.value = (e.data === YT.PlayerState.PLAYING)

    if (
      e.data === YT.PlayerState.PLAYING || e.data === YT.PlayerState.PAUSED
    ) {
      startTracking()
    }

    else {
      stopTracking()
    }
}


// PAUSD AND PLAY

const playAudio = () => {
  
  if (isPlaying.value) {
    player?.pauseVideo?.()
  }

  else {
    player?.playVideo?.()
  }


}


// this funtionc is needed because 'seekTo' tend to play youtube video
const keepIsPlayingState = () => {
    if (!player) return

    if (isPlaying.value) {
     player.playVideo()
    }

    else {
        player.pauseVideo()
    }
}

const back = () => {
  if (!player) return

  const t = player.getCurrentTime()

  player.seekTo(Math.max(0, t-5), true)

 keepIsPlayingState()
}
// this funcion increment currentime by 5 seconds
const next = () => {
  if (!player) return

  const t = player.getCurrentTime()

  player.seekTo(Math.min(duration.value, t +5), true)

    keepIsPlayingState()
}

watch(currentTime , (newVal) =>  {
  if (!isUserSeeking.value) return
  if (player ) {
    player.seekTo(newVal, true)
  }

})

const onSeekStart = () => {
  isUserSeeking.value = true
}

const onSeekEnd = () => {
  isUserSeeking.value = false

  keepIsPlayingState()
}


const changeAudioSpeed = (newSpeed) => {
  if (!player) return

  audioSpeed.value = newSpeed
  openAudioOptions.value = false
  player.setPlaybackRate(newSpeed)
}

const videoPosition = ref({x : 0, y : 0})
const isDragging = ref(false)
let startX = 0
let startY = 0

let startLeft = 0
let startTop = 0


const startDragging = (e) => {
    if (!boxRef.value) return
    if (isDragging.value) return

    isDragging.value = true

    startLeft = boxRef.value.getBoundingClientRect().left
    startTop = boxRef.value.getBoundingClientRect().top
    

    startX = e.clientX
    startY = e.clientY


    window.addEventListener('pointermove', handleDragging)
    window.addEventListener('pointerup', handlePointerUp)
}

const handleDragging = (e) => {


  //   if (e.pointerType === 'mouse' && (e.buttons & 1) === 0) {
  //     handlePointerUp(e)
  //   return
  // }
    if (e.pointerType === 'mouse' && (e.buttons & 1) === 0) {
      handlePointerUp(e)
      return
    }

    if (!isDragging.value) return
    if (!boxRef.value) {
      handlePointerUp()
      return
    }

    const boxRect = boxRef.value.getBoundingClientRect()
    const w = boxRect.width 
    const h = boxRect.height 

    const newLeft = startLeft + e.clientX - startX
    const newTop = startTop + e.clientY - startY

    videoPosition.value.x = Math.min(Math.max(0, newLeft) , window.innerWidth - w)
    videoPosition.value.y = Math.min(Math.max(0, newTop) , window.innerHeight - h)
}


const handleKeyboard = (e) => {

  const target = e.target
  const isTypingTarget =
    target instanceof HTMLElement &&
    (target.tagName === 'INPUT' ||
     target.tagName === 'TEXTAREA' ||
     target.isContentEditable)

  if (isTypingTarget) return
  const listKeys = ['Escape', '<', ">", " ", 'd']

  if (!listKeys.includes(e.key)) {
    return
  }

  if (e.key === 'Escape' || e.key === ' ') {
    playAudio()
  }

  if (e.key === 'd') {
    emit('sendCurrentTimeToParent', currentTime.value)
  }

  // crearte short cut with "shirft + >"
  if (e.shiftKey && e.key === '>') {
    next()
  }

  if (e.shiftKey && e.key === '<') {
    back()
  }
}

const handlePointerUp = () => {
    isDragging.value = false
    window.removeEventListener('pointermove', handleDragging)
    window.removeEventListener('pointerup', handlePointerUp)
}

//  videoId: 'o4w8yAHWDEU',
onMounted( async () => {

  videoPosition.value.x = Math.max(12, window.innerWidth - 288 - 12)
  videoPosition.value.y = Math.max(12, window.innerHeight - 162 -12)

  await loadYoutubeAPI()
 
  player = new YT.Player(videoRef.value, {
    videoId: props.youtubeData.youtube_id?? '', 

    playerVars : {
      controls: 1,// Hiện thanh điều khiển
      modestbranding: 1, // Giảm logo YouTube
      rel:0 // Không gợi ý video liên quan
    },

    events: {
      onReady:  () => {

        const id = props.youtubeData.youtube_id ?? ''
        const start = props.youtubeData.youtube_start_time ?? 0

        // Force metadata load without autoplay
        player.cueVideoById({ videoId: id, startSeconds: start })

         waitForDuration()

        
        isPlayRready.value = duration.value > 0

        const startTime = props.youtubeData.youtube_start_time?? 0
        player.seekTo(startTime, true)
        player.pauseVideo()
      },

      onStateChange: handleStateChange
    }
  })

  window.addEventListener('keydown', handleKeyboard)
})



onBeforeUnmount(() => {
  handlePointerUp()
  stopTracking();
  player?.destroy?.()
  player = null
  window.removeEventListener('keydown', handleKeyboard)
})
</script>
