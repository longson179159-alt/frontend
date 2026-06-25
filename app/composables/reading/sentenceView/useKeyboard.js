
import { useCreateLesson } from '~/composables/reading/shared/useCreateLesson'

export function useKeyboard( startPointer,currentPointer,  core_data, newStatusDict , lessondata, currentTimestampIndex, totalPage,  emitStatus, selected)  {


const changePageStatus = () => {

  const { lessondataChunk } = useCreateLesson(
    core_data,
    newStatusDict,
    currentTimestampIndex.value,
    currentTimestampIndex.value + 1
  )
 
  lessondata.value.splice(currentTimestampIndex.value, 1, ...lessondataChunk)
}

const getDataCurrentPage = () => {
    
    const paraData = lessondata.value[currentTimestampIndex.value] ?? []
    const core_para_data = (core_data[currentTimestampIndex.value] ?? []).flat().sort((a, b) => a.w_idx - b.w_idx)
    const first = core_para_data?.[0]?.['w_idx'] ?? null
    const last = core_para_data?.[core_para_data.length - 1]?.['w_idx'] ?? null

    // cacluate page of startPointer
   
    const activePage = startPointer?.value[3]



    // find the first 6 status in this page 
    const firstSixStatus = paraData.find(
        item =>
            (item['type'] >= 'word' ) &&    
          (item['w_idx'] >= first ) &&
          (item['w_idx'] <= last ) &&
          item['status'] === 6
      )


    if (first == null || last == null) {
      return [null, null, activePage,  null, null, null, null, firstSixStatus]
    }
    

    
    let firstValidStartPointer = null
    let firstValidCurrentPointer = null
    const firstValidItem = paraData.find(
        item =>
          (item['w_idx'] >= first || item['phrase']?.[0]?.['w_idx'] >= first) &&
          (item['w_idx'] <= last || item['phrase']?.[0]?.['w_idx'] <= last) &&
          [1, 2, 3, 4, 6].includes(item['status'])
      )

      if (firstValidItem) {
           if (firstValidItem['type'] === 'phrase') {
          
          const startItem = firstValidItem['phrase'][0]
          const endItem = firstValidItem['phrase'][firstValidItem['phrase'].length-1]
          firstValidStartPointer = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
          firstValidCurrentPointer = [endItem['w_idx'], endItem['s_idx'], endItem['idx_w_in_s'] , endItem['p_idx']]
        }
      else {
            firstValidItem
            firstValidStartPointer = [firstValidItem['w_idx'], firstValidItem['s_idx'], firstValidItem['idx_w_in_s'] , firstValidItem['p_idx']]
            firstValidCurrentPointer = [firstValidItem['w_idx'], firstValidItem['s_idx'], firstValidItem['idx_w_in_s'] , firstValidItem['p_idx']]
        }
      }

     


    let lastValidStartPointer = null
    let lastValidCurrentPointer = null

    
    const lastValidItem = paraData.findLast(
        item =>
          (item['w_idx'] >= first || item['phrase']?.[0]?.['w_idx'] >= first) &&
          (item['w_idx'] <= last || item['phrase']?.[0]?.['w_idx'] <= last) &&
          [1, 2, 3, 4, 6].includes(item['status'])
      )


      if (lastValidItem) {
          if (lastValidItem['type'] === 'phrase') {
        const startItem = lastValidItem['phrase'][0]
        const endItem = lastValidItem['phrase'][lastValidItem['phrase'].length-1]
        lastValidStartPointer = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
          lastValidCurrentPointer = [endItem['w_idx'], endItem['s_idx'], endItem['idx_w_in_s'] , endItem['p_idx']]
        }
      else {
            lastValidStartPointer = [lastValidItem['w_idx'], lastValidItem['s_idx'], lastValidItem['idx_w_in_s'] , lastValidItem['p_idx']]
            lastValidCurrentPointer = [lastValidItem['w_idx'], lastValidItem['s_idx'], lastValidItem['idx_w_in_s'] , lastValidItem['p_idx']]
        }
      }
    
    
          
        
    return [
      first,
      last,
      activePage,
      firstValidStartPointer,
      firstValidCurrentPointer,
      lastValidStartPointer,
      lastValidCurrentPointer,
      firstSixStatus
      
    ]
}


const changePageStatusByKeyborad = (e) => {

  
  const listKeys = ['x', '1', '2', '3', '4', '5']
  if (!listKeys.includes(e.key)) return

  const newStatus = (e.key === 'x') ? 0 : Number(e.key)
  if (!selected.value.valid) {
    return
  }
  emitStatus(newStatus)
  changePageStatus()
 
  }

const getPointersFromItem = (item) => {
  if (!item) {
    return {
      startPointer: null,
      currentPointer: null
    }
  }

  if (item['type'] === 'phrase') {
    const startItem = item['phrase'][0]
    const endItem = item['phrase'][item['phrase'].length - 1]

    return {
      startPointer: [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'], startItem['p_idx']],
      currentPointer: [endItem['w_idx'], endItem['s_idx'], endItem['idx_w_in_s'], endItem['p_idx']]
    }
  }

  return {
    startPointer: [item['w_idx'], item['s_idx'], item['idx_w_in_s'], item['p_idx']],
    currentPointer: [item['w_idx'], item['s_idx'], item['idx_w_in_s'], item['p_idx']]
  }
}

const setPointers = (newStartPointer, newCurrentPointer) => {
  startPointer.value = newStartPointer
  currentPointer.value = newCurrentPointer
}

const changePageByOffset = (offset) => {
  if (offset > 0) {
    currentTimestampIndex.value = Math.min(currentTimestampIndex.value + offset, totalPage -1)
    return
  }

  currentTimestampIndex.value = Math.max(0, currentTimestampIndex.value + offset)
}

const findForwardPointer = (paraIndex, predicate) => {
  for (let i = paraIndex; i < lessondata.value.length; i++) {
    const paraData = lessondata.value[i]
    const nextIndex = paraData.findIndex(predicate)
    if (nextIndex === -1) continue

    return getPointersFromItem(paraData[nextIndex])
  }

  return {
    startPointer: null,
    currentPointer: null
  }
}

const findBackwardPointer = (paraIndex, predicate) => {
  for (let i = paraIndex; i >= 0; i--) {
    const paraData = lessondata.value[i]
    const lastIndex = paraData.findLastIndex(predicate)
    if (lastIndex === -1) continue

    return getPointersFromItem(paraData[lastIndex])
  }

  return {
    startPointer: null,
    currentPointer: null
  }
}

const handleShiftPageNavigation = (e) => {
  if (e.key === 'ArrowLeft' && e.shiftKey) {
    const target = e.target
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return
    }
    e.preventDefault();
    changePageByOffset(-1)
    return true
  }

  if (e.key === 'ArrowRight' && e.shiftKey) {
    const target = e.target
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return
    }
    e.preventDefault();
    changePageByOffset(1)
    return true
  }

  return false
}

