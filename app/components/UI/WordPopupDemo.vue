<template>
  <div
    v-if="modelValue && localWord"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8"
    @click.self="closePopup"
  >
    <div class="w-full max-w-[420px] rounded-3xl border border-gray-200 bg-white shadow-2xl">
      <div class="flex flex-col rounded-3xl pt-3">
        <div class="px-5 pb-2">
          <div class="my-3 flex flex-row items-center gap-2 text-xl font-bold">
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-300"
              :aria-label="`Speak ${localWord.phrase}`"
              @click="emit('speak', localWord.phrase)"
            >
              <img src="/icons/reader/volume.svg" alt="" class="h-6 w-6" />
            </button>
            <input
              v-model="localWord.phrase"
              type="text"
              class="w-full rounded-md border border-transparent bg-transparent px-2 py-1 focus:border-gray-300 focus:outline-none"
            >
          </div>

          <div class="flex">
            <div class="flex w-10 shrink-0 self-start items-center">
              <img src="/icons/reader/coins.svg" alt="coin" class="h-4 w-4" />
              <span class="mx-1">{{ localWord.frequent }}</span>
            </div>

            <div class="flex flex-1 flex-wrap items-center gap-1 border-l border-gray-400 px-2 text-xs">
              <span
                v-for="tag in localWord.tags"
                :key="tag"
                class="flex items-center gap-1 rounded border border-gray-400 bg-gray-100 px-1 text-center"
              >
                {{ tag }}
                <button type="button" class="text-gray-500" @click="removeTag(tag)">
                  <font-awesome icon="times" class="h-2 w-2" />
                </button>
              </span>

              <div class="flex items-center gap-1">
                <input
                  v-model="newTag"
                  type="text"
                  class="w-24 rounded border border-gray-300 px-1 py-0.5 focus:outline-none"
                  placeholder="New tag"
                  @keydown.enter.prevent="addTag"
                >
                <button
                  type="button"
                  class="rounded border border-gray-400 px-1 hover:bg-gray-300"
                  @click="addTag"
                >
                  Tag +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex max-h-[380px] flex-1 flex-col gap-1 overflow-auto border-y border-y-gray-300 p-5">
          <span class="font-medium">Saved Meaning</span>

          <div
            v-for="(meaning, index) in localWord.yourMeanings"
            :key="`${localWord.id}-saved-${index}`"
            class="group relative mt-2"
          >
            <textarea
              v-model="localWord.yourMeanings[index]"
              rows="2"
              class="w-full rounded-lg bg-gray-100 px-2 pt-2 text-start leading-none focus:outline-none focus:ring-0"
              placeholder="Enter meaning"
            />
            <button
              type="button"
              class="absolute right-2 top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-white group-hover:flex"
              @click="removeMeaning(index)"
            >
              <font-awesome icon="times" class="h-3" />
            </button>
          </div>

          <div class="mt-3 flex gap-2">
            <textarea
              v-model="newMeaning"
              rows="2"
              class="min-h-10 w-full rounded-lg border px-2 pt-2 text-start leading-none focus:outline-none focus:ring-0"
              placeholder="Enter a new meaning"
              @keydown.enter.prevent="addMeaning"
            />
            <button
              type="button"
              class="self-start rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100"
              @click="addMeaning"
            >
              Add
            </button>
          </div>

          <div class="mb-1 mt-5 flex items-center justify-between">
            <span class="block text-center font-medium">Popular Meanings</span>
            <button type="button" class="flex items-center gap-1 rounded-md px-3 hover:bg-gray-100">
              Report
              <img src="/icons/reader/report.svg" alt="report" class="inline-block" />
            </button>
          </div>

          <button
            v-for="(meaning, index) in popularMeanings"
            :key="`${localWord.id}-global-${index}`"
            type="button"
            class="mt-1 flex items-center justify-between rounded-md bg-gray-100 px-3 py-2 text-start text-blue-600 hover:bg-gray-200"
            @click="selectPopularMeaning(meaning)"
          >
            <span>{{ meaning }}</span>
            <font-awesome icon="plus" class="h-4" />
          </button>
        </div>

        <div class="flex justify-between px-4 py-2">
          <button
            v-for="status in statusButtons"
            :key="status.value"
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300"
            :class="selectedStatusClass(status)"
            @click="localWord.status = status.value"
          >
            <template v-if="status.icon === 'trash'">
              <img src="/icons/reader/trash.svg" alt="trash" />
            </template>
            <template v-else-if="status.icon === 'check'">
              <font-awesome icon="check" class="text-green-500" />
            </template>
            <template v-else>
              {{ status.label }}
            </template>
          </button>
        </div>

        <div class="flex justify-end gap-3 px-5 pb-5 pt-2">
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            @click="closePopup"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg bg-[#0B1B32] px-4 py-2 text-sm font-medium text-white hover:bg-black"
            @click="savePopup"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  wordData: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'update:wordData', 'save', 'close', 'speak'])

