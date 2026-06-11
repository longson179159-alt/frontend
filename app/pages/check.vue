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
                @click="speakEnglish(phrase)"
              >
                <img src="/icons/reader/volume.svg" alt="volume" class="h-6 w-6" />
              </button>
              <span>{{ phrase }}</span>
            </div>

            <div class="flex">
              <div class="flex w-10 shrink-0 self-start items-center">
                <img src="/icons/reader/coins.svg" alt="coin" class="h-4 w-4" />
                <span class="mx-1">{{ frequency }}</span>
              </div>

              <div class="flex flex-wrap items-center gap-1 border-l border-gray-400 px-2 text-xs">
                <span
                  v-for="tag in tags"
                  :key="tag"
                  class="group relative rounded border border-gray-400 bg-gray-100 px-1 text-center"
                >
                  {{ tag }}
                  <button
                    type="button"
                    class="absolute -right-1 -top-1 hidden h-3 w-3 items-center justify-center rounded-full bg-gray-400 text-white group-hover:flex"
                    @click="removeTag(tag)"
                  >
                    <font-awesome icon="times" class="h-2 w-2" />
                  </button>
                </span>

                <button
                  v-if="!openAddTag"
                  type="button"
                  class="rounded border border-gray-400 px-1 hover:bg-gray-300"
                  @click="openAddTag = true"
                >
                  Tag +
                </button>

                <input
                  v-else
                  v-model="newTag"
                  type="text"
                  class="w-24 rounded border border-gray-300 px-2 py-0.5 focus:outline-none"
                  placeholder="New tag"
                  @keydown.enter.prevent="addTag"
                  @blur="addTag"
                >
              </div>
            </div>
          </div>

          <!-- Body: saved meanings and draft input -->
          <div class="flex  flex-1 flex-col gap-1 overflow-auto border-y border-y-gray-300 p-5">
            <span class="font-medium">Saved Meaning</span>

            <div class="max-h-44 overflow-auto">
              <div
                v-for="(meaning, index) in yourMeanings"
                :key="`saved-${index}`"
                class="group relative mt-2"
              >
                <textarea
                  v-model="yourMeanings[index]"
                  rows="2"
                  class="w-full rounded-lg bg-gray-100 px-2 pt-2 text-start leading-none focus:outline-none focus:ring-0"
                  placeholder="Enter meaning"
                  @input="autoResize"
                  @keydown.enter.prevent="($event.target.blur())"
                ></textarea>
                <div class="absolute right-3 top-1/2 hidden -translate-y-1/2 gap-1 group-hover:flex">
                  <button
                    type="button"
                    class="flex h-5 w-5 items-center justify-center rounded-full bg-white"
                    @click="removeMeaning(index)"
                  >
                    <font-awesome icon="times" class="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    class="flex h-5 w-5 items-center justify-center rounded-full bg-white"
                    @click="openAddMeaning = true"
                  >
                    <font-awesome icon="plus" class="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            <textarea
              v-show="openAddMeaning || yourMeanings.length === 0"
              v-model="newMeaning"
              rows="2"
              class="mt-3 min-h-10 w-full rounded-lg border px-2 pt-2 text-start leading-none focus:outline-none focus:ring-0"
              placeholder="Enter new meaning, then press Enter"
              @input="autoResize"
              @keydown.enter.prevent="addMeaning"
            ></textarea>

            <div  class="mb-1  mt-5 flex items-center justify-between">
              <span class="block text-center font-medium">Popular Meanings</span>
            </div>

            <button
              
              type="button"
              class="mt-1 flex items-center justify-between rounded-md bg-gray-100 px-3 py-2 text-start text-blue-600 hover:bg-gray-200"
              @click="useGoogleTranslateMeaning"
            >
              <span>{{ googleTranslateMeaning }}</span>
              <img src="/icons/reader/chatgpt.svg" class="inline-block h-5" alt="chatgpt">
            </button>
          </div>

          <!-- Footer: status buttons -->
          <div class="flex justify-between px-4 py-2">
            <button
              v-for="status in statusButtons"
              :key="status.value"
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300"
              :class="[
                currentStatus === status.value ? status.activeClass : status.hoverClass,
              ]"
              @click="currentStatus = status.value"
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
              @click="emit('closePopup', false)"
              type="button"
              class="rounded-lg w-20 border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              @click="saveWord"
              type="button"
              class="rounded-lg w-20 bg-[#0B1B32] px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              Save 
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted,computed } from 'vue'


