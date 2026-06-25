<template>
    <div class="flex flex-col overflow-hidden " :style="{height : readerHeight + 'px'}">

        <youtube-frame
        :currentTimestamp="currentTimestamp"
        :videoId="youtubeData.youtube_id"
        />

        <div class=' flex items-center flex-wrap text-3xl' 
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

            <span class="italic inline-block ml-3 font-medium text-lg ">{{listTranslation.timestampText[currentTimestampIndex] ?? ''}}</span>
          </div>
        </button>

        <div class="scroll-wrap flex-1 min-h-0">
          <div class="custom-scroll min-h-0 overflow-auto">
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
                      <button @click="speakEnglish(item.word)"> <img src='/icons/reader/volume.svg' class="w-[18px]"/> </button>
                    </div>          
    
                    <span class="col-start-2 row-start-2 mt-2 text-lg font-semibold italic">
                          {{ item.status === 6? listTranslation.word[item.word] : item.yourMeanings }}
                    </span>
                  </div>
        
        
                  <div class="ml-auto flex items-center justify-center gap-2">
                    <button @click="changeToKnow(item.word)" class="h-7 w-7 rounded-full border border-gray-600 flex items-center justify-center">
                      <font-awesome icon="check" class="opacity-50"/>
                    </button>
        
                    <button @click="changeToIgnore(item.word)" class="h-7 w-7 rounded-full border border-gray-600 flex items-center justify-center ">
                      <img src="/icons/others/trash.svg" class="opacity-50"/>
                    </button>
                  </div>
              </div>
    
              
    
            </div>
            
          </div>

            <div class="scroll-arrow scroll-arrow-top"></div>
            <div class="scroll-arrow scroll-arrow-bottom"></div>
        </div>

    </div>
</template>

<script setup>

import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import YoutubeFrame from '~~/app/components/reading/middle/YoutubeFrame.vue'

import { useKeyboard } from '~/composables/reading/sentenceView/useKeyboard'
import { useEventDelegation } from '~/composables/reading/shared/useEventdelegation'
import { useLastReadPersistence } from '~/composables/reading/shared/useLastReadPersistence'
import { useSelectedPhrase } from '~/composables/reading/shared/useSelectedPhrase'
import { useStatusMap } from '~/composables/reading/shared/useStatusMap'
const { getCsrfToken } = useCsrf()
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

const {onTranslate, speakEnglish} = useGooleTranslate()

/* =========================================================
    resize, props, emit: mount/unmount side-effects
========================================================= */
const props = defineProps({
  readerHeight: {type: Number, default: 500},
  currentValue : {type :Number, default: 1},
  lessonData: {type: Array, default : () => []},
  listSentence: {type: Array, default: () => []},
  statusTagsMeanings: {type: Object, default: () => []},
  coreData: {type: Array, default: () => []},
  currentPhraseStatus :{type: Number },
  timestamp: {type: Array, default: () => []},
  lastReadWordIdx: {type: Number, default: 1},
  lessonAndCourseName: {type: Object, default: () => ({})},
  isYoutubeVideo: {type: Boolean, default: false},
  youtubeData: {type: Object, default: () => ({})},
})

const emit = defineEmits(['update:currentValue' , 'update:lastReadWordIdx', 'selected', 'sendStatusFromReader'])

const currentTimestampIndex = computed({
  get: () => props.currentValue - 1,
  set: (v) => emit('update:currentValue', v + 1)
})

const lastReadWordIdx = computed({
  get: () => props.lastReadWordIdx,
  set: (v) => emit('update:lastReadWordIdx', v)
})

// find the truth value of currentTimestampIdx, that is equal with p_idx
const findCurrentTimestampIndex = () => {
    const coreDataFlat = core_data.flat(Infinity)
    const matchedWord = coreDataFlat.find(item => item.w_idx === props.lastReadWordIdx)
    currentTimestampIndex.value = matchedWord ? matchedWord.p_idx : 0
       
}






const lessondata = ref(props.lessonData.length? props.lessonData: [])
const core_data = props.coreData.length? props.coreData : []

const youtubeData = Object.keys(props.youtubeData).length !== 0 ? props.youtubeData : {}

const visibleDataTimestampText = computed(() => lessondata.value[currentTimestampIndex.value] ?? [])

