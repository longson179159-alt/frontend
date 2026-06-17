<template>
    <div class="h-screen flex flex-col  item-center max-w-xl border mx-auto mt-20">

        <div class="w-full flex items-center justify-center">
          <div class="relative h-14 w-14 shrink-0 whitespace-none my-10">
              <button class="border border-gray-600  self-center w-full h-full rounded-full flex items-center justify-center">
                  <img src="/icons/reader/volume.svg" class="w-8 h-8">
              </button>
  
              <button class="absolute border border-gray-600 -right-5 -bottom-5 bg-white h-10 w-10 rounded-full z-10 flex items-center justify-center">
                  <img src="/icons/reader/rabbit.svg" class="">
              </button>
  
              <button class="absolute flex items-center justify-center -right-11 top-12 h-5 w-7 rounded-xl bg-white z-20 border border-gray-600"><font-awesome icon='chevron-down'/></button>
          </div>
        </div>

        <div class=' flex items-center flex-wrap text-3xl'  ref="prose"
        @pointerdown.prevent="handlePointerDown"
        @pointermove="handlePointerEnter"
        >
            <span v-for="(item, idItem) in visibleDataTimestampText" :key="idItem" :class="['h-[44px] flex items-center']">
              <span v-if="item['type'] === 'phrase'" v-show="item['visible']"
                class="phrase-item flex  gap-y-7 h-full  items-center  rounded  ring-2 ring-inset ring-transparent hover:ring-yellow-400"
                :class="['status-' + item['status']]" 
                :data-first-w-idx="item['phrase'][0]['w_idx']"
                :data-first-s-idx="item['phrase'][0]['s_idx']" 
                :data-first-idx-w-in-s="item['phrase'][0]['idx_w_in_s']"
                :data-first-p-idx="item['phrase'][0]['p_idx']"
                :data-end-w-idx="item['phrase'][item['phrase'].length - 1]['w_idx']"
                :data-end-s-idx="item['phrase'][item['phrase'].length - 1]['s_idx']"
                :data-end-idx-w-in-s="item['phrase'][item['phrase'].length - 1]['idx_w_in_s']"
                :data-end-p-idx="item['phrase'][item['phrase'].length - 1]['p_idx']">
                <span v-for="(word) in item['phrase']"
                  :class="['inline-flex items-center h-[35px]  px-1', isActice(word['w_idx']) && 'bg-blue-400']"
                  v-show="word['visible_in_phrase']">
    
                  <span
                    :id="`w-${word['w_idx']}`"
                    :class="[
                      'status-' + word['status'],
                      'border border-transparent word-item',
                     
                      word['status'] === 6 ? 'hover:border-blue-600' : 'hover:border-yellow-600'
                    ]"
                    :data-w-idx="word['w_idx']"
                    :data-s-idx="word['s_idx']"
                    :data-idx-w-in-s="word['idx_w_in_s']"
                    :data-p-idx="word['p_idx']"
                    >
                    {{ word['word'] }}
                  </span>
    
                </span>
              </span>
    
              <span v-else
                :class="['flex  h-[35px]  items-center px-1 -blue-400 ', isActice(item['w_idx']) && 'bg-blue-400']">
                <span :id="`w-${item['w_idx']}`"
                  :class="[item['status'] === -1 ? 'pointer-events-none cursor-default' : 'status-' + item['status'], 'border border-transparent word-item', item['status'] === 6 ? 'hover:border-blue-600' : 'hover:border-yellow-600']"
                  :data-clickable="item['status'] !== -1"
                  :data-w-idx="item['w_idx']" :data-s-idx="item['s_idx']" :data-idx-w-in-s="item['idx_w_in_s']"  :data-status="item['status']"
                  :data-p-idx="item['p_idx']">
                  {{ item['word'] }}
                </span>
              </span>
            </span>
        </div>

        <button @click="handleTranslation" class="inline-block self-start my-3">
          <div  v-if="!showTranslation" class="flex px-3 py-1 hover:bg-gray-200 flex items-center justify-center gap-1 rounded-md">
            <span class="underline text-gray-600">Hiện dịch của câu</span>
            <font-awesome icon="chevron-down" class="text-xs text-gray-500"/>
          </div>
          
          <div v-else class="flex flex-col">
            <div class="inline-flex self-start inline-block px-3 py-1 hover:bg-gray-200 flex items-center justify-center gap-1 rounded-md">
              <span class="underline text-gray-600">Ẩn Dịch</span>
              <font-awesome icon="chevron-up" class="text-xs text-gray-500"/>
            </div>

            <span class="italic inline-block ml-3 font-medium text-lg ">{{currentTimestampTranslation}}</span>
          </div>
        </button>

        <div v-for="(item, idx) in visibleDataWordLevel" :key="`${idx}-${item.word}`" class="border-b  py-5">
          <div class="flex items-center w-full ">
              <div class="flex gap-3 items-center ">
                <button class="h-6 w-6 rounded-full border border-gray-600 border-1 flex items-center justify-center">
                  {{ item.status }}
                </button>
      
                <span class="text-xl font-semibold">{{ item.word }}</span>
                <button> <img src='/icons/reader/volume.svg' class="w-[18px]"/> </button>
              </div>
    
    
              <div class="ml-auto flex items-center justify-center gap-2">
                <button class="h-7 w-7 rounded-full border border-gray-600 flex items-center justify-center">
                  <font-awesome icon="check" class="opacity-50"/>
                </button>
    
                <button class="h-7 w-7 rounded-full border border-gray-600 flex items-center justify-center ">
                  <img src="/icons/others/trash.svg" class="opacity-50"/>
                </button>
              </div>
          </div>

          <span>
              {{ item.yourMeanings }}
          </span>

        </div>
        <!-- current -->

    </div>
