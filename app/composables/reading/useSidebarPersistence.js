import { watch } from 'vue'
import debounce from 'lodash/debounce'

// Owns debounced backend persistence for Sidebar.vue phrase changes.
export function useSidebarPersistence(currentPhraseData, getCsrfToken) {
  // Sends the latest changed phrase payload to the backend after a short delay.
  const syncPhrase = debounce(async (payload) => {
    try {
      await $fetch('/api/update_word/', {
        method: 'PUT',
        body: payload,
        credentials: 'include',
        headers: {
          'X-CSRFToken': getCsrfToken(),
        },
      })
    } catch (error) {
      console.log('error with update currentphrase data ', error)
    }
  }, 500)

  // Normalizes possibly invalid array fields before comparison.
  const getArray = (value) => Array.isArray(value) ? value : []
  // Compares arrays by value and order to detect persisted field changes.
  const isEqualArray = (a = [], b = []) =>
    a.length === b.length && a.every((value, index) => value === b[index])

  watch(
    () => {
      const value = currentPhraseData.value
      return {
        phrase: value?.phrase,
        status: value?.status,
        tags: [...getArray(value?.tags)],
        your_meanings: [...getArray(value?.your_meanings)],
        global_tags: [...getArray(value?.global_tags)],
        global_meanings: [...getArray(value?.global_meanings)],
      }
    },
    (newVal, oldVal) => {
      if (newVal.phrase !== oldVal.phrase) {
        syncPhrase.flush()
        return
      }

      if (newVal.phrase?.split(' ').length > 1 && newVal.status === 6) return

      const changes = []
      if (!isEqualArray(newVal.tags, oldVal.tags)) changes.push('tags')
      if (!isEqualArray(newVal.your_meanings, oldVal.your_meanings)) changes.push('your_meanings')
      if (newVal.status !== oldVal.status) changes.push('status')

      if (changes.length === 0) return

      syncPhrase({
        ...newVal,
        changes,
      })
    },
    { deep: false }
  )

  return {
    flushPendingSync: () => syncPhrase.flush(),
  }
}
