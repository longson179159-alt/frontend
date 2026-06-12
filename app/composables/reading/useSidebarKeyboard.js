export function useSidebarKeyboard({
  currentPhraseData,
  focusTranslationIndex,
  moveFocus,
  refreshCurrentPhraseTranslation,
  resetUserData,
  selectTranslationAt,
  speakEnglish,
}) {
  const onKeydown = async (event) => {
    const listKeys = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Enter', 's', 'x']
    if (!listKeys.includes(event.key)) return

    const tag = event.target?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return

    if (event.key === 'Enter') {
      selectTranslationAt(focusTranslationIndex.value)
      return
    }

    if (event.key === 'ArrowDown') {
      moveFocus(1)
      return
    }

    if (event.key === 'ArrowUp') {
      moveFocus(-1)
      return
    }

    if (event.key === 'ArrowLeft' && !event.shiftKey) {
      setTimeout(() => {
        speakEnglish(currentPhraseData.value.phrase)
      }, 20)
      return
    }

    if (event.key === 'ArrowRight' && !event.shiftKey) {
      setTimeout(() => {
        speakEnglish(currentPhraseData.value.phrase)
      }, 20)
      return
    }

    if (event.key === 's') {
      speakEnglish(currentPhraseData.value.phrase)
      return
    }

    if (event.key === 'x') {
      resetUserData()
      await refreshCurrentPhraseTranslation()
    }
  }

  return {
    onKeydown,
  }
}
