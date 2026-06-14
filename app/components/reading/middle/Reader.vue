<template>
  <div class=" flex flex-col " :style="{height : readerHeight + 'px'}">

    <div class="relative  overflow-hidden flex flex-wrap gap-y-7" ref="prose" 
      @pointerdown.prevent="handlePointerDown"
      @pointermove="handlePointerEnter">
      <div v-for="(para, idPara) in lessondata" :key="idPara" 
      class="w-full text-3xl flex flex-wrap gap-y-7 px-2  text-start "  >

        <span v-for="(item, idItem) in para" :key="idItem" :class="['h-[44px] flex items-center']">
          <span v-if="item['type'] === 'phrase'" v-show="item['visible']"
            class="phrase-item flex  gap-y-7 h-full  items-center  rounded  ring-2 ring-inset ring-transparent hover:ring-yellow-400"
            :class="['status-' + item['status'],  isActivePara(idPara) && 'border-b-2 border-gray-400']" 
            :data-first-w-idx="item['phrase'][0]['w_idx']"
            :data-first-s-idx="item['phrase'][0]['s_idx']" 
            :data-first-idx-w-in-s="item['phrase'][0]['idx_w_in_s']"
            :data-first-p-idx="item['phrase'][0]['p_idx']"
            :data-end-w-idx="item['phrase'][item['phrase'].length - 1]['w_idx']"
            :data-end-s-idx="item['phrase'][item['phrase'].length - 1]['s_idx']"
            :data-end-idx-w-in-s="item['phrase'][item['phrase'].length - 1]['idx_w_in_s']"
            :data-end-p-idx="item['phrase'][item['phrase'].length - 1]['p_idx']">
            <span v-for="(word) in item['phrase']"
              :class="['inline-flex items-center h-[35px]  px-1', (isActice(word['w_idx']) && isOpenPopup) && 'bg-blue-400']"
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
            :class="['flex  h-[35px]  items-center px-1 -blue-400 ', (isActice(item['w_idx']) && isOpenPopup) && 'bg-blue-400', isActivePara(idPara) && 'border-b-2 border-gray-400']">
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


      <div class="w-full " :style="{ height: remaining + 'px' }">
        <!-- <span>selected : {{selected.text}}</span> -->
      </div>
    </div>

    <!-- <div class="fixed inset-0 pointer-events-none z-10">
      <div v-if="startPointer"
        :class="['absolute pointer-events-auto', (!popupCoordinates.downward) && '-translate-y-full']"
        :style="{ left: popupCoordinates.x + 'px', top: popupCoordinates.y + 'px' }">
        <Popup :word="selected.text" v-if="isOpenPopup && !isDraging" @close-popup="isOpenPopup = $send" class="popup-item" />
      </div>
    </div> -->
  </div>
</template>

<script setup>
/* =========================================================
   Imports
========================================================= */
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

import Popup from './Popup.vue'
import debounce from "lodash/debounce";
const { getCsrfToken } = useCsrf()


/* =========================================================
   Composables / Data Sources
   - Keep these near the top so readers know “where data comes from”
========================================================= */

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
  lessonAndCourseName: {type: Object, default: () => ({})},
  audioCurrentTime: {
    type: Object,
    default: () => ({
      currentTime: 0,
      syncTimeToText: false
    })
  }}
)
const lessondata = ref(props.lessonData)
const core_data = props.coreData
const lastReadWordIdx = ref(props.lastReadWordIdx)
console.log("lastReadWordIdx in reader.vue", lastReadWordIdx.value)

const moveToLastReadingPage = () => {
  if (!prose.value) return
  const wordItems = prose.value.querySelectorAll('.word-item')
  // find the word-item with data-w-idx equal to lastReadWordIdx
  const targetWord = Array.from(wordItems).find(item => parseInt(item.dataset.wIdx) === lastReadWordIdx.value)
  // calculate the offset top of this word
  if (!targetWord || !prose.value) return
  const offsetTop = targetWord.offsetTop
  // calculate which page this offset top is in
  const page = Math.floor(offsetTop / view.value) + 1
  currentPage.value = page
}

