<template>
  <div
    v-if="modelValue && localWord"
    ref="popupRef"
    class="fixed z-50 w-[360px] max-w-[calc(100vw-24px)] rounded-3xl border border-gray-200 bg-white shadow-2xl"
    :style="popupStyle"
  >
    <div class="flex flex-col rounded-3xl pt-3">
      <div class="px-5 pb-3">
        <div class="mb-3 flex items-start justify-between gap-3">
          <div class="flex items-center gap-2 text-xl font-bold text-gray-900">
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-300"
              :aria-label="`Speak ${localWord.phrase}`"
              @click="emit('speak', localWord.phrase)"
            >
              <img src="/icons/reader/volume.svg" alt="" class="h-6 w-6" />
            </button>
            <span class="break-all">{{ localWord.phrase }}</span>
          </div>

          <button
            type="button"
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            aria-label="Close popup"
            @click="closePopup"
          >
            <font-awesome icon="times" class="h-4 w-4" />
          </button>
        </div>

        <div class="border-l border-gray-300 pl-3">
          <div class="flex flex-wrap items-center gap-1 text-xs">
            <span
              v-for="tag in localWord.tags"
              :key="tag"
              class="flex items-center gap-1 rounded border border-gray-400 bg-gray-100 px-1.5 py-0.5"
            >
              {{ tag }}
              <button type="button" class="text-gray-500" @click="removeTag(tag)">
                <font-awesome icon="times" class="h-2 w-2" />
              </button>
            </span>

            <input
              v-model="newTag"
              type="text"
              class="w-24 rounded border border-gray-300 px-2 py-0.5 focus:outline-none"
              placeholder="New tag"
              @keydown.enter.prevent="addTag"
            >
            <button
              type="button"
              class="rounded border border-gray-400 px-1.5 py-0.5 hover:bg-gray-200"
              @click="addTag"
            >
              Tag +
            </button>
          </div>
        </div>
      </div>

      <div class="max-h-[340px] overflow-auto border-y border-y-gray-300 px-5 py-4">
        <div class="mb-3 flex items-center justify-between gap-2">
          <span class="font-medium text-gray-800">Your Meanings</span>
          <span
            v-if="isSaving"
            class="text-xs font-medium text-blue-600"
          >
            Saving...
          </span>
        </div>

        <div
          v-for="(meaning, index) in localWord.your_meanings"
          :key="`${localWord.phrase}-${index}`"
          class="group relative mt-2"
        >
          <textarea
            v-model="localWord.your_meanings[index]"
            rows="2"
            class="w-full rounded-lg bg-gray-100 px-3 py-2 text-sm leading-5 focus:outline-none focus:ring-0"
            placeholder="Enter meaning"
            @input="queueSync('your_meanings')"
          ></textarea>
          <button
            type="button"
            class="absolute right-2 top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-white text-gray-600 group-hover:flex"
            @click="removeMeaning(index)"
          >
            <font-awesome icon="times" class="h-3 w-3" />
          </button>
        </div>

        <div class="mt-3 flex gap-2">
          <textarea
            v-model="newMeaning"
            rows="2"
            class="min-h-10 w-full rounded-lg border px-3 py-2 text-sm leading-5 focus:outline-none focus:ring-0"
            placeholder="Add a new meaning"
            @keydown.enter.prevent="addMeaning"
          ></textarea>
          <button
            type="button"
            class="self-start rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100"
            @click="addMeaning"
          >
            Add
          </button>
        </div>

        <p
          v-if="saveError"
          class="mt-3 text-sm text-red-500"
        >
          {{ saveError }}
        </p>
      </div>

      <div class="px-4 py-3">
        <div class="flex justify-between gap-2">
          <button
            v-for="status in statusButtons"
            :key="status.value"
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300"
            :class="selectedStatusClass(status)"
            @click="setStatus(status.value)"
          >
            <template v-if="status.icon === 'trash'">
              <img src="/icons/reader/trash.svg" alt="" />
            </template>
            <template v-else-if="status.icon === 'check'">
              <font-awesome icon="check" class="text-green-500" />
            </template>
            <template v-else>
              {{ status.label }}
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import debounce from 'lodash/debounce'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  wordData: { type: Object, default: null },
  position: {
    type: Object,
    default: () => ({
      top: 0,
      left: 0,
    }),
  },
})

const emit = defineEmits(['update:modelValue', 'update:wordData', 'updated', 'close', 'speak'])

const { getCsrfToken } = useCsrf()

const popupRef = ref(null)
const localWord = ref(null)
const newTag = ref('')
const newMeaning = ref('')
const isSaving = ref(false)
const saveError = ref('')

let pendingChanges = new Set()

const statusButtons = [
  { value: 0, icon: 'trash', hoverClass: 'hover:bg-red-100', activeClass: 'bg-red-100' },
  { value: 1, label: '1', hoverClass: 'hover:bg-yellow-300', activeClass: 'bg-yellow-300' },
  { value: 2, label: '2', hoverClass: 'hover:bg-yellow-200', activeClass: 'bg-yellow-200' },
  { value: 3, label: '3', hoverClass: 'hover:bg-yellow-100', activeClass: 'bg-yellow-100' },
  { value: 4, label: '4', hoverClass: 'hover:bg-gray-200', activeClass: 'bg-gray-200' },
  { value: 5, icon: 'check', hoverClass: 'hover:bg-green-100', activeClass: 'bg-green-100' },
]