const { getCsrfToken } = useCsrf()
const props = defineProps({
  wordDATA: {type: Object, default: () => ({
  
    phrase: 'resilient',
    tags: ['adjective', 'academic'],
    yourMeanings: [
      'strong enough to recover quickly',
      'able to bounce back from difficulties',
      'quick to regain strength after stress or illness',
   
    ],
    status: 3,
  })},
})

const emit = defineEmits(['closePopup'])

const { onTranslate, speakEnglish } = useGooleTranslate()
// frequency is hardcoded for now

const frequency = ref(1) 
const phrase = ref(props.wordDATA.phrase)
const tags = ref([...props.wordDATA.tags])
const yourMeanings = ref([...(props.wordDATA.yourMeanings ?? [])])
const currentStatus = ref(props.wordDATA.status)
const newTag = ref('')
const openAddTag = ref(false)
const openAddMeaning = ref(false)
const newMeaning = ref('')
const googleTranslateMeaning = ref('')
// const isWordDataChanged = ref(false)

const statusButtons = [
  { value: 0, icon: 'trash', hoverClass: 'hover:bg-red-100', activeClass: 'bg-red-100' },
  { value: 1, label: '1', hoverClass: 'hover:bg-yellow-300', activeClass: 'bg-yellow-300' },
  { value: 2, label: '2', hoverClass: 'hover:bg-yellow-200', activeClass: 'bg-yellow-200' },
  { value: 3, label: '3', hoverClass: 'hover:bg-yellow-100', activeClass: 'bg-yellow-100' },
  { value: 4, label: '4', hoverClass: 'hover:bg-gray-200', activeClass: 'bg-gray-200' },
  { value: 5, icon: 'check', hoverClass: 'hover:bg-green-100', activeClass: 'bg-green-100' },
]

const addTag = () => {
  const value = newTag.value.trim()

  if (!value) {
    openAddTag.value = false
    newTag.value = ''
    return
  }

  if (!tags.value.includes(value)) {
    tags.value.push(value)
  }

  newTag.value = ''
  openAddTag.value = false
}

const removeTag = (tag) => {
  tags.value = tags.value.filter((item) => item !== tag)
}

const removeMeaning = (index) => {
  yourMeanings.value.splice(index, 1)
}

const addMeaning = () => {
  const value = newMeaning.value.trim()
  if (!value) return

  if (!yourMeanings.value.includes(value)) {
    yourMeanings.value.push(value)
  }

  newMeaning.value = ''
  openAddMeaning.value = false
}

const useGoogleTranslateMeaning = () => {
  const value = googleTranslateMeaning.value.trim()
  if (!value) return
  if (yourMeanings.value.includes(value)) return

  yourMeanings.value.unshift(value)
}

const autoResize = (event) => {
  event.target.style.height = 'auto'
  event.target.style.height = `${event.target.scrollHeight}px`
}


const updateWordData = async (playLoad) => {
  await $fetch('/api/update_word/', {
    method: 'PUT',
    body: playLoad,
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCsrfToken(),
    },
  })
}
     

const listChanges = computed(() => {
    let changes = []
    if (JSON.stringify(tags.value) !== JSON.stringify(props.wordDATA.tags)) changes.push('tags')
    if (JSON.stringify(yourMeanings.value) !== JSON.stringify(props.wordDATA.yourMeanings)) changes.push('your_meanings')
    if (currentStatus.value !== props.wordDATA.status) changes.push('status')
    return changes
})

const saveWord = async () => {
  if (listChanges.value.length === 0) {
    emit('closePopup', false)
    console.log('No changes detected, skipping save.')
    return
  }

  let playLoad = {
    phrase: phrase.value,
    tags: tags.value,
    your_meanings: yourMeanings.value
      .map(item => item.trim())
      .filter(Boolean),
    status: currentStatus.value,
    changes: listChanges.value,
  }

  try {
    await updateWordData(playLoad)
    console.log('Word data updated successfully.')
    emit('closePopup', false)
  } catch (error) {
    console.error('Failed to update word data:', error)
    alert('Failed to save changes. Please try again.')
  }
}

onMounted( async() => {
  googleTranslateMeaning.value = await onTranslate(props.wordDATA.phrase)
})
</script>
