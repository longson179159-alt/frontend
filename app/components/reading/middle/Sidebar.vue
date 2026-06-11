<template>

    <div class="border flex  flex-col rounded-3xl w-[390px]  mt-3  pt-3 " :class="props.validPhrase? 'h-[calc(100vh-104px)]' : 'h-auto'">
        <!-- word and tags -->
        <div class="px-5 pb-2 ">
            <div class="flex flex-row gap-2 items-center font-bold text-xl my-3">
               <button @click=" speakEnglish(currentPhraseData.phrase)" class="h-8 w-8 hover:bg-gray-300 rounded-full flex items-center justify-center">
                    <img src="/icons/reader/volume.svg" alt="volume" class="h-6 w-6" />
                </button>
                <span>{{ currentPhraseData.phrase }}</span>
            </div>
            <div v-show="props.validPhrase" class="flex ">
                <div class="flex self-start items-center  shrink-0  w-10">
                    <img src="/icons/reader/coins.svg" alt="coin" class=" h-4 w-4">
                    <span class="mx-1">{{ frequent }}</span>
                </div>

                <div ref="inputTag" class="relative flex border-l border-gray-400 px-2 gap-1 items-center flex-wrap text-xs">
                    <div v-for="tag in listTags" :key="tag"
                        :class="listGlobalTags.includes(tag) && 'bg-gray-200'"
                        class="relative   px-1 border border-gray-400 text-center bg-gray-100 rounded  h-[18px] group">
                        <span>{{ tag }}</span>
                        <button v-if='!listGlobalTags.includes(tag)' @click="clearTag(tag)"
                            class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gray-400 flex items-center justify-center hidden group-hover:flex"><font-awesome
                                icon="times" class="h-2 w-2" /></button>
                    </div>

                    <button v-if="!openAddtag" @click.stop ="openAddtag = true"
                        class="border  border-gray-400 px-1 rounded hover:bg-gray-300 whitespace-nowrap flex items-center gap-0.5">
                        Tag <font-awesome icon="plus" class="h-2 w-2" />
                    </button>
                    <input v-else  type="text"  @keydown.enter.stop @keyup.enter="addTag" v-model="newTag"
                        class="absolute -bottom-6 w-52 bg-white z-10 focus:outline-none focus:ring-0 px-2 p-0.5 rounded-md border border-gray-300 ">
                </div>
            </div>

            <span v-show="!props.validPhrase">
                Để tạo một phrase LangG, vui lòng chọn tối đa 8 từ trong cùng một câu.
            </span>
        </div>

        <div v-show="validPhrase" class="p-5 border-y border-y-gray-300 flex flex-col gap-1 flex-1 min-h-0 overflow-auto custom-scrollbar">
            <span class="font-medium">Saved Meaning</span>
            <div v-for="(meaning, i) in listMeanings" :key="i" class="relative group mt-2">
                <textarea placeholder="Enter meaning" v-model="listMeanings[i]" @input="(e) => {
                    e.target.style.height = 'auto'
                    e.target.style.height = e.target.scrollHeight + 'px'
                }" @keydown.enter.prevent="($event.target.blur())"
                    class=" inline-block w-full leading-none text-start pt-2 px-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-0 " />
                <div class="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 hidden group-hover:flex">
                    <button @click="removeMeaning(meaning)"
                        class=" h-5 w-5 rounded-full bg-white flex items-center justify-center"><font-awesome
                            icon="times" class="h-3" /></button>
                    <button @click="openAddMeaning = true"
                        class=" h-5 w-5 rounded-full bg-white flex items-center justify-center"><font-awesome
                            icon="plus" class="h-3" /></button>
                </div>
            </div>

            <textarea v-show="openAddMeaning || currentPhraseData.your_meanings.length ===0" placeholder="Enter new meaning, then press 'Enter'" v-model="newMeaning"
                @input="(e) => {
                    e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px'

                }" @keydown.enter.stop @keyup.enter="addMeaning"
                class="border min-h-10 inline-block w-full leading-none text-start pt-2 px-2  rounded-lg focus:outline-none focus:ring-0 " />

            

            <div class="mt-5 mb-1 flex justify-between items-center">
                <span class="block  text-center font-medium">Popular Meanings</span>
                <button class="hover:bg-gray-100 flex items-center gap-1 px-3 rounded-md">Report <img
                        src="/icons/reader/report.svg" alt="report" class="inline-block" /></button>
            </div>

            

            <button v-for="(traslattion, i) in usersTranslation" :key="i" @click="selectTranslations(i)"
                class=" text-blue-600 text-start px-3 py-2 mt-1 bg-gray-100 hover:bg-gray-200 flex items-center justify-between rounded-md"
                :class="i === focusTranslationIndex && 'bg-gray-200'"
                >
                <span>{{ traslattion }}</span>
                <div class="flex  gap-1 justify-end ">
                    <img v-if="traslattion === translateAi" src="/icons/reader/chatgpt.svg" class="inline-block h-5" alt="chatgpt">
                    <font-awesome icon="plus" class="h-4" />
                </div>
            </button>
        </div>

        <div v-show="validPhrase" class="px-4 py-2 flex justify-between">
            <button @click="currentPhraseData.status = 0 ; currentPhraseData.tags = []; currentPhraseData.your_meanings = []"
                :class="['h-10 w-10 rounded-full border border-gray-300 hover:bg-red-100 flex items-center justify-center', wordStatus === 0 && 'bg-red-100']"><img
                    src="/icons/reader/trash.svg" alt="" /></button>
            <button @click="  currentPhraseData.status = 1"
                :class="['h-10 w-10 rounded-full border border-gray-300 hover:bg-yellow-300 flex items-center justify-center', wordStatus === 1 && 'bg-yellow-300', wordStatus === 6 && 'bg-blue-200']">1</button>
            <button @click="currentPhraseData.status = 2"
                :class="['h-10 w-10 rounded-full border border-gray-300 hover:bg-yellow-200 flex items-center justify-center', wordStatus === 2 && 'bg-yellow-200']">2</button>
            <button @click="currentPhraseData.status = 3"
                :class="['h-10 w-10 rounded-full border border-gray-300 hover:bg-yellow-100 flex items-center justify-center', wordStatus === 3 && 'bg-yellow-100']">3</button>
            <button @click="currentPhraseData.status = 4"
                :class="['h-10 w-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center', wordStatus === 4 && 'bg-gray-200']">4</button>
            <button @click="currentPhraseData.status = 5"
                :class="['h-10 w-10 rounded-full border border-green-200 hover:bg-green-100 flex items-center justify-center', wordStatus === 5 && 'bg-green-200']"><font-awesome
                    icon="check" class="text-green-500" /></button>
        </div>

        <div  v-show='!validPhrase' class="px-5 py-10 flex flex-col  border-t border-t-gray-300 ">
            <span class="inline-block  mb-3 font-medium text-lg">Dictionaries</span>
            <button @click="openTranslatePopup(currentPhraseData.phrase)" class="px-3 py-2  bg-gray-100 hover:bg-gray-300 inline-block font-medium rounded-md shadow-md">
                Google Translate
            </button>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
