
import {ref} from 'vue'

export function useEventDelegation(isOpenPopup) {


const startPointer = ref([0, 0, 0, 0])
const currentPointer = ref([0, 0, 0, 0])
const isDraging = ref(false)




const onPointerdown = (indexWord, indexSentence, indexWordInSentence, indexPara) => {
  isDraging.value = true

  startPointer.value = [indexWord, indexSentence, indexWordInSentence, indexPara]
  currentPointer.value = [indexWord, indexSentence, indexWordInSentence, indexPara]


}

const onPointerEnter = (indexWord, indexSentence, indexWordInSentence, indexPara) => {
  if (!isDraging.value) return

  currentPointer.value = [indexWord, indexSentence, indexWordInSentence, indexPara]

}


const getitemData = (e) => {

  const target = e.target

  if (!(target instanceof HTMLElement)) return null
  const WordEl = target.closest('.word-item')

  // print text and its offsetTop of WordEl
  // console.log("Clicked element text:", WordEl?.textContent, "offsetTop:", WordEl?.offsetTop);

  if (WordEl) {
    if (WordEl.dataset.clickable === 'false') return null

      return {
      w_idx : Number(WordEl.dataset.wIdx),
      s_idx : Number(WordEl.dataset.sIdx),
      idx_w_in_s : Number(WordEl.dataset.idxWInS),
      p_idx : Number(WordEl.dataset.pIdx)
    }
  }

  else {
    const phraseEl = target.closest('.phrase-item')

    if (!phraseEl) return
    const itemData = {
      first_w_idx : Number(phraseEl.dataset.firstWIdx),
      first_s_idx : Number(phraseEl.dataset.firstSIdx),
      first_idx_w_in_s : Number(phraseEl.dataset.firstIdxWInS),
      first_p_idx : Number(phraseEl.dataset.firstPIdx),
      end_w_idx : Number(phraseEl.dataset.endWIdx),
      end_s_idx : Number(phraseEl.dataset.endSIdx),
      end_idx_w_in_s : Number(phraseEl.dataset.endIdxWInS),
      end_p_idx : Number(phraseEl.dataset.endPIdx)
    }
    return itemData
  }
 
}



const handlePointerDown = (e) => {
  const itemData = getitemData(e)


  if (!itemData) {
     isOpenPopup.value =false
     return
  }

  isOpenPopup.value = true
  if (Object.keys(itemData).length === 4) {
    onPointerdown(
      itemData.w_idx,
      itemData.s_idx,
      itemData.idx_w_in_s,
      itemData.p_idx,
    )
  }

  else {
    startPointer.value = [
      itemData.first_w_idx,
      itemData.first_s_idx,
      itemData.first_idx_w_in_s,
      itemData.first_p_idx,
    ]
    currentPointer.value = [
      itemData.end_w_idx,
      itemData.end_s_idx,
      itemData.end_idx_w_in_s,
      itemData.end_p_idx,
    ]
  }


}

const handlePointerEnter = (e) => {

  if (!isDraging.value) return;
  
  if (e.buttons !== 1) return


  const itemData = getitemData(e)

  if (!itemData) return

  // onPointerEnter(
  //   itemData.w_idx,
  //   itemData.s_idx,
  //   itemData.idx_w_in_s,
  //   itemData.p_idx,
  // )

  // Word shape
  if ('w_idx' in itemData) {
    onPointerEnter(
      itemData.w_idx,
      itemData.s_idx,
      itemData.idx_w_in_s,
      itemData.p_idx,
    )
    return
  }

  // Phrase shape: use phrase end as current pointer
  onPointerEnter(
    itemData.end_w_idx,
    itemData.end_s_idx,
    itemData.end_idx_w_in_s,
    itemData.end_p_idx,
  )
}


const pointerUp = (e) => {
  isDraging.value = false

 
  if (!(e.target instanceof HTMLElement)) return

  const wordEl = e.target.closest('.word-item')
  const phraseEl = e.target.closest('.phrase-item')
  const popupEl = e.target.closest('.popup-item')

  if (!wordEl && !phraseEl && !popupEl) {
      isOpenPopup.value =false
  }

}



  return {
    startPointer,
    currentPointer,
    handlePointerDown,
    handlePointerEnter,
    pointerUp,
    isDraging,
  }
}
