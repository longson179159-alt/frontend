<template>
    <div class="h-screen flex flex-col  item-center max-w-xl border mx-auto mt-20">

         <!-- create button change currentTimestamp idx to check -->
         <div class="flex items-center justify-center gap-5 my-10">
           <button @click="currentTimestampIndex--">decrease</button>
           <span>{{ currentTimestampIndex }}</span>
           <button @click="currentTimestampIndex++">increase</button>
         </div >

        
        

        <youtube-frame
        :currentTimestampIndex="currentTimestampIndex"
        :videoId="youtubeData.youtube_id"
        />

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
              <div class="grid grid-cols-[28px_auto] gid-row-2 gap-x-3 items-center">
                <button @click="quickChangestatus(item.word, item.status)">
                  <div v-if="item.status !== 6" :class="['h-7 w-7 rounded-full  flex items-center justify-center', colorStatus[item.status]]">
                    {{ item.status }}
                  </div>
                  <div v-else class="h-7 w-7 rounded-full border border-gray-600 border-1 flex items-center justify-center">
                    <font-awesome icon="plus" class="text-blue-500 "/>
                  </div>
                </button>
      
                <div class="flex gap-5">
                  <span class="text-xl font-semibold">{{ item.word }}</span>
                  <button> <img src='/icons/reader/volume.svg' class="w-[18px]"/> </button>
                </div>          

                <span class="col-start-2 row-start-2 mt-2 text-lg font-semibold italic">
                      {{ item.status === 6? listTranslation[item.word] : item.yourMeanings }}
                </span>
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

          

        </div>
        

    </div>
</template>

<script setup>

import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import YoutubeFrame from '~~/app/components/reading/middle/YoutubeFrame.vue'



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

const {onTranslate} = useGooleTranslate()

/* =========================================================
    resize, props, emit: mount/unmount side-effects
========================================================= */
const props = defineProps({
  readerHeight: {type: Number, default: 500},
  currentValue : {type :Number, default: 1},
  lessonData: {type: Array, default : () => []},
  statusTagsMeanings: {type: Object, default: () => []},
  coreData: {type: Array, default: () => []},
  listSentence: {type: Array, default: () => []},
  currentPhraseStatus :{type: Number },
  youtubeData: {type: Object, default: () => ({})},
  timestamp: {type: Array, default: () => []},
  lastReadWordIdx: {type: Number, default: 1}}
)

const emit = defineEmits(['update:currentValue', 'selected', 'sendStatusFromReader'])

const currentTimestampIndex = computed({
  get: () => props.currentValue,
  set: (v) => emit('update:currentValue', v)
})


const lessondata = ref(props.lessonData.length? props.lessonData: [])
const core_data = props.coreData.length? props.coreData : []

const statusTagsMeanings = Object.keys(props.statusTagsMeanings).length !==0 ? props.statusTagsMeanings : {}
const youtubeData = Object.keys(props.youtubeData).length !== 0 ? props.youtubeData : {}

const visibleDataTimestampText = computed(() => lessondata.value[currentTimestampIndex.value])

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

watch(visibleDataWordLevel, async (newVal) => {
    const listWords = newVal.filter((item) => item.status === 6).map((item) => item.word)
    // create a set with listTranslation of reduring the number of translation needed
    // const translationSet = new Set(Object.keys(listTranslation.value))
    
    for (const word of listWords) {
      if (!(word in listTranslation.value)) {
        const translation = await onTranslate(word)
        listTranslation.value[word] = translation
      }
    }

}, {deep: true, immediate: true})

// create a color status for word item and phrase item based on statusTagsMeanings
const colorStatus = {
    1: 'bg-yellow-300',
    2: 'bg-yellow-200',
    3: 'bg-yellow-100',

}



const currentTimestamp = computed(() => props.timestamp[currentTimestampIndex.value])


const handleTranslation = async () => {
    // console.log('currentTimestamp', currentTimestamp.value)
    if (showTranslation.value) {
      currentTimestampTranslation.value = ''
    }

    else {
      // console.log('currentTimestamp.text', currentTimestamp.value.text)

      currentTimestampTranslation.value = await onTranslate(currentTimestamp.value.text)
      // console.log('currentTimestampTranslation.value', currentTimestampTranslation.value)
    }

    showTranslation.value = !showTranslation.value

}


