<template>
  <div class="min-h-screen bg-gray-50 px-6 py-10">
    <div class="mx-auto flex max-w-[420px] justify-center">
      <!-- Popup card -->
      <div class="w-full max-w-[420px] rounded-3xl border border-gray-200 bg-white shadow-2xl">
        <div class="flex flex-col rounded-3xl pt-3">
          <!-- Header: audio button, word, frequency, tags -->
          <div class="px-5 pb-2">
            <div class="my-3 flex flex-row items-center gap-2 text-xl font-bold">
              <button
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-300"
              >
                <img src="/icons/reader/volume.svg" alt="volume" class="h-6 w-6" />
              </button>
              <span>{{ selectedWord.phrase }}</span>
            </div>

            <div class="flex">
              <div class="flex w-10 shrink-0 self-start items-center">
                <img src="/icons/reader/coins.svg" alt="coin" class="h-4 w-4" />
                <span class="mx-1">{{ selectedWord.frequent }}</span>
              </div>

              <div class="flex flex-wrap items-center gap-1 border-l border-gray-400 px-2 text-xs">
                <span
                  v-for="tag in selectedWord.tags"
                  :key="tag"
                  class="rounded border border-gray-400 bg-gray-100 px-1 text-center"
                >
                  {{ tag }}
                </span>
                <button
                  type="button"
                  class="rounded border border-gray-400 px-1 hover:bg-gray-300"
                >
                  Tag +
                </button>
              </div>
            </div>
          </div>

          <!-- Body: saved meanings and draft input -->
          <div class="flex max-h-[380px] flex-1 flex-col gap-1 overflow-auto border-y border-y-gray-300 p-5">
            <span class="font-medium">Saved Meaning</span>

            <textarea
              v-for="(meaning, index) in selectedWord.yourMeanings"
              :key="`${selectedWord.id}-saved-${index}`"
              v-model="selectedWord.yourMeanings[index]"
              rows="2"
              class="mt-2 w-full rounded-lg bg-gray-100 px-2 pt-2 text-start leading-none focus:outline-none focus:ring-0"
              placeholder="Enter meaning"
            />

            <textarea
              v-model="selectedWord.draftMeaning"
              rows="2"
              class="min-h-10 w-full rounded-lg border px-2 pt-2 text-start leading-none focus:outline-none focus:ring-0"
              placeholder="Demo input for adding or editing a meaning"
            />
          </div>

          <!-- Footer: status buttons -->
          <div class="flex justify-between px-4 py-2">
            <button
              v-for="status in statusButtons"
              :key="status.value"
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300"
              :class="[
                selectedWord.status === status.value ? status.activeClass : status.hoverClass,
              ]"
              @click="selectedWord.status = status.value"
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

          <!-- Action buttons -->
          <div class="flex justify-end gap-3 px-5 pb-5 pt-2">
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              class="rounded-lg bg-[#0B1B32] px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              Save Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedWord = ref({
  id: 1,
  phrase: 'resilient',
  frequent: 1,
  tags: ['adjective', 'academic'],
  yourMeanings: ['strong enough to recover quickly'],
  draftMeaning: '',
  status: 3,
})

const props = defineProps({
  wordDATA: {type: Object, default: () => ({
    id: 1,
    phrase: 'resilient',
    frequent: 1,
    tags: ['adjective', 'academic'],
    yourMeanings: ['strong enough to recover quickly'],
    status: 3,
  })},
})

const frequency = ref(1)
const phrase = ref(props.phrase)
const tags = ref(props.tags)
const yourMeanings = ref(['strong enough to recover quickly'])
const status = ref(props.status)

const statusButtons = [
  { value: 0, icon: 'trash', hoverClass: 'hover:bg-red-100', activeClass: 'bg-red-100' },
  { value: 1, label: '1', hoverClass: 'hover:bg-yellow-300', activeClass: 'bg-yellow-300' },
  { value: 2, label: '2', hoverClass: 'hover:bg-yellow-200', activeClass: 'bg-yellow-200' },
  { value: 3, label: '3', hoverClass: 'hover:bg-yellow-100', activeClass: 'bg-yellow-100' },
  { value: 4, label: '4', hoverClass: 'hover:bg-gray-200', activeClass: 'bg-gray-200' },
  { value: 5, icon: 'check', hoverClass: 'hover:bg-green-100', activeClass: 'bg-green-100' },
]
</script>
