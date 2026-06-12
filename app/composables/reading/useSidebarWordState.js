import { computed } from 'vue'

// Centralizes word-level mutations for Sidebar.vue: status, tags, and saved meanings.
export function useSidebarWordState(currentPhraseData, posMap) {
  // Safely reads an array field from the current phrase state.
  const getArray = (key) => {
    const value = currentPhraseData.value?.[key]
    return Array.isArray(value) ? value : []
  }

  // Replaces an array field on the current phrase state.
  const setArray = (key, value) => {
    currentPhraseData.value[key] = value
  }

  // Promotes a brand-new word to status 1 after user interaction.
  const promoteStatusFromNewWord = () => {
    if (currentPhraseData.value?.status === 6) {
      currentPhraseData.value.status = 1
    }
  }

  // Saves a meaning once and optionally promotes the word status.
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

  // Clears user data and marks the word as removed.
  const clearWord = () => {
    currentPhraseData.value.status = 0
    setArray('tags', [])
    setArray('your_meanings', [])
  }

  // Clears only user tags and meanings but preserves the current status.
  const resetUserData = () => {
    setArray('tags', [])
    setArray('your_meanings', [])
  }

  // Sets the explicit learning status chosen by the user.
  const setStatus = (status) => {
    currentPhraseData.value.status = status
  }

  // Removes one user tag from the current phrase.
  const clearTag = (tag) => {
    setArray('tags', getArray('tags').filter((item) => item !== tag))
  }

  // Adds a trimmed user tag if it is not already present.
  const addTag = (tag) => {
    const text = typeof tag === 'string' ? tag.trim() : ''

    if (!text) return false
    if (getArray('tags').includes(text)) return false

    currentPhraseData.value.tags.push(text)
    return true
  }

  // Removes one saved meaning from the current phrase.
  const removeMeaning = (meaning) => {
    setArray('your_meanings', getArray('your_meanings').filter((item) => item !== meaning))
  }

  // Updates an existing saved meaning in place and promotes status if needed.
  const updateMeaningAt = (index, meaning) => {
    if (!Array.isArray(currentPhraseData.value?.your_meanings)) return

    currentPhraseData.value.your_meanings[index] = meaning

    if (typeof meaning === 'string' && meaning.trim()) {
      promoteStatusFromNewWord()
    }
  }

  // Maps backend part-of-speech tags into human-readable labels.
  const listGlobalTags = computed(() => getArray('global_tags').map((tag) => posMap[tag]).filter(Boolean))
  // Combines global and user tags into the rendered tag list.
  const listTags = computed(() => Array.from(new Set([
    ...listGlobalTags.value,
    ...getArray('tags'),
  ])))
  // Exposes saved meanings for rendering.
  const listMeanings = computed(() => getArray('your_meanings'))
  // Exposes the current status for button highlighting.
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