// const config = useRuntimeConfig()


const props = defineProps({
    sidebarData: {type:Object},

    validPhrase: {type: Boolean, default: false}
})

const emit = defineEmits(['update:sidebarData'])

const currentPhraseData = computed({
  get: () => props.sidebarData,
  set: (newVal) => {
    // if (newVal.phrase.split(" ").length > 1 && newVal.status ===0) return
    emit('update:sidebarData', newVal)
  }
})


import debounce from "lodash/debounce";
const { getCsrfToken } = useCsrf()

const syncPhrase = debounce(async(playLoad) => {
    try {
        await $fetch(`/api/update_word/`, {
            method: "PUT",
            body: playLoad,
            credentials: "include",
            headers: {
                'X-CSRFToken': getCsrfToken()
            }
        })
    }

    catch(error) {
        console.log('error with update currentphrase data ', error)
    }
}, 500)


watch(
  () => {
    const v = currentPhraseData.value
    return {
      phrase: v.phrase,
      status: v.status,
      tags: [...(v.tags || [])],
      your_meanings: [...(v.your_meanings || [])],
      global_tags: [...(v.global_tags || [])],
      global_meanings: [...(v.global_meanings || [])],
    }
  },
  (newVal, oldVal) => {

    if (newVal.phrase !== oldVal.phrase) return
    if (newVal.phrase.split(' ').length > 1 && newVal.status === 6) return

    const isEqualArray = (a = [], b = []) =>
      a.length === b.length && a.every((v, i) => v === b[i])

    const changes = []

    if (!isEqualArray(newVal.tags, oldVal.tags)) changes.push('tags')
    if (!isEqualArray(newVal.your_meanings, oldVal.your_meanings)) changes.push('your_meanings')
    if (newVal.status !== oldVal.status) changes.push('status')

    if (changes.length === 0) return
    // console.log("changes", changes) 
    // console.log("newVal", newVal)
    syncPhrase({
      ...newVal,
      changes
    })
  },
  { deep: false }
)