</template>

<script setup>

import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

import mockData from '~~/server/mock/ReaderMain.json'


const showTranslation = ref(false)
const currentTimestampTranslation = ref('')

const isOpenPopup = ref(false)
const {
  startPointer,
  currentPointer,
  handlePointerDown,
  handlePointerEnter,
  pointerUp,
  isDraging
} = useEventDelegation(isOpenPopup)

const {cleanWord, isValidWord} = useConvert()



/* =========================================================
    resize, props, emit: mount/unmount side-effects
========================================================= */
const props = defineProps({
  readerHeight: {type: Number, default: 500},
  currentValue : {type :Number, default: 1},
  lessonData: {type: Array, default : () => []},
  listSentence : {type: Array, default : () => []},
  statusTagsMeanings: {type: Object, default: () => []},
  coreData: {type: Array, default: () => []},
  currentPhraseStatus :{type: Number },
  isYoutubeVideo: {type: Boolean, default: false},
  timestamp: {type: Array, default: () => []},
  lastReadWordIdx: {type: Number, default: 1},
  audioCurrentTime: {
    type: Object,
    default: () => ({
      currentTime: 0,
      syncTimeToText: false
    })
  }}
)


const lessondata = ref(props.lessonData.length? props.lessonData: mockData.lesson_data)
const core_data = props.coreData.length? props.coreData : mockData.core_data
const timestamp = props.timestamp.length? props.timestamp : mockData.timestamp
const statusTagsMeanings = Object.keys(props.statusTagsMeanings).length !==0 ? props.statusTagsMeanings : mockData.Tags_Meanings

const paraIdx = ref(0)
const visibleDataTimestampText = computed(() => lessondata.value[paraIdx.value])

