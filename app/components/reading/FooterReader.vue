<template>
  <div class=" relative flex justify-between items-start  px-3 ">
    <button @click="handleOpenAudioBox" :class="(openAudioBox && props.youtubeData?.youtube_id || !props.youtubeData?.youtube_id || props.isSentenceMode) && 'invisible pointer-events-none'" class=" h-12 w-12 mb-5 rounded-full bg-black/80 flex items-center justify-center">
        <img src="/icons/reader/play.svg" alt="play"/>

     
    </button>

    <div v-if="openAudioBox && props.youtubeData?.youtube_id" class="absolute -top-8 left-5 z-10  bg-white">
        <AudioYoutubeBox 
        @close-audio-box="openAudioBox = $event" 
        :youtube-data="props.youtubeData"
        @send-current-time-to-parent="emit('sendCurrentTimeToParent', $event)"
        />
        <!-- <AudioBox v-else @close-audio-box="openAudioBox = $send" :audioURL="audioURL"/> -->
    </div>
    

    <button @click="emit('isSentenceMode', !props.isSentenceMode)" class="hover:bg-gray-300 mt-4 h-8 w-12 rounded-md flex items-center justify-center">
        <img  :src="props.isSentenceMode ? '/icons/reader/sentenceView.svg' : '/icons/reader/lessonView.svg'" alt="viewMode">
    </button>

    <NuxtLink  class="hover:bg-gray-300 h-10 w-12 rounded-md flex items-end justify-center">
        <img :src="props.isSentenceMode ? '/icons/reader/reviewSentence.svg' : '/icons/reader/reviewLesson.svg'" alt="reviewMode">
    </NuxtLink>


  </div>
</template>


<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'

// import AudioBox from './component/AudioBox.vue';
import AudioYoutubeBox from './component/AudioYoutubeBox.vue';



const props = defineProps({
    youtubeData : {type: Object},
    isSentenceMode: {type : Boolean, default: false}
})

const emit = defineEmits(['sendCurrentTimeToParent', 'isSentenceMode'])
const openAudioBox = ref(false)


const handleOpenAudioBox = () => {

    if (!props.youtubeData?.youtube_id || props.isSentenceMode) return
    openAudioBox.value = true
    
}
const handleKeyDown = (e) => {
    
    const target = e.target
    const isTypingTarget =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable)

    if (isTypingTarget) return
    if (openAudioBox.value === true) {
        return
    }
    if ((e.key === 'Escape' || e.key === ' ') && props.youtubeData?.youtube_id && !props.isSentenceMode) {
       
        openAudioBox.value = true
       
        return
    }
    
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

</script>
