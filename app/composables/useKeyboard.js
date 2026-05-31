



export function useKeyboard( startPointer,currentPointer, prose, view, core_data, newStatusDict , lessondata, currentPage, totalPage,  emitStatus, selected)  {


const changePageStatus =  () => {

  let scrollTop = (currentPage.value -1) * view.value
  let scrollBottom  = scrollTop + view.value

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
const moveNextPrevious = (e) => {
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

      if (!currentPointer.value || !startPointer.value) return
      const wordIndex = currentPointer.value[0]
      const paraIndex = currentPointer.value[3]
  

      for (let i = paraIndex; i < lessondata.value.length; i++) {
        const paraData = lessondata.value[i]
        const nextIndex = paraData.findIndex(item => (item['w_idx'] > wordIndex || item['phrase']?.[0]?.['w_idx'] > wordIndex) && [1,2,3,4, 6].includes(item['status']) )
        if (nextIndex === -1) continue
        // console.log('nextIndex' , nextIndex)
        // console.log('paraData[nextIndex]', paraData[nextIndex])
        if (paraData[nextIndex]['type'] === 'phrase') {
          
          const startItem = paraData[nextIndex]['phrase'][0]
          const endItem = paraData[nextIndex]['phrase'][paraData[nextIndex]['phrase'].length-1]
          startPointer.value = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
          currentPointer.value = [endItem['w_idx'], endItem['s_idx'], endItem['idx_w_in_s'] , endItem['p_idx']]
        }
        else {
            const startItem = paraData[nextIndex]
            startPointer.value = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
            currentPointer.value = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
        }
        break
      }

      setTimeout(() => {
        changePageStatus()
      }, 500)
      // changePageStatus()
      
    }
    if (e.key === 'ArrowLeft' && !(e.key === 'ArrowLeft' && e.shiftKey)) {

      if (!currentPointer.value || !startPointer.value) return
      const wordIndex = startPointer.value[0]
      const paraIndex = startPointer.value[3]
  

      for (let i = paraIndex; i >= 0; i--) {
        const paraData = lessondata.value[i]
        const lastIndex = paraData.findLastIndex(item => (item['w_idx'] < wordIndex || item['phrase']?.[0]?.['w_idx'] < wordIndex) && [1,2,3,4,6].includes(item['status']) )
        if (lastIndex === -1) continue

        if (paraData[lastIndex]['type'] === 'phrase') {
          
          const startItem = paraData[lastIndex]['phrase'][0]
          const endItem = paraData[lastIndex]['phrase'][paraData[lastIndex]['phrase'].length-1]
          startPointer.value = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
          currentPointer.value = [endItem['w_idx'], endItem['s_idx'], endItem['idx_w_in_s'] , endItem['p_idx']]
        }
        else {
            const startItem = paraData[lastIndex]
            startPointer.value = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
            currentPointer.value = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
        }
        break
      }
      setTimeout(() => {
        changePageStatus()
      }, 500)
    }

    if (e.key === 'b' ) {

      if (!currentPointer.value || !startPointer.value) return
      const wordIndex = currentPointer.value[0]
      const paraIndex = currentPointer.value[3]
  

      for (let i = paraIndex; i < lessondata.value.length; i++) {
        const paraData = lessondata.value[i]
        const nextIndex = paraData.findIndex(item => (item['w_idx'] > wordIndex || item['phrase']?.[0]?.['w_idx'] > wordIndex) && item['status'] === 6 )
        if (nextIndex === -1) continue
        // console.log('nextIndex' , nextIndex)
        // console.log('paraData[nextIndex]', paraData[nextIndex])
        if (paraData[nextIndex]['type'] === 'phrase') {
          
          const startItem = paraData[nextIndex]['phrase'][0]
          const endItem = paraData[nextIndex]['phrase'][paraData[nextIndex]['phrase'].length-1]
          startPointer.value = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
          currentPointer.value = [endItem['w_idx'], endItem['s_idx'], endItem['idx_w_in_s'] , endItem['p_idx']]
        }
        else {
            const startItem = paraData[nextIndex]
            startPointer.value = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
            currentPointer.value = [startItem['w_idx'], startItem['s_idx'], startItem['idx_w_in_s'] , startItem['p_idx']]
        }
        break
      }
      
      setTimeout(() => {
        changePageStatus()
      }, 500)
    }
}



    return {
        changePageStatus,
        changePageStatusByKeyborad,
        moveNextPrevious
    }
}