watch(() => currentPhraseData.value.status, async (newVal, oldVal) => {
    if (oldVal !== 6 && oldVal !==0) return
    if ( newVal === 5) return
    if (currentPhraseData.value.your_meanings.length !== 0) return
    const translated = await onTranslate(currentPhraseData.value.phrase)
    currentPhraseData.value.your_meanings.push(translated)  

})


const wordStatus = computed(() => currentPhraseData.value.status)
const frequent = 1
const POS_MAP = {
  n: 'noun',
  v: 'verb',
  a: 'adjective',
  s: 'adjective', // adjective satellite
  r: 'adverb'
}

const inputTag = ref(null)
const listGlobalTags = computed(() => currentPhraseData.value.global_tags.map(p => POS_MAP[p]))
const listTags = computed(() => Array.from(
    new Set([
        ...listGlobalTags.value,
        ...currentPhraseData.value.tags
    ])
))
const newTag = ref('')
const openAddtag = ref(false)

const translateAi = ref('')
const openAddMeaning = ref(false)
const listMeanings = computed(() => currentPhraseData.value.your_meanings)
const newMeaning = ref('')

const playAudio = ref(true)

const { onTranslate, speakEnglish, openTranslatePopup} = useGooleTranslate()
watch(() => currentPhraseData.value?.phrase,
    async (phrase) => {

        const translated = await onTranslate(phrase)
        translateAi.value = translated

    }, 
    {immediate: true}
)



const usersTranslation = computed(() => {
    if (!translateAi.value )
        return currentPhraseData.value.global_meanings
    else {
        const globalFilterTranslatleAi = currentPhraseData.value.global_meanings.filter(item => item != translateAi.value)
        return [
            translateAi.value,
            ...globalFilterTranslatleAi
        ]
    }
})
const focusTranslationIndex = ref(0)

const clearTag = (tag) => {
  
    currentPhraseData.value.tags = currentPhraseData.value.tags.filter(item => item !== tag)
}

const addTag = () => {
    
    const textNewTag = newTag.value.trim()
    if (!textNewTag) {
        openAddtag.value = false
        return
    }

    if (currentPhraseData.value.tags.includes(textNewTag)) {

        return
    }

    currentPhraseData.value.tags.push(textNewTag)
    newTag.value = ''
    openAddtag.value = false

}

const removeMeaning = (meaning) => {
    const arr = currentPhraseData.value.your_meanings
    currentPhraseData.value.your_meanings = arr.filter(w => w !== meaning)
   
}

const addMeaning = () => {
    const textNewMeaning = newMeaning.value.trim()
    if (!textNewMeaning) return

    if (!currentPhraseData.value.your_meanings.includes(textNewMeaning)) {
        currentPhraseData.value.your_meanings.push(textNewMeaning)
        
        if (currentPhraseData.value.status === 6) {currentPhraseData.value.status =1}
    }
    newMeaning.value = ''
    openAddMeaning.value = false
}

