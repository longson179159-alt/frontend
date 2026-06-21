

export function useKeyboard( startPointer,currentPointer, prose, view, core_data, newStatusDict , lessondata, currentPage, totalPage,  emitStatus, selected)  {


const changePageStatus =  () => {

  let scrollTop = (currentPage.value -1) * view.value
  let scrollBottom  = scrollTop + view.value

  // this fixed the unknown bug, when brower caculate wrongly
  if (currentPage.value === totalPage.value - 1) scrollBottom += view.value
  if (currentPage.value === totalPage.value) scrollTop  = Math.max(0, scrollTop - view.value)

  const items = prose.value.querySelectorAll(".word-item")
  const firstEl = Array.from(items).find(el => el.offsetTop >= scrollTop)
  const lastEl = Array.from(items).findLast(el => el.offsetTop < scrollBottom)



  const indexParaStart = Number(firstEl?.dataset?.pIdx)
  const indexParaEnd = Number(lastEl?.dataset?.pIdx)

  if (!Number.isInteger(indexParaStart) || !Number.isInteger(indexParaEnd) || indexParaEnd < indexParaStart) {
    return
  }


  const {lessondataChunk} = useCreateLesson(core_data, newStatusDict, indexParaStart, indexParaEnd + 1)
  lessondata.value.splice(indexParaStart, indexParaEnd - indexParaStart + 1, ...lessondataChunk)


}

const getDataCurrentPage = () => {
    let scrollTop = (currentPage.value - 1) * view.value
    let scrollBottom = scrollTop + view.value
    const flatLessonData = lessondata.value.flat()
    const items = prose.value.querySelectorAll(".word-item")
    const firstItemEl = Array.from(items).find(item => item.offsetTop >= scrollTop)
    const lastItemEl = Array.from(items).findLast(item => item.offsetTop <= scrollBottom)
    const first = firstItemEl ? Number(firstItemEl.dataset.wIdx) : null
    const last = lastItemEl ? Number(lastItemEl.dataset.wIdx) : null

    // cacluate page of startPointer
    const activeElement = Array.from(items).find(item => parseInt(item.dataset.wIdx) === startPointer.value[0] )
    
    const activePage = activeElement
      ? Math.floor(activeElement.offsetTop / view.value) + 1
      : 0



    // find the first 6 status in this page 
    const firstSixStatus = flatLessonData.find(
        item =>
          (item['w_idx'] >= first || item['phrase']?.[0]?.['w_idx'] >= first) &&
          (item['w_idx'] <= last || item['phrase']?.[0]?.['w_idx'] <= last) &&
          item['status'] === 6
      )


    if (first == null || last == null) {
      return [null, null, activePage,  null, null, null, null, firstSixStatus]
    }
    

    
    let firstValidStartPointer = null
    let firstValidCurrentPointer = null
    const firstValidItem = flatLessonData.find(
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

    
    const lastValidItem = flatLessonData.findLast(
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
  // guard inpute and textarea
  const target = e.target
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    return
  }
  
  const listKeys = ['x', '1', '2', '3', '4', '5']
  if (!listKeys.includes(e.key)) return

  const newStatus = (e.key === 'x') ? 0 : Number(e.key)
  if (!selected.value.valid) {
    return
  }
  emitStatus(newStatus)
  changePageStatus()
 
  }
const moveNextPrevious = (e) => {
    const target = e.target
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return
    }
    if (e.key === 'ArrowLeft' && e.shiftKey) {
      e.preventDefault();
      currentPage.value = Math.max(1, currentPage.value -1)
    }

    if (e.key === 'ArrowRight' && e.shiftKey) {
      e.preventDefault();
      currentPage.value = Math.min(currentPage.value + 1, totalPage.value)
    }

    // 
    if (e.key === 'ArrowRight' && !(e.key === 'ArrowRight' && e.shiftKey)) {
      const target = e.target
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }

      if (!currentPointer.value || !startPointer.value) return
      const wordIndex = currentPointer.value[0]
      const paraIndex = currentPointer.value[3]

      const [first, last, activePage, firstValidStartPointer, firstValidCurrentPointer, lastValidStartPointer, lastValidCurrentPointer , firstSixStatus] = getDataCurrentPage()
      let newCurrentPointer = null
      let newStartPointer = null
  

      for (let i = paraIndex; i < lessondata.value.length; i++) {
        const paraData = lessondata.value[i]
        const nextIndex = paraData.findIndex(item => (item['w_idx'] > wordIndex || item['phrase']?.[0]?.['w_idx'] > wordIndex) && [1,2,3,4, 6].includes(item['status']) )
        if (nextIndex === -1) continue
        
        if (paraData[nextIndex]['type'] === 'phrase') {
          
          const startItem = paraData[nextIndex]['phrase'][0]
          const endItem = paraData[nextIndex]['phrase'][paraData[nextIndex]['phrase'].length-1]
          newStartPointer = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
          newCurrentPointer = [endItem['w_idx'], endItem['s_idx'], endItem['idx_w_in_s'] , endItem['p_idx']]
        }
        else {
            const startItem = paraData[nextIndex]
            newStartPointer = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
            newCurrentPointer = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
        }
        break
      }

      if (currentPage.value !== activePage) {
          if (!firstValidCurrentPointer || !firstValidStartPointer) {
            e.preventDefault();
            currentPage.value = Math.min(currentPage.value + 1, totalPage.value)
          }

          else {
            startPointer.value = firstValidStartPointer
            currentPointer.value = firstValidCurrentPointer
          }
      }

      else {
           if (!newStartPointer || last == null) return
      // check if new element inside current page
        if (newStartPointer[0] <= last) {
            startPointer.value = newStartPointer
            currentPointer.value = newCurrentPointer
        
      
        }

        else {
          e.preventDefault();
          currentPage.value = Math.min(currentPage.value + 1, totalPage.value)
        }
      }

      
    }
    if (e.key === 'ArrowLeft' && !(e.key === 'ArrowLeft' && e.shiftKey)) {
      const target = e.target
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }

      if (!currentPointer.value || !startPointer.value) return

      const [first, last, activePage, firstValidStartPointer, firstValidCurrentPointer, lastValidStartPointer, lastValidCurrentPointer, firstSixStatus ] = getDataCurrentPage()
      const wordIndex = startPointer.value[0]
      const paraIndex = startPointer.value[3]
      let newCurrentPointer = null
      let newStartPointer = null

  

      for (let i = paraIndex; i >= 0; i--) {
        const paraData = lessondata.value[i]
        const lastIndex = paraData.findLastIndex(item => (item['w_idx'] < wordIndex || item['phrase']?.[0]?.['w_idx'] < wordIndex) && [1,2,3,4,6].includes(item['status']) )
        if (lastIndex === -1) continue

        if (paraData[lastIndex]['type'] === 'phrase') {
          
          const startItem = paraData[lastIndex]['phrase'][0]
          const endItem = paraData[lastIndex]['phrase'][paraData[lastIndex]['phrase'].length-1]
          newStartPointer = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
          newCurrentPointer = [endItem['w_idx'], endItem['s_idx'], endItem['idx_w_in_s'] , endItem['p_idx']]
        }
        else {
            const startItem = paraData[lastIndex]
            newStartPointer = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
            newCurrentPointer = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
        }
        break
      }

      if (currentPage.value !== activePage) {
        if (!lastValidStartPointer || !lastValidCurrentPointer) {
          e.preventDefault();
          currentPage.value = Math.max(1, currentPage.value -1)
        }

        else {
          startPointer.value = lastValidStartPointer
          currentPointer.value = lastValidCurrentPointer
        }
        
      }

      else {
           if (!newStartPointer || first == null) return
          if (newStartPointer[0] >= first) {
              startPointer.value = newStartPointer
              currentPointer.value = newCurrentPointer
          
            }

          else {
            e.preventDefault();
            currentPage.value = Math.max(1, currentPage.value - 1)
          }

          }

      }

    
     

    if (e.key === 'b' ) {

      const target = e.target
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }
      if (!currentPointer.value || !startPointer.value) return
      const wordIndex = currentPointer.value[0]
      const paraIndex = currentPointer.value[3]

      const [first, last, activePage, firstValidStartPointer, firstValidCurrentPointer, lastValidStartPointer, lastValidCurrentPointer, firstSixStatus ] = getDataCurrentPage()
      let newCurrentPointer = null
      let newStartPointer = null
  

      for (let i = paraIndex; i < lessondata.value.length; i++) {
        const paraData = lessondata.value[i]
        const nextIndex = paraData.findIndex(item => (item['w_idx'] > wordIndex || item['phrase']?.[0]?.['w_idx'] > wordIndex) && item['status'] === 6 )
        if (nextIndex === -1) continue

        if (paraData[nextIndex]['type'] === 'phrase') {
          
          const startItem = paraData[nextIndex]['phrase'][0]
          const endItem = paraData[nextIndex]['phrase'][paraData[nextIndex]['phrase'].length-1]
          newStartPointer = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
          newCurrentPointer = [endItem['w_idx'], endItem['s_idx'], endItem['idx_w_in_s'] , endItem['p_idx']]
        }
        else {
            const startItem = paraData[nextIndex]
            newStartPointer = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
            newCurrentPointer = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
        }
        break
      }
      

      if (currentPage.value !== activePage) {
          if (!firstSixStatus || firstSixStatus['type'] !== 'word') return
          startPointer.value = [firstSixStatus['w_idx'], firstSixStatus['s_idx'], firstSixStatus['idx_w_in_s'], firstSixStatus['p_idx']]
          currentPointer.value = startPointer.value
      }

      else {
          if (!newStartPointer || last == null) return
      if (newStartPointer[0] > last) return
      startPointer.value = newStartPointer
      currentPointer.value = newCurrentPointer
      }
   
    
    }
}



    return {
        changePageStatus,
        changePageStatusByKeyborad,
        moveNextPrevious
    }
}