const normalizeWord = (word) => {
  if (!word) return null

  const phrase = word.word ?? word.phrase ?? ''
  const meanings = Array.isArray(word.your_meanings)
    ? [...word.your_meanings]
    : word.meaning
      ? [word.meaning]
      : []

  return {
    phrase,
    tags: Array.isArray(word.tags) ? [...word.tags] : [],
    your_meanings: meanings,
    status: Number(word.status ?? 0),
  }
}

const buildParentWord = () => {
  if (!localWord.value) return null

  return {
    ...(props.wordData ?? {}),
    word: localWord.value.phrase,
    phrase: localWord.value.phrase,
    meaning: localWord.value.your_meanings[0] ?? '',
    your_meanings: [...localWord.value.your_meanings],
    tags: [...localWord.value.tags],
    status: localWord.value.status,
  }
}

const popupStyle = computed(() => {
  const topInput = Number(props.position?.top ?? 0)
  const leftInput = Number(props.position?.left ?? 0)

  if (process.server) {
    return {
      top: `${topInput}px`,
      left: `${leftInput}px`,
    }
  }

  const popupWidth = 360
  const popupHeight = 520
  const gap = 12

  const left = Math.min(
    Math.max(gap, leftInput),
    Math.max(gap, window.innerWidth - popupWidth - gap)
  )

  const top = Math.min(
    Math.max(gap, topInput),
    Math.max(gap, window.innerHeight - popupHeight - gap)
  )

  return {
    top: `${top}px`,
    left: `${left}px`,
  }
})

const cleanArray = (list) => {
  return Array.from(
    new Set(
      list
        .map((item) => String(item ?? '').trim())
        .filter(Boolean)
    )
  )
}

const syncWord = debounce(async () => {
  if (!localWord.value || pendingChanges.size === 0) return

  const changes = [...pendingChanges]
  pendingChanges = new Set()

  isSaving.value = true
  saveError.value = ''

  const payload = {
    phrase: localWord.value.phrase,
    tags: cleanArray(localWord.value.tags),
    your_meanings: cleanArray(localWord.value.your_meanings),
    status: localWord.value.status,
    changes,
  }

  try {
    await $fetch('/api/update_word/', {
      method: 'PUT',
      body: payload,
      credentials: 'include',
      headers: {
        'X-CSRFToken': getCsrfToken(),
      },
    })

    localWord.value.tags = [...payload.tags]
    localWord.value.your_meanings = [...payload.your_meanings]

    const updatedWord = buildParentWord()
    emit('update:wordData', updatedWord)
    emit('updated', updatedWord)
  } catch (error) {
    saveError.value = error?.data?.message ?? 'Failed to update word.'
  } finally {
    isSaving.value = false
  }
}, 500)

const queueSync = (change) => {
  if (!localWord.value) return
  pendingChanges.add(change)
  syncWord()
}

const addTag = () => {
  if (!localWord.value) return

  const tag = newTag.value.trim()
  if (!tag || localWord.value.tags.includes(tag)) return

  localWord.value.tags.push(tag)
  newTag.value = ''
  queueSync('tags')
}

const removeTag = (tag) => {
  if (!localWord.value) return

  localWord.value.tags = localWord.value.tags.filter((item) => item !== tag)
  queueSync('tags')
}

const addMeaning = () => {
  if (!localWord.value) return

  const meaning = newMeaning.value.trim()
  if (!meaning || localWord.value.your_meanings.includes(meaning)) return

  localWord.value.your_meanings.push(meaning)
  newMeaning.value = ''
  queueSync('your_meanings')
}

const removeMeaning = (index) => {
  if (!localWord.value) return

  localWord.value.your_meanings.splice(index, 1)
  queueSync('your_meanings')
}

const setStatus = (status) => {
  if (!localWord.value || localWord.value.status === status) return

  localWord.value.status = status
  queueSync('status')
}

const selectedStatusClass = (status) => {
  if (!localWord.value) return status.hoverClass
  return localWord.value.status === status.value ? status.activeClass : status.hoverClass
}

const closePopup = () => {
  syncWord.flush()
  emit('update:modelValue', false)
  emit('close')
}

const handlePointerDownOutside = (event) => {
  if (!props.modelValue || !popupRef.value) return
  if (popupRef.value.contains(event.target)) return
  closePopup()
}

watch(
  () => [props.modelValue, props.wordData],
  ([isOpen, word]) => {
    if (!isOpen || !word) return

    localWord.value = normalizeWord(word)
    newTag.value = ''
    newMeaning.value = ''
    saveError.value = ''
    pendingChanges = new Set()
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('pointerdown', handlePointerDownOutside)
})

onBeforeUnmount(() => {
  syncWord.flush()
  syncWord.cancel()
  window.removeEventListener('pointerdown', handlePointerDownOutside)
})
</script>

<style scoped>
textarea {
  resize: none;
}
</style>
