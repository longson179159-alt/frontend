import { computed } from 'vue'

export function useSidebarWordState(currentPhraseData, posMap) {
  const getArray = (key) => {
    const value = currentPhraseData.value?.[key]
    return Array.isArray(value) ? value : []
  }

  const setArray = (key, value) => {
    currentPhraseData.value[key] = value
  }

  const promoteStatusFromNewWord = () => {
    if (currentPhraseData.value?.status === 6) {
      currentPhraseData.value.status = 1
    }
  }

  const saveMeaning = (meaning, options = {}) => {
    const { prepend = false, promote = true } = options
    const text = typeof meaning === 'string' ? meaning.trim() : ''

    if (!text) return false

    const meanings = getArray('your_meanings')

    if (!meanings.includes(text)) {
      if (prepend) {
        meanings.unshift(text)
      } else {
        meanings.push(text)
      }
    }

    if (promote) {
      promoteStatusFromNewWord()
    }

    return true
  }

  const clearWord = () => {
    currentPhraseData.value.status = 0
    setArray('tags', [])
    setArray('your_meanings', [])
  }

  const resetUserData = () => {
    setArray('tags', [])
    setArray('your_meanings', [])
  }

  const setStatus = (status) => {
    currentPhraseData.value.status = status
  }

  const clearTag = (tag) => {
    setArray('tags', getArray('tags').filter((item) => item !== tag))
  }

  const addTag = (tag) => {
    const text = typeof tag === 'string' ? tag.trim() : ''

    if (!text) return false
    if (getArray('tags').includes(text)) return false

    currentPhraseData.value.tags.push(text)
    return true
  }

  const removeMeaning = (meaning) => {
    setArray('your_meanings', getArray('your_meanings').filter((item) => item !== meaning))
  }

  const updateMeaningAt = (index, meaning) => {
    if (!Array.isArray(currentPhraseData.value?.your_meanings)) return

    currentPhraseData.value.your_meanings[index] = meaning

    if (typeof meaning === 'string' && meaning.trim()) {
      promoteStatusFromNewWord()
    }
  }

  const listGlobalTags = computed(() => getArray('global_tags').map((tag) => posMap[tag]).filter(Boolean))
  const listTags = computed(() => Array.from(new Set([
    ...listGlobalTags.value,
    ...getArray('tags'),
  ])))
  const listMeanings = computed(() => getArray('your_meanings'))
  const wordStatus = computed(() => currentPhraseData.value?.status)

  return {
    addTag,
    clearTag,
    clearWord,
    listGlobalTags,
    listMeanings,
    listTags,
    promoteStatusFromNewWord,
    removeMeaning,
    resetUserData,
    saveMeaning,
    setStatus,
    updateMeaningAt,
    wordStatus,
  }
}