const visibleDataWordLevel = computed(() => {
    let listWords = []
    // create a set to fillter duplicate word
    let wordSet = new Set()
    for (const item of visibleDataTimestampText.value ?? []) {
      if (item.type === 'word') {
        const yourMeanings = props.statusTagsMeanings[item.cleaned]?.your_meanings ?? []
        
        const status = props.statusTagsMeanings[item.cleaned]?.status ?? 0
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
          
          // const tags = props.statusTagsMeanings[word.cleaned].tags ?? []
          const status = props.statusTagsMeanings[word.cleaned]?.status ?? 0
          if (status === 0 || status === -1 || status === 5 || status === 4) continue

          const yourMeanings = [...(props.statusTagsMeanings[word.cleaned]?.your_meanings ?? [])]

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
        const phraseYourMeanings = props.statusTagsMeanings[phraseCleaned]?.your_meanings
        const phraseStatus = props.statusTagsMeanings[phraseCleaned]?.status ?? 0
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

const listTranslation = ref({
  word: {},
  timestampText: {}
})

watch(visibleDataWordLevel, async (newVal) => {
    const listWords = newVal.filter((item) => item.status === 6).map((item) => item.word)
    // create a set with listTranslation of reduring the number of translation needed
    // const translationSet = new Set(Object.keys(listTranslation.value))
    
    for (const word of listWords) {
      if (!(word in listTranslation.value.word)) {
        const translation = await onTranslate(word)
        listTranslation.value.word[word] = translation
      }
    }

}, {deep: true, immediate: true})




// create a color status for word item and phrase item based on statusTagsMeanings
const colorStatus = {
    1: 'bg-yellow-300',
    2: 'bg-yellow-200',
    3: 'bg-yellow-100',

}


const currentTimestamp = computed(() => props.timestamp[currentTimestampIndex.value] ?? null)

const { saveLastReadWordIdx } = useLastReadPersistence({
  getCsrfToken,
  getLessonAndCourseName: () => props.lessonAndCourseName,
  getIsYoutubeVideo: () => props.isYoutubeVideo,
  resolveYoutubeStartTime: () => currentTimestamp.value.start
})

watch(currentTimestampIndex, async (newVal) => {
    if ((newVal in listTranslation.value.timestampText) && listTranslation.value.timestampText[newVal]) return

    // get new translations
    const text = props.timestamp[newVal]?.text
    if (text) {
        const tranlation = await onTranslate(text)
        listTranslation.value.timestampText[newVal] = tranlation
      }

    lastReadWordIdx.value = findLastReadWordIdx()

    saveLastReadWordIdx(lastReadWordIdx.value, currentTimestamp.value.start)

    // save data to backend

}, { immediate: true })

const handleTranslation = async () => {

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
    const translated = listTranslation.value.word[cleaned]
    if (!translated) return
    if (!props.statusTagsMeanings[cleaned]) {
      props.statusTagsMeanings[cleaned] = {
        status: 1,
        your_meanings: [translated]
      }
    } else {
      props.statusTagsMeanings[cleaned].status = 1
      props.statusTagsMeanings[cleaned].your_meanings = [translated]
    }
  }





}

const changeToKnow = (cleaned) => {
  props.statusTagsMeanings[cleaned].status = 5
}

const changeToIgnore = (cleaned) => {
  props.statusTagsMeanings[cleaned].status = 0
}

const { newStatusDict } = useStatusMap(computed(() => props.statusTagsMeanings))


// select and emit
const { selected } = useSelectedPhrase({
  startPointer,
  currentPointer,
  listSentence: computed(() => props.listSentence),
  cleanWord,
  isValidWord
})

watch(selected, (newVal) => {
    // console.log('selected', newVal)
    emit('selected', newVal)
})


// @sendStatus="currentPhraseData.status = $event"
const emitStatus = (keyboard) => {
  emit('sendStatusFromReader', keyboard)
}

const {
  findLastReadWordIdx,
  changePageStatus,
  changePageStatusByKeyborad,
  moveNextPrevious
} = useKeyboard( startPointer,currentPointer,  core_data, newStatusDict , lessondata, currentTimestampIndex, props.timestamp.length,  emitStatus, selected)

watch([currentTimestampIndex, newStatusDict], () => {
  changePageStatus()
})




onMounted(async() => {
    console.log('timestamp', props.timestamp.length)
    findCurrentTimestampIndex()
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



<style scoped>
.scroll-wrap {
  position: relative;
}

.custom-scroll {
  height: 100%;
  padding-right: 10px;
  scrollbar-width: thin;
  scrollbar-color: #0f172a transparent;
}

/* Chrome, Edge, Safari */
.custom-scroll::-webkit-scrollbar {
  width: 8px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #0f172a;
  border-radius: 9999px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #1e293b;
}

/* Fake arrows */
.scroll-arrow-top {
  top: 4px;
  border-bottom: 6px solid #0f172a;
}

.scroll-arrow-bottom {
  bottom: 4px;
  border-top: 6px solid #0f172a;
}

.scroll-arrow-bottom {
  bottom: 4px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 7px solid #0f172a;
}

.scroll-arrow-top {
  top: 4px;
  border-bottom: 6px solid #0f172a;
}

.scroll-arrow-bottom {
  bottom: 4px;
  border-top: 6px solid #0f172a;
}
</style>