const selectTranslations = (idx) => {

    const selected = usersTranslation.value[idx]
  
    if (!currentPhraseData.value.your_meanings.includes(selected)) {
        currentPhraseData.value.your_meanings.unshift(selected)
        if (currentPhraseData.value.status === 6) {currentPhraseData.value.status =1}
        }

    if (!translateAi.value) {
        
        currentPhraseData.value.global_meanings.splice(idx, 1)
    }
    else {  
        const arrGolabMeaning = currentPhraseData.value.global_meanings
        if (arrGolabMeaning.includes(selected)) {
            currentPhraseData.value.global_meanings = arrGolabMeaning.filter(item => item !== selected)
        }
        
        if (translateAi.value === selected) {
            translateAi.value = ''
        }
    }

}


const onKeydown = async (e) => {
    const listkeys = ['ArrowDown', 'ArrowUp','ArrowRight', 'ArrowLeft', 'Enter', 's', "x"]
    if (!listkeys.includes(e.key)) return

    const tag = e.target?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA') return
  
    if (e.key === 'Enter') {
        
        selectTranslations(focusTranslationIndex.value)
        return
    }

    const findNewIndex = (idx) => {
        if (idx < 0) {
            return currentPhraseData.value.global_meanings.length - 1
        }
        else if (idx === currentPhraseData.value.global_meanings.length) {
            return  0
        }
        else {return idx}

    }
    
    if (e.key === 'ArrowDown') {
        focusTranslationIndex.value = findNewIndex(focusTranslationIndex.value + 1)
    }


    if (e.key === 'ArrowUp') {
        focusTranslationIndex.value = findNewIndex(focusTranslationIndex.value - 1)
    }

    if (e.key === 'ArrowLeft' && !(e.key === 'ArrowLeft' && e.shiftKey)) {
        setTimeout(() => {
            speakEnglish(currentPhraseData.value.phrase)
        }, 20) 
        
    }

    if (e.key === 'ArrowRight' && !(e.key === 'ArrowRight' && e.shiftKey)) {
        
        setTimeout(() => {
            speakEnglish(currentPhraseData.value.phrase)
        }, 20)
 
    }

    if (e.key === 's') {
        speakEnglish(currentPhraseData.value.phrase)
    }

    if (e.key === 'x') {
        currentPhraseData.value.tags = []
        currentPhraseData.value.your_meanings = []
        translateAi.value = await onTranslate(currentPhraseData.value.phrase)
    }

}



const handleClickOutside = (e) => {
    if (inputTag.value && !inputTag.value.contains(e.target)) {
        addTag()
       
    }
}   

const onPointerDown = () => {
    // playAudio.value = false; console.log('playAudio.value', playAudio.value)
}

const onPointerUp = (e) => {
    playAudio.value = true
    const target = e.target
    if (!(target instanceof HTMLElement)) return
    const WordEl = target.closest('.word-item')
    const PhraseEl = target.closest('.phrase-item')
    if (!WordEl && !PhraseEl) return
    
    // console.log('playAudio after', playAudio.value)
    speakEnglish(currentPhraseData.value.phrase)
}


onMounted(() => {
    window.addEventListener('keydown', onKeydown),
    window.addEventListener('click', handleClickOutside)
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
})


onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
    window.removeEventListener("click", handleClickOutside)
    window.removeEventListener('pointerdown',  onPointerDown )
    window.removeEventListener('pointerup', onPointerUp)
})
</script>


<style scoped>
/* Custom dark scrollbar */
.custom-scrollbar {
    scrollbar-width: thin;
    /* Firefox */
    scrollbar-color: #0A0F17 #ffffff00;
    /* thumb color | track color */
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    /* scrollbar width */
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
    /* no track */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #0A0F17;
    /* the dark bar you want */
    border-radius: 999px;
}
</style>