const visibleDataWordLevel = computed(() => {
    let listWords = []
    // create a set to fillter duplicate word
    let wordSet = new Set()
    for (const item of visibleDataTimestampText.value) {
      if (item.type === 'word') {
        const yourMeanings = statusTagsMeanings[item.cleaned]?.your_meanings ?? []
        
        const status = statusTagsMeanings[item.cleaned]?.status ?? 0
        if (status === 0 || status === -1 || status === 5 || status === 4) continue
    
         // push item.cleaned, yourMeaning (merge all meaning as a string), status to listWords

        if (wordSet.has(item.cleaned)) {
          continue
        }

        wordSet.add(item.cleaned)
        listWords.push({
          word: item.cleaned,
          yourMeanings: yourMeanings.join(', '),
          status: status
        })
      }

      else {
        for (const word of item.phrase) {
          
          // const tags = statusTagsMeanings[word.cleaned].tags ?? []
          const status = statusTagsMeanings[word.cleaned]?.status ?? 0
          if (status === 0 || status === -1 || status === 5 || status === 4) continue

          const yourMeanings = [...(statusTagsMeanings[word.cleaned]?.your_meanings ?? [])]

          // push word.cleaned, yourMeaning (merge all meaning as a string), status to listWords
          if (!wordSet.has(word.cleaned)) {
            wordSet.add(word.cleaned)
            listWords.push({
              word: word.cleaned,
              yourMeanings: yourMeanings.join(', '),
              status: status
            })
          }
        }

        // create phrase level status
        const phraseCleaned = item.phrase.map(w => w.cleaned).join(' ')
        const phraseYourMeanings = statusTagsMeanings[phraseCleaned]?.your_meanings
        const phraseStatus = statusTagsMeanings[phraseCleaned]?.status ?? 0
        if (phraseStatus === 0 || phraseStatus === -1 || phraseStatus === 5 || phraseStatus === 4 || phraseStatus === 6) continue
   
        if (phraseYourMeanings && !wordSet.has(phraseCleaned)) {
          wordSet.add(phraseCleaned)
          listWords.push({
            word: phraseCleaned,
            yourMeanings: phraseYourMeanings.join(', '),
            status: phraseStatus
          })
        }
      }
    }

    return listWords
})

const listTranslation = ref({})

watch(visibleDataTimestampText, async (newVal) => {
    const listWords = newVal.filter((item) => item.type === 'word' && item.status === 6).map((item) => item.word)
    for (const word of listWords) {
      if (!listTranslation.value[word]) {
        const translation = await onTranslate(word)
        listTranslation.value[word] = translation
      }
    }
}, {deep: true})

// create a color status for word item and phrase item based on statusTagsMeanings
const colorStatus = {
    '1': 'bg-yellow-300',
    '2': 'bg-yellow-200',
    '3': 'bg-yellow-100',
    '6': 'bg-blue-300'
}



const currentTimestamp = computed(() => timestamp[paraIdx.value])
const {onTranslate} = useGooleTranslate()

const handleTranslation = async () => {
    console.log('currentTimestamp', currentTimestamp.value)
    if (showTranslation.value) {
      currentTimestampTranslation.value = ''
    }

    else {
      console.log('currentTimestamp.text', currentTimestamp.value.text)

      currentTimestampTranslation.value = await onTranslate(currentTimestamp.value.text)
      console.log('currentTimestampTranslation.value', currentTimestampTranslation.value)
    }

    showTranslation.value = !showTranslation.value

}




const isActice = (wordIndex) => {

  
  if (!startPointer.value || !currentPointer.value) return false

  const a = Math.min(startPointer.value[0], currentPointer.value[0])
  const b = Math.max(startPointer.value[0], currentPointer.value[0])

  return wordIndex >= a && wordIndex <= b
}

onMounted(async() => {
    // console.log('props.timestamp', timestamp)
    console.log("visibleDataWordLevel", visibleDataWordLevel.value)

    window.addEventListener('pointerup', pointerUp)
})

onBeforeUnmount( () => {
    window.removeEventListener('pointerup', pointerUp)
})


</script>



<style>
.status-1 {
  @apply bg-yellow-300;
}

.status-2 {
  @apply bg-yellow-200
}

.status-3 {
  @apply bg-yellow-100
}

/* .status-4 { @apply underline decoration-dashed decoration-2 underline-offset-4 decoration-gray-500} */
/* instead of underline */
.status-4 {
  @apply border-b border-dashed border-b-gray-500;
}

.status-6 {
  @apply bg-blue-300
}

.word-item {
  @apply flex rounded h-[30px] cursor-pointer px-2 items-center 
}
</style>
<!-- C:\Users\PC\Desktop\fontend\lingQ\app\pages\demoSentenceView.vue -->




