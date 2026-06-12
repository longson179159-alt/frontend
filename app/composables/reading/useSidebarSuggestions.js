import { computed, ref, watch } from 'vue'

export function useSidebarSuggestions(currentPhraseData, onTranslate, saveMeaning) {
  const translateAi = ref('')
  const focusTranslationIndex = ref(0)

  const getGlobalMeanings = () => {
    const value = currentPhraseData.value?.global_meanings
    return Array.isArray(value) ? value : []
  }

  const usersTranslation = computed(() => {
    if (!translateAi.value) {
      return getGlobalMeanings()
    }

    return [
      translateAi.value,
      ...getGlobalMeanings().filter((item) => item !== translateAi.value),
    ]
  })

  const resetFocus = () => {
    focusTranslationIndex.value = 0
  }

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
    () => currentPhraseData.value?.status,
    async (newVal, oldVal) => {
      if (oldVal !== 6 && oldVal !== 0) return
      if (newVal === 5) return

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