const handleArrowRight = (e) => {
  const target = e.target
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    return
  }
  if (!currentPointer.value || !startPointer.value) return
  const wordIndex = currentPointer.value[0]
  const paraIndex = currentPointer.value[3]

  const [first, last, activePage, firstValidStartPointer, firstValidCurrentPointer] = getDataCurrentPage()

  // console.log('first', first, 'last', last, 'activePage', activePage, 'firstValidStartPointer', firstValidStartPointer, 'firstValidCurrentPointer', firstValidCurrentPointer)
  const { startPointer: newStartPointer, currentPointer: newCurrentPointer } = findForwardPointer(
    paraIndex,
    item => (item['w_idx'] > wordIndex || item['phrase']?.[0]?.['w_idx'] > wordIndex) && [1,2,3,4, 6].includes(item['status'])
  )

  if (currentTimestampIndex.value !== activePage) {
      if (!firstValidCurrentPointer || !firstValidStartPointer) {
        e.preventDefault();
        changePageByOffset(1)
      }

      else {
        setPointers(firstValidStartPointer, firstValidCurrentPointer)
      }
  }

  else {
       if (!newStartPointer || last == null) return
    if (newStartPointer[0] <= last) {
        setPointers(newStartPointer, newCurrentPointer)
    }

    else {
      e.preventDefault();
      changePageByOffset(1)
    }
  }
}