const isActice = (wordIndex) => {

  
  if (!startPointer.value || !currentPointer.value) return false

  const a = Math.min(startPointer.value[0], currentPointer.value[0])
  const b = Math.max(startPointer.value[0], currentPointer.value[0])

  return wordIndex >= a && wordIndex <= b
}

// malipulate data
const quickChangestatus = (cleaned, currentStatus) => {
  if (currentStatus === 6) {
    statusTagsMeanings[cleaned].status = 1
    statusTagsMeanings[cleaned].your_meanings = listTranslation.value[cleaned]
  }

}

const newStatusDict = computed(() => {
  const statusDict = {}
  const listKeys = Object.keys(statusTagsMeanings)
  for (const item of listKeys) {
    if (item.split(" ").length === 1|| statusTagsMeanings[item].status >0) {
       statusDict[item] = statusTagsMeanings[item].status
    }
   
  }
  return statusDict
})


watch([currentTimestampIndex, newStatusDict], () => {
  changePageStatus()
})  


// select and emit
const selected = computed(() => {
  // Guard: selection not started or not updated   
  if (!startPointer.value || !currentPointer.value) return {text: '', valid: false, error: 'empty'}

  // Guard: do not allow cross-sentence selection
  if (startPointer.value[1] !== currentPointer.value[1]) {
    const realStart = startPointer.value[0] <currentPointer.value[0]? startPointer.value : currentPointer.value
    const realEnd = startPointer.value[0] <currentPointer.value[0]? currentPointer.value : startPointer.value

    const firstSentenceChuck = props.listSentence[realStart[1]].split(' ').splice(realStart[2]).join(' ')

    const middleSentence = props.listSentence.slice(realStart[1] + 1, realEnd[1]).join(' ')
    const lastSentenceChuck = props.listSentence[realEnd[1]].split(' ').splice(0, realEnd[2] + 1).join(' ')
    const text = firstSentenceChuck + ' ' + middleSentence +  " "  + lastSentenceChuck
    return {text: text, valid: false, error: 'cross-sentence'}
  }

  const a = Math.min(startPointer.value[2], currentPointer.value[2])
  const b = Math.max(startPointer.value[2], currentPointer.value[2])


  const sentence = props.listSentence[currentPointer.value?.[1]]
  const listWordInSentence = sentence.split(' ')
  const selected_phrase = listWordInSentence.slice(a, b + 1)
  const cleaned_selected_phrase = selected_phrase.map( item => cleanWord(item))

  // check if all words of selected phrase are valid
  if (!cleaned_selected_phrase.every(word => isValidWord(word))) {
    return {text: cleaned_selected_phrase.join(' '), valid: false, error: 'invalid-word'}
  }


  if (selected_phrase.length > 8) return {text: cleaned_selected_phrase.join(' '), valid: false, error: 'too-long'}
  return {text: cleaned_selected_phrase.join(' '), valid: true}
})

watch(selected, (newVal) => {

    emit('selected', newVal)
})


// @sendStatus="currentPhraseData.status = $event"
const emitStatus = (keyboard) => {
  emit('sendStatusFromReader', keyboard)
}

const {
  changePageStatus,
  changePageStatusByKeyborad,
  moveNextPrevious
} = useKeyboard( startPointer,currentPointer,  core_data, newStatusDict , lessondata, currentTimestampIndex, props.timestamp.length,  emitStatus, selected)









onMounted(async() => {

    window.addEventListener('pointerup', pointerUp)
    window.addEventListener('keydown', changePageStatusByKeyborad,)
    window.addEventListener('keydown', moveNextPrevious,)
})

onBeforeUnmount( () => {
    window.removeEventListener('pointerup', pointerUp)
    window.removeEventListener('keydown', changePageStatusByKeyborad,)
    window.removeEventListener('keydown', moveNextPrevious,)
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