const newStatusDict = computed(() => {
  const statusDict = {}
  const listKeys = Object.keys(props.statusTagsMeanings)
  for (const item of listKeys) {
    if (item.split(" ").length === 1|| props.statusTagsMeanings[item].status >0) {
       statusDict[item] = props.statusTagsMeanings[item].status
    }
   
  }
  return statusDict
})

const emit = defineEmits(['update:currentValue', 'sendTotalPage', 'selected', 'sendStatusFromReader'])

const currentPage = computed({
  get: () => props.currentValue,
  set: (v) => emit('update:currentValue', v)
})


const saveLastReadWordIdx = debounce(
  async(newLastReadWordIdx, youtubeStartTime) => {
    try {

      let payload = {
        lessonName: props.lessonAndCourseName.lessonName,
        courseName: props.lessonAndCourseName.courseName,
        lastReadWordIdx: newLastReadWordIdx,
        isYoutubeVideo: props.isYoutubeVideo,
        youtubeStartTime: youtubeStartTime
      }

      if (props.isYoutubeVideo) {
        payload.youtubeStartTime = props.audioCurrentTime.currentTime
        
      }
      await $fetch(`/api/update_last_read_word_idx/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify(payload),
      })
    } catch (error) {
      console.error('Failed to update last read word index:', error)
    }
  }, 1000
)

watch(currentPage, (newVal) => {
    scrollNewPage(newVal);
    if (!prose.value) return
    // find all word-item elements
    const wordItems = prose.value.querySelectorAll('.word-item')

    const currentPageOffsetTop = (newVal - 1) * view.value
    // find the fist word of this page
    const targetWord = Array.from(wordItems).find(item => item.offsetTop >= currentPageOffsetTop )
    // interpolate the word index
    const targetWordIdx = targetWord ? parseInt(targetWord.dataset.wIdx) : 1
    saveLastReadWordIdx(targetWordIdx, props.audioCurrentTime.currentTime)
    
})



const targetParagraphIdx = ref(null)
// sync audio time from youtube video to parent component
watch(() => props.audioCurrentTime, (newVal) => {
    const currentTime = newVal.currentTime + 0.5 // add 0.5s delay to sync better, this can be adjusted based on testing
    const syncTimeToText = newVal.syncTimeToText 

  
    if (!props.isYoutubeVideo || !Array.isArray(props.timestamp) || props.timestamp.length === 0) {

      return
    }

    let currentTimestampIdx = props.timestamp.findIndex(
      item => item.start <= currentTime && item.end >= currentTime
    )
    const matchedTimestamp = currentTimestampIdx === -1 ? null : props.timestamp[currentTimestampIdx]
    targetParagraphIdx.value = currentTimestampIdx === -1 ? null :  matchedTimestamp.ts_idx

    if (currentTimestampIdx === -1) {
      
      if (currentTime < props.timestamp[0].start) {
          targetParagraphIdx.value = props.timestamp[0].ts_idx
      
      }
      else if  (currentTime > props.timestamp[props.timestamp.length -1].end) {
        targetParagraphIdx.value = props.timestamp[props.timestamp.length -1].ts_idx
    
      }
    }


    
    // console.log('paragraph idx', targetParagraphIdx.value)

    if (!syncTimeToText) return
    if (!prose.value) {
  
      return
    }
    const items = prose.value.querySelectorAll(".word-item")

    const firstWordElement = Array.from(items).find(item => parseInt(item.dataset.pIdx) === targetParagraphIdx.value )
    // caculate the offset top of this word
    if (!firstWordElement) {

      return
    }
    const offsetTop = firstWordElement.offsetTop
    // caculate which page this offset top is in
    const page = Math.floor(offsetTop / view.value) + 1
 
    currentPage.value = page


})

const isActivePara = (p_idx) => {

  
  return p_idx === targetParagraphIdx.value
}


watch([currentPage, newStatusDict], () => {
  changePageStatus()
})



const totalPage = ref(1)


const sendPages = () => {
  emit('sendTotalPage', totalPage.value)
}

const {
  view,
  prose,
  remaining,
  updateTotalPages,
  scrollNewPage,
} = pagination(props.readerHeight , currentPage, totalPage, sendPages)

// @sendStatus="currentPhraseData.status = $event"
const emitStatus = (keyboard) => {
  emit('sendStatusFromReader', keyboard)
}

/* =========================================================
   Derived State (Computed)
   - Keep “what the UI shows” separate from “what actions do”
========================================================= */
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
    // console.log('currentPage', currentPage.value)
    // console.log('startPointer', startPointer.value[0])
    // // current page of this startPointer
    // const items = prose.value.querySelectorAll(".word-item")
    // const firstWordElement = Array.from(items).find(item => parseInt(item.dataset.wIdx) === startPointer.value[0] )
    // const offsetTop = firstWordElement ? firstWordElement.offsetTop : 0
    // const page = Math.floor(offsetTop / view.value) + 1
    // console.log('page of startPointer', page)
    emit('selected', newVal)
})

const {changePageStatus,changePageStatusByKeyborad, moveNextPrevious} = useKeyboard(startPointer,currentPointer, prose, view, core_data, newStatusDict , lessondata, currentPage, totalPage,  emitStatus, selected)




watch( () => props.currentPhraseStatus,  (newVal) => {

  changePageStatus(newVal)

})
/* =========================================================
   Local UI State
========================================================= */
const popupCoordinates = ref({ x: 0, y: 0, downward: true })





/* =========================================================
   Watchers
   - Watchers describe “reactive side effects”
========================================================= */
watch(startPointer, (newVal) => {
  // Guard: if selection cleared, do nothing
  if (!newVal) return

  const wordIndex = newVal[0]
  popupCoordinates.value.downward = true

  const wordEl = document.getElementById(`w-${wordIndex}`)
  if (!wordEl || !prose.value) return

  // Cache prose bounding box to avoid repeated layout reads
  const proseRect = prose.value.getBoundingClientRect()
  const wordRect = wordEl.getBoundingClientRect()

  // Default position: below the word
  popupCoordinates.value.x = wordRect.left - 10
  popupCoordinates.value.y = wordRect.bottom + 10

  // Prevent popup overflowing the prose container (right/bottom)
  if (popupCoordinates.value.x + 400 > proseRect.right) {
    popupCoordinates.value.x = proseRect.right - 400
  }

  if (popupCoordinates.value.y + 300 > proseRect.bottom) {
    popupCoordinates.value.downward = false
    popupCoordinates.value.y -= 50
  }
})

/**
 * Returns true if a word is in the active selection range (UI highlight).
 * Note: name kept as-is to avoid breaking template usage.
 */
const isActice = (wordIndex) => {

  
  if (!startPointer.value || !currentPointer.value) return false

  const a = Math.min(startPointer.value[0], currentPointer.value[0])
  const b = Math.max(startPointer.value[0], currentPointer.value[0])

  return wordIndex >= a && wordIndex <= b
}


/**
 * Move next or previous page by keyborad.
 * Move next or previous page by keyborad.
 */
const itemFirstAndLastOfPage = computed(() => {
  // const proseHeight = prose.value.scrollTop
  // const offSetTop = currentPage.value
  return prose.value.scrollTop
})


/* =========================================================
   Lifecycle: mount/unmount side-effects
========================================================= */

const handleVisibilityChange = () => {
  if (document.hidden) {
    saveLastReadWordIdx.flush()
  }
}
onMounted(async () => {
  // Ensure pagination is correct on first render
  await updateTotalPages()
  moveToLastReadingPage()
  emit('selected', selected.value)
  // Global listeners (remember to remove them on unmount)
  window.addEventListener('resize', updateTotalPages)
  window.addEventListener('pointerup', pointerUp)
  window.addEventListener('keydown', changePageStatusByKeyborad)
  window.addEventListener('keydown', moveNextPrevious)

  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTotalPages)
  window.removeEventListener('pointerup', pointerUp)
  window.removeEventListener('keydown', changePageStatusByKeyborad)
  window.removeEventListener('keydown', moveNextPrevious)
   document.removeEventListener('visibilitychange', handleVisibilityChange)
  saveLastReadWordIdx.flush() // immediately invoke the debounced function to save the last read word index before unmounting
  saveLastReadWordIdx.cancel()
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
