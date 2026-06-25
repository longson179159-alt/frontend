import { useCreateLesson } from '~/composables/reading/shared/useCreateLesson'

const NAVIGABLE_STATUSES = [1, 2, 3, 4, 6]
const STATUS_SHORTCUT_KEYS = ['x', '1', '2', '3', '4', '5']

export function useKeyboard(startPointer, currentPointer, prose, view, core_data, newStatusDict, lessondata, currentPage, totalPage, emitStatus, selected) {
  const isTypingTarget = (target) => target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA'

  const getWordItems = () => Array.from(prose.value?.querySelectorAll('.word-item') ?? [])

  const getItemStartWordIndex = (item) => item?.w_idx ?? item?.phrase?.[0]?.w_idx

  const isItemInRange = (item, first, last) =>
    (item?.w_idx >= first || item?.phrase?.[0]?.w_idx >= first) &&
    (item?.w_idx <= last || item?.phrase?.[0]?.w_idx <= last)

  const createPointersFromItem = (item) => {
    if (!item) return { start: null, current: null }

    if (item.type === 'phrase') {
      const startItem = item.phrase[0]
      const endItem = item.phrase[item.phrase.length - 1]

      return {
        start: [startItem.w_idx, startItem.s_idx, startItem.idx_w_in_s, startItem.p_idx],
        current: [endItem.w_idx, endItem.s_idx, endItem.idx_w_in_s, endItem.p_idx]
      }
    }

    return {
      start: [item.w_idx, item.s_idx, item.idx_w_in_s, item.p_idx],
      current: [item.w_idx, item.s_idx, item.idx_w_in_s, item.p_idx]
    }
  }

  const applyPointers = (nextPointers) => {
    if (!nextPointers?.start || !nextPointers?.current) return

    startPointer.value = nextPointers.start
    currentPointer.value = nextPointers.current
  }

  const findItemInParagraphs = ({ startParaIndex, direction, compare, statusMatcher }) => {
    const step = direction === 'backward' ? -1 : 1

    for (
      let paragraphIndex = startParaIndex;
      paragraphIndex >= 0 && paragraphIndex < lessondata.value.length;
      paragraphIndex += step
    ) {
      const paragraph = lessondata.value[paragraphIndex]

      if (direction === 'forward') {
        const nextIndex = paragraph.findIndex(
          (item) => compare(getItemStartWordIndex(item)) && statusMatcher(item)
        )

        if (nextIndex !== -1) {
          return createPointersFromItem(paragraph[nextIndex])
        }
      } else {
        const previousIndex = paragraph.findLastIndex(
          (item) => compare(getItemStartWordIndex(item)) && statusMatcher(item)
        )

        if (previousIndex !== -1) {
          return createPointersFromItem(paragraph[previousIndex])
        }
      }
    }

    return { start: null, current: null }
  }

  const getCurrentPageBounds = () => {
    let scrollTop = (currentPage.value - 1) * view.value
    let scrollBottom = scrollTop + view.value

    // this fixed the unknown bug, when brower caculate wrongly
    if (currentPage.value === totalPage.value - 1) scrollBottom += view.value
    if (currentPage.value === totalPage.value) scrollTop = Math.max(0, scrollTop - view.value)

    return { scrollTop, scrollBottom }
  }

  const changePageStatus = () => {
    const { scrollTop, scrollBottom } = getCurrentPageBounds()
    const items = getWordItems()
    const firstEl = items.find((el) => el.offsetTop >= scrollTop)
    const lastEl = items.findLast((el) => el.offsetTop < scrollBottom)

    const indexParaStart = Number(firstEl?.dataset?.pIdx)
    const indexParaEnd = Number(lastEl?.dataset?.pIdx)

    if (!Number.isInteger(indexParaStart) || !Number.isInteger(indexParaEnd) || indexParaEnd < indexParaStart) {
      return
    }

    const { lessondataChunk } = useCreateLesson(core_data, newStatusDict, indexParaStart, indexParaEnd + 1)
    lessondata.value.splice(indexParaStart, indexParaEnd - indexParaStart + 1, ...lessondataChunk)
  }

  const getDataCurrentPage = () => {
    const scrollTop = (currentPage.value - 1) * view.value
    const scrollBottom = scrollTop + view.value
    const flatLessonData = lessondata.value.flat()
    const items = getWordItems()
    const firstItemEl = items.find((item) => item.offsetTop >= scrollTop)
    const lastItemEl = items.findLast((item) => item.offsetTop <= scrollBottom)
    const first = firstItemEl ? Number(firstItemEl.dataset.wIdx) : null
    const last = lastItemEl ? Number(lastItemEl.dataset.wIdx) : null

    const activeElement = items.find((item) => parseInt(item.dataset.wIdx) === startPointer.value[0])
    const activePage = activeElement ? Math.floor(activeElement.offsetTop / view.value) + 1 : 0

    const firstSixStatus = flatLessonData.find(
      (item) =>
        (item.w_idx >= first || item.phrase?.[0]?.w_idx >= first) &&
        (item.w_idx <= last || item.phrase?.[0]?.w_idx <= last) &&
        item.status === 6
    )

    if (first == null || last == null) {
      return {
        first: null,
        last: null,
        activePage,
        firstValidPointers: null,
        lastValidPointers: null,
        firstSixStatus
      }
    }

    const firstValidItem = flatLessonData.find(
      (item) => isItemInRange(item, first, last) && NAVIGABLE_STATUSES.includes(item.status)
    )

    const lastValidItem = flatLessonData.findLast(
      (item) => isItemInRange(item, first, last) && NAVIGABLE_STATUSES.includes(item.status)
    )

    return {
      first,
      last,
      activePage,
      firstValidPointers: firstValidItem ? createPointersFromItem(firstValidItem) : null,
      lastValidPointers: lastValidItem ? createPointersFromItem(lastValidItem) : null,
      firstSixStatus
    }
  }

  const changePageStatusByKeyborad = (e) => {
    if (isTypingTarget(e.target)) {
      return
    }

    if (!STATUS_SHORTCUT_KEYS.includes(e.key)) return

    const newStatus = e.key === 'x' ? 0 : Number(e.key)
    if (!selected.value.valid) {
      return
    }

    emitStatus(newStatus)
    changePageStatus()
  }

  const moveNextPage = (e) => {
    const {
      last,
      activePage,
      firstValidPointers
    } = getDataCurrentPage()

    const wordIndex = currentPointer.value[0]
    const paraIndex = currentPointer.value[3]

    const nextPointers = findItemInParagraphs({
      startParaIndex: paraIndex,
      direction: 'forward',
      compare: (itemWordIndex) => itemWordIndex > wordIndex,
      statusMatcher: (item) => NAVIGABLE_STATUSES.includes(item.status)
    })

    if (currentPage.value !== activePage) {
      if (!firstValidPointers?.start || !firstValidPointers?.current) {
        e.preventDefault()
        currentPage.value = Math.min(currentPage.value + 1, totalPage.value)
        return
      }

      applyPointers(firstValidPointers)
      return
    }

    if (!nextPointers.start || last == null) return

    if (nextPointers.start[0] <= last) {
      applyPointers(nextPointers)
      return
    }

    e.preventDefault()
    currentPage.value = Math.min(currentPage.value + 1, totalPage.value)
  }

  const movePreviousPage = (e) => {
    const {
      first,
      activePage,
      lastValidPointers
    } = getDataCurrentPage()

    const wordIndex = startPointer.value[0]
    const paraIndex = startPointer.value[3]

    const previousPointers = findItemInParagraphs({
      startParaIndex: paraIndex,
      direction: 'backward',
      compare: (itemWordIndex) => itemWordIndex < wordIndex,
      statusMatcher: (item) => NAVIGABLE_STATUSES.includes(item.status)
    })

    if (currentPage.value !== activePage) {
      if (!lastValidPointers?.start || !lastValidPointers?.current) {
        e.preventDefault()
        currentPage.value = Math.max(1, currentPage.value - 1)
        return
      }

      applyPointers(lastValidPointers)
      return
    }

    if (!previousPointers.start || first == null) return

    if (previousPointers.start[0] >= first) {
      applyPointers(previousPointers)
      return
    }

    e.preventDefault()
    currentPage.value = Math.max(1, currentPage.value - 1)
  }

  const moveToNextStatusSix = () => {
    const {
      last,
      activePage,
      firstSixStatus
    } = getDataCurrentPage()

    const wordIndex = currentPointer.value[0]
    const paraIndex = currentPointer.value[3]

    const nextPointers = findItemInParagraphs({
      startParaIndex: paraIndex,
      direction: 'forward',
      compare: (itemWordIndex) => itemWordIndex > wordIndex,
      statusMatcher: (item) => item.status === 6
    })

    if (currentPage.value !== activePage) {
      if (!firstSixStatus || firstSixStatus.type !== 'word') return

      startPointer.value = [
        firstSixStatus.w_idx,
        firstSixStatus.s_idx,
        firstSixStatus.idx_w_in_s,
        firstSixStatus.p_idx
      ]
      currentPointer.value = startPointer.value
      return
    }

    if (!nextPointers.start || last == null) return
    if (nextPointers.start[0] > last) return

    applyPointers(nextPointers)
  }

  const moveNextPrevious = (e) => {
    if (isTypingTarget(e.target)) {
      return
    }

    if (e.key === 'ArrowLeft' && e.shiftKey) {
      e.preventDefault()
      currentPage.value = Math.max(1, currentPage.value - 1)
      return
    }

    if (e.key === 'ArrowRight' && e.shiftKey) {
      e.preventDefault()
      currentPage.value = Math.min(currentPage.value + 1, totalPage.value)
      return
    }

    if (!currentPointer.value || !startPointer.value) return

    if (e.key === 'ArrowRight') {
      moveNextPage(e)
      return
    }

    if (e.key === 'ArrowLeft') {
      movePreviousPage(e)
      return
    }

    if (e.key === 'b') {
      moveToNextStatusSix()
    }
  }


  const findLastReadWordIdx = () => {
    const {
      first, activePage
    } = getDataCurrentPage()

    if (!currentPointer.value || !startPointer.value) return first ?? 0

    if (currentPage.value !== activePage) {
      return first ?? 0
    }

    else {
      return startPointer.value[0]
    }


  }

  return {
    findLastReadWordIdx,
    changePageStatus,
    changePageStatusByKeyborad,
    moveNextPrevious
  }
}
