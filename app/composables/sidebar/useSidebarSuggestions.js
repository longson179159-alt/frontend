import { computed, ref, watch } from 'vue'

// Handles suggestion data for Sidebar.vue: AI translation, rendered options, and selection focus.
export function useSidebarSuggestions(currentPhraseData, onTranslate, saveMeaning) {
  const translateAi = ref('')
  const focusTranslationIndex = ref(0)

  // Safely reads backend-provided suggestion meanings.
  const getGlobalMeanings = () => {
    const value = currentPhraseData.value?.global_meanings
    return Array.isArray(value) ? value : []
  }

  // Builds the exact suggestion list shown in the UI.
  const usersTranslation = computed(() => {
    if (!translateAi.value) {
      return getGlobalMeanings()
    }

    return [
      translateAi.value,
      ...getGlobalMeanings().filter((item) => item !== translateAi.value),
    ]
  })

  // Resets keyboard focus to the first suggestion.
  const resetFocus = () => {
    focusTranslationIndex.value = 0
  }

  // Moves keyboard focus up or down within the visible suggestion list.
  const moveFocus = (delta) => {
    const total = usersTranslation.value.length
    if (total === 0) {
      focusTranslationIndex.value = 0
      return
    }

    const nextIndex = focusTranslationIndex.value + delta

    if (nextIndex < 0) {
      focusTranslationIndex.value = total - 1
      return
    }

    if (nextIndex >= total) {
      focusTranslationIndex.value = 0
      return
    }

    focusTranslationIndex.value = nextIndex
  }

  // Refreshes the AI translation for the currently selected phrase.
  const refreshCurrentPhraseTranslation = async () => {
    const phrase = currentPhraseData.value?.phrase?.trim()

    resetFocus()
    translateAi.value = ''
    if (!phrase) return ''

    const translated = await onTranslate(phrase)
    if (currentPhraseData.value?.phrase !== phrase) return ''

    translateAi.value = translated
    return translated
  }

  // Saves a clicked suggestion and removes it from suggestion sources when needed.
  const selectTranslationAt = (index) => {
    const selected = usersTranslation.value[index]
    if (!selected) return false

    saveMeaning(selected, { prepend: true, promote: true })

    if (!translateAi.value) {
      const globalMeanings = getGlobalMeanings()
      currentPhraseData.value.global_meanings = globalMeanings.filter((_, itemIndex) => itemIndex !== index)
      return true
    }

    const globalMeanings = getGlobalMeanings()
    if (globalMeanings.includes(selected)) {
      currentPhraseData.value.global_meanings = globalMeanings.filter((item) => item !== selected)
    }

    if (translateAi.value === selected) {
      translateAi.value = ''
    }

    return true
  }

  watch(
    () => currentPhraseData.value?.phrase,
    async () => {
      await refreshCurrentPhraseTranslation()
    },
    { immediate: true }
  )

  watch(
    () => ({status: currentPhraseData.value?.status, phrase: currentPhraseData.value?.phrase}),
    async (newVal, oldVal) => {

      
      if (!oldVal) return
      if (oldVal.phrase !== newVal.phrase) return
      if (oldVal.status !== 6 && oldVal.status !== 0 ) return
      if (![1,2,3,4].includes(newVal.status)) return
      if (newVal.status === 5) return
      console.log('watching status and phrase change', newVal, oldVal)
      const meanings = currentPhraseData.value?.your_meanings
      if (Array.isArray(meanings) && meanings.length !== 0) return

      const phrase = currentPhraseData.value?.phrase?.trim()
      if (!phrase) return

      const translated = await onTranslate(phrase)
      if (!translated) return
      if (currentPhraseData.value?.phrase !== phrase) return

      saveMeaning(translated, { promote: false })
    }
  )

  return {
    focusTranslationIndex,
    moveFocus,
    refreshCurrentPhraseTranslation,
    selectTranslationAt,
    translateAi,
    usersTranslation,
  }
}