const handleArrowLeft = (e) => {
  if (!currentPointer.value || !startPointer.value) return

  const [first, last, activePage, firstValidStartPointer, firstValidCurrentPointer, lastValidStartPointer, lastValidCurrentPointer ] = getDataCurrentPage()
  const wordIndex = startPointer.value[0]
  const paraIndex = startPointer.value[3]
  const { startPointer: newStartPointer, currentPointer: newCurrentPointer } = findBackwardPointer(
    paraIndex,
    item => (item['w_idx'] < wordIndex || item['phrase']?.[0]?.['w_idx'] < wordIndex) && [1,2,3,4,6].includes(item['status'])
  )

  if (currentTimestampIndex.value !== activePage) {
    if (!lastValidStartPointer || !lastValidCurrentPointer) {
      e.preventDefault();
      changePageByOffset(-1)
    }

    else {
      setPointers(lastValidStartPointer, lastValidCurrentPointer)
    }
    
  }

  else {
       if (!newStartPointer || first == null) return
      if (newStartPointer[0] >= first) {
          setPointers(newStartPointer, newCurrentPointer)
        }

      else {
        e.preventDefault();
        changePageByOffset(-1)
      }

      }
}

const handleKeyB = () => {
  if (!currentPointer.value || !startPointer.value) return
  const wordIndex = currentPointer.value[0]
  const paraIndex = currentPointer.value[3]

  const [first, last, activePage, firstValidStartPointer, firstValidCurrentPointer, lastValidStartPointer, lastValidCurrentPointer, firstSixStatus ] = getDataCurrentPage()
  const { startPointer: newStartPointer, currentPointer: newCurrentPointer } = findForwardPointer(
    paraIndex,
    item => (item['w_idx'] > wordIndex || item['phrase']?.[0]?.['w_idx'] > wordIndex) && item['status'] === 6
  )

  if (currentTimestampIndex.value !== activePage) {
      if (!firstSixStatus || firstSixStatus['type'] !== 'word') return
      const nextPointer = [firstSixStatus['w_idx'], firstSixStatus['s_idx'], firstSixStatus['idx_w_in_s'], firstSixStatus['p_idx']]
      setPointers(nextPointer, nextPointer)
  }

  else {
      if (!newStartPointer || last == null) return
    if (newStartPointer[0] > last) return
    setPointers(newStartPointer, newCurrentPointer)
  }
}

const moveNextPrevious = (e) => {
    if (handleShiftPageNavigation(e)) return

    if (e.key === 'ArrowRight') {
      const target = e.target
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      } 

      handleArrowRight(e)
    }

    if (e.key === 'ArrowLeft') {
      const target = e.target
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }
      handleArrowLeft(e)
    }

    if (e.key === 'b' ) {
      const target = e.target
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }
      handleKeyB()
    }
}

const findLastReadWordIdx = () => {
    const [first, last, activePage, firstValidStartPointer, firstValidCurrentPointer, lastValidStartPointer, lastValidCurrentPointer, firstSixStatus ] = getDataCurrentPage()
    if (!currentPointer.value || !startPointer.value) return first ?? 0
    const wordIndex = currentPointer.value[0]
    const paraIndex = currentPointer.value[3]


    if (currentTimestampIndex.value !== activePage) {
      return first ?? 0
    }

    else {
      return startPointer[0]
    }

}


    return {
        findLastReadWordIdx,
        changePageStatus,
        changePageStatusByKeyborad,
        moveNextPrevious
    }
}