const newTag = ref('')
const newMeaning = ref('')
const localWord = ref(null)

const statusButtons = [
  { value: 0, icon: 'trash', hoverClass: 'hover:bg-red-100', activeClass: 'bg-red-100' },
  { value: 1, label: '1', hoverClass: 'hover:bg-yellow-300', activeClass: 'bg-yellow-300' },
  { value: 2, label: '2', hoverClass: 'hover:bg-yellow-200', activeClass: 'bg-yellow-200' },
  { value: 3, label: '3', hoverClass: 'hover:bg-yellow-100', activeClass: 'bg-yellow-100' },
  { value: 4, label: '4', hoverClass: 'hover:bg-gray-200', activeClass: 'bg-gray-200' },
  { value: 5, icon: 'check', hoverClass: 'hover:bg-green-100', activeClass: 'bg-green-100' },
]

const cloneWord = (word) => {
  if (!word) return null

  return {
    id: word.id ?? null,
    phrase: word.phrase ?? '',
    frequent: word.frequent ?? 1,
    tags: [...(word.tags ?? [])],
    yourMeanings: [...(word.yourMeanings ?? [])],
    globalMeanings: [...(word.globalMeanings ?? [])],
    draftMeaning: word.draftMeaning ?? '',
    status: word.status ?? 0,
  }
}

watch(
  () => [props.modelValue, props.wordData],
  ([isOpen, word]) => {
    if (!isOpen || !word) return
    localWord.value = cloneWord(word)
    newTag.value = ''
    newMeaning.value = ''
  },
  { immediate: true }
)

const popularMeanings = computed(() => {
  if (!localWord.value) return []

  return localWord.value.globalMeanings.filter(
    (meaning) => !localWord.value.yourMeanings.includes(meaning)
  )
})

const addTag = () => {
  if (!localWord.value) return

  const tag = newTag.value.trim()
  if (!tag || localWord.value.tags.includes(tag)) return

  localWord.value.tags.push(tag)
  newTag.value = ''
}

const removeTag = (tag) => {
  if (!localWord.value) return
  localWord.value.tags = localWord.value.tags.filter((item) => item !== tag)
}

const addMeaning = () => {
  if (!localWord.value) return

  const meaning = newMeaning.value.trim()
  if (!meaning || localWord.value.yourMeanings.includes(meaning)) return

  localWord.value.yourMeanings.push(meaning)
  newMeaning.value = ''
}

const removeMeaning = (index) => {
  if (!localWord.value) return
  localWord.value.yourMeanings.splice(index, 1)
}

const selectPopularMeaning = (meaning) => {
  if (!localWord.value || localWord.value.yourMeanings.includes(meaning)) return
  localWord.value.yourMeanings.unshift(meaning)
}

const selectedStatusClass = (status) => {
  if (!localWord.value) return status.hoverClass
  return localWord.value.status === status.value ? status.activeClass : status.hoverClass
}

const closePopup = () => {
  emit('update:modelValue', false)
  emit('close')
}

const savePopup = () => {
  if (!localWord.value) return
  const payload = cloneWord(localWord.value)
  emit('update:wordData', payload)
  emit('save', payload)
  emit('update:modelValue', false)
}
</script>
