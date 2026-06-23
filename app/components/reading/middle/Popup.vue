

<template>
   
        <div class="border bg-white flex flex-col rounded-3xl w-[390px] pt-3 h-[500px] pb-1" :class="expand? 'h-[500px]' : 'h-auto'">
            <!-- word and tags -->
            <div class="px-5 pb-2 relative">
                <div class="flex justify-between items-center pr-5">
                    <div class="flex flex-row gap-2 items-center font-bold text-xl my-3">
                        <img src="/icons/reader/volume.svg" alt="volume" class=""/>
                        <span>{{ word }}</span>
                    </div>

                     <div v-show="wordStatus !== 6 && expand ===false" class="relative " @mouseenter="openSelectStatus = true" @mouseleave="openSelectStatus = false">
                        <div  class="  h-10 w-10 border border-gray-300 rounded-full flex items-center justify-center" :class="listColors[wordStatus]">
                            <img v-if="wordStatus === 0" src="/icons/reader/trash.svg" alt="trash">
                            <font-awesome v-else-if="wordStatus === 5" icon="check" class="text-green-500"/>
                            <span v-else>{{wordStatus}}</span>
                        </div>
                        <div v-if="openSelectStatus" class="absolute -translate-y-1/3 -translate-x-1/2 w-52 rounded-2xl  border border-gray-300 shadow-md p-3 z-10  bg-white flex flex-col gap-2">
                            <button @click="wordStatus = i ; openSelectStatus = false " v-for="(status, i) in listStatus" class="flex  justify-between items-center">
                                <div class="flex items-center gap-3">
                                    <span :class="['h-8 w-8 rounded-full border border-gray-300  flex items-center justify-center' , `hover:${listColors[i]}`, wordStatus === i && listColors[i]]">
                                        <img v-if="i === 0" src="/icons/reader/trash.svg" alt="trash">
                                        <font-awesome v-else-if="i === 5" icon="check" class="text-green-500"/>
                                        <span v-else>{{i}}</span>
                                    </span>
                                    <span>{{status}}</span>
                                </div>
                                <span class=" h-6 w-6 border flex items-center justify-center rounded border-gray-400 border-r-[2px] border-b-[2px] shadow-[2px_2px_1px_rgba(0,0,0,0.50)]">{{ i ===0 ? 'x' : i === 5? 'k' : `${i}` }}</span>
                            </button>
                                                      
                        </div>
                    </div>
                </div>
                <div class="flex ">
                    <div class="flex self-start items-center  shrink-0  w-10">
                        <img src="/icons/reader/coins.svg" alt="coin" class=" h-4 w-4">
                        <span class="mx-1">{{frequent}}</span>
                    </div>

                    <div class="flex border-l border-gray-400 px-2 gap-1 items-center flex-wrap text-xs">
                        <div v-for="tag in listTags" :key="tag" class="relative   px-1 border border-gray-400 text-center bg-gray-100 rounded  h-[18px] group">
                            <span>{{tag}}</span>
                            <button @click="clearTag(tag)" class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gray-400 flex items-center justify-center hidden group-hover:flex"><font-awesome icon="times" class="h-2 w-2"/></button>
                        </div>

                        <button v-if="!openAddtag" @click="openAddtag = !openAddtag" class="border  border-gray-400 px-1 rounded hover:bg-gray-300 whitespace-nowrap flex items-center gap-0.5">
                            Tag <font-awesome icon="plus" class="h-2 w-2"/>
                        </button>
                        <input v-else type="text" @keyup.enter="addTag" v-model="newTag" class=" focus:outline-none focus:ring-0 px-2 p-0.5 rounded-md border border-gray-300 ">
                    </div>
                </div>

                <button @click="$emit('closePopup', false)" class="absolute top-1 right-2 h-6 w-6 border border-gray-500 rounded-full flex items-center justify-center hover:bg-gray-300"><font-awesome icon="times" class="h-3"/></button>
               
            </div>

            <div v-if="expand" class="p-5 border-y border-y-gray-300 flex flex-col gap-1 flex-1 min-h-0 overflow-auto custom-scrollbar">
                <span class="font-medium">Saved Meaning</span>
                <div v-for="(meaning, i) in listMeanings"  :key="i" class="relative group mt-2">
                    <textarea                      
                    placeholder="Enter meaning" 
                   
                    v-model="listMeanings[i]"
                    @input="(e) => {
                        e.target.style.height = 'auto'
                        e.target.style.height = e.target.scrollHeight + 'px'
                    }"
                    @keydown.enter.prevent="($event.target.blur())"
    
                    class=" inline-block w-full leading-none text-start pt-2 px-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-0 "
                    />
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 hidden group-hover:flex">
                        <button @click="removeMeaning(meaning)" class=" h-5 w-5 rounded-full bg-white flex items-center justify-center"><font-awesome icon="times" class="h-3"/></button>
                        <button @click="openAddMeaning = true" class=" h-5 w-5 rounded-full bg-white flex items-center justify-center"><font-awesome icon="plus" class="h-3"/></button>
                    </div>
                </div>

                <textarea 
                v-if="openAddMeaning"
                placeholder="Enter new meaning, then press 'Enter'"
                v-model="newMeaning"
                @input="(e) => {
                    e.target.style.height = 'auto',
                    e.target.style.height = e.target.scrollHeight + 'px'
                    
                }"
                @keydown.enter.prevent="addMeaning  "
                class="border inline-block w-full min-h-10 text-start pt-2 px-2  rounded-lg focus:outline-none focus:ring-0 "
                />

                <span class="inline-block mt-5 mb-1 font-medium">Dictionaries</span>
                <button class="px-3 py-1 self-start bg-gray-100 hover:bg-gray-300 inline-block text-xs rounded">Google Translate</button>

               <div class="mt-5 mb-1 flex justify-between items-center">
                    <span class="block  text-center font-medium">Popular Meanings</span>
                    <button class="hover:bg-gray-100 flex items-center gap-1 px-3 rounded-md">Report <img src="/icons/reader/report.svg" alt="report" class="inline-block"/></button>
               </div>

               <button v-for="(traslattion, i) in usersTranslation"
               :key="i"
               @click="selectTranslations(i)"
               class=" text-blue-600 px-3 py-2 mt-1 bg-gray-100 hover:bg-gray-200 flex items-center justify-between rounded-md"
               >
                    <span>{{traslattion}}</span>
                    <div class="flex  gap-1 justify-end ">
                        <img v-if="i === 0" src="/icons/reader/chatgpt.svg" class="inline-block h-5" alt="chatgpt">
                        <font-awesome icon="plus" class="h-4"/>
                    </div>
               </button>
            </div>

            <div v-if="expand" class="px-4 py-1 flex justify-between">
                <button @click="wordStatus=0" :class="['h-10 w-10 rounded-full border border-gray-300 hover:bg-red-200 flex items-center justify-center', wordStatus === 0 && 'bg-red-200']" ><img src="/icons/reader/trash.svg" alt=""/></button>
                <button @click="wordStatus=1" :class="['h-10 w-10 rounded-full border border-gray-300 hover:bg-yellow-300 flex items-center justify-center',  wordStatus === 1 && 'bg-yellow-300', wordStatus === 6 && 'bg-blue-200']">1</button>
                <button @click="wordStatus=2" :class="['h-10 w-10 rounded-full border border-gray-300 hover:bg-yellow-200 flex items-center justify-center' , wordStatus === 2 && 'bg-yellow-200']">2</button>
                <button @click="wordStatus=3" :class="['h-10 w-10 rounded-full border border-gray-300 hover:bg-yellow-100 flex items-center justify-center' , wordStatus === 3 && 'bg-yellow-100']">3</button>
                <button @click="wordStatus=4" :class="['h-10 w-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center' , wordStatus === 4 && 'bg-gray-200']">4</button>
                <button @click="wordStatus=5" :class="['h-10 w-10 rounded-full border border-green-200 hover:bg-green-200 flex items-center justify-center' , wordStatus === 5 && 'bg-green-200']"><font-awesome icon="check" class="text-green-500"/></button>
            </div>

            <div v-else class="px-5 py-2 shrink-0 border-t border-t-gray-300 flex flex-col gap-1">
                <div v-if="wordStatus === 0">
                    <span class="font-medium">Saved Meaning</span>
                    <textarea 
                    
                    placeholder="Enter new meaning, then press 'Enter'"
                    v-model="newMeaning"
                    @input="(e) => {
                        e.target.style.height = 'auto',
                        e.target.style.height = e.target.scrollHeight + 'px'
                        
                    }"
                    @keydown.enter.prevent="addMeaning ; wordStatus=1"
                    class="border inline-block w-full leading-none text-start pt-2 px-2  rounded-lg focus:outline-none focus:ring-0 "
                    />
                </div>

                <div v-else-if="wordStatus ===6">
                    <span class="block  text-start font-medium">Popular Meanings</span>
                    <button
                    @click="selectTranslations(1)"
                    class="w-full text-blue-600 px-3 py-2 mt-1 bg-gray-100 hover:bg-gray-200 flex items-center justify-between rounded-md"
                    >
                        <span>{{usersTranslation[0]}}</span>
                        <div class="flex  gap-1 justify-end ">
                            <img  src="/icons/reader/chatgpt.svg" class="inline-block h-5" alt="chatgpt">
                            <font-awesome icon="plus" class="h-4"/>
                        </div>

                    </button>
                </div>

                <textarea v-else
                    @click="expand=true"
                    class="border inline-block shrink-0  w-full leading-none text-start py-2 px-2  rounded-lg focus:outline-none focus:ring-0 overflow-hidden resize-none"
                    v-model= "meaningsText"
                    ref="meaningsBox" 
                    @input="autoResize"      
                />

                
            </div>

          

            <button @click="toggleExpand" class="hover:bg-gray-200 w-80 self-center h-4 rounded-full flex items-center justify-center"><font-awesome :icon="expand ? 'chevron-up' : 'chevron-down'" /></button>
        </div>
 
</template>

<script setup>
import {ref, watch, nextTick, onMounted} from 'vue'
const props = defineProps({
    word: {type: String, default: 'New word'},
    wordStatus : {type: Number, default: 1}
})

const emit = defineEmits(['closePopup'])

const meaningsBox = ref(null)

const expand = ref(false)
const wordStatus = ref(props.wordStatus)
const listStatus = ['Ignore', 'New', 'Recognized', 'Familiar', 'Learned', 'Know']
const listColors = ['bg-red-200', 'bg-yellow-300' , 'bg-yellow-200' , 'bg-yellow-100' ,'bg-gray-200', 'bg-green-200']
const openSelectStatus = ref(false)

const frequent = 1
const listTags = ref(['Noun', 'Verb', 'Food', 'Health'])
const newTag = ref('')
const openAddtag = ref(false)

const openAddMeaning = ref(false)
const listMeanings = ref(['Good luck', 'Fortunate', 'Blessing in disguise', 'aaaaaaaaaaaaaaaaaaaaaaaaa', 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'])
const meaningsText = ref(listMeanings.value.join('; '))
const newMeaning = ref('')

const usersTranslation = ref(['In mood', 'energetic', "peaseful" , "calm"])


const autoResize = () => {
    const el = meaningsBox.value
    if (!el) return

    el.style.height  = 'auto'
    el.style.height = el.scrollHeight + 'px'
}

watch(listMeanings, async (newVal) => {
    meaningsText.value = newVal.join('; ')
    await nextTick()
    autoResize()
    
}, {deep: true})

watch(wordStatus, (newVal) => {
    if (newVal === 0) {
        listMeanings.value = []
    }
})

const toggleExpand = async () => {
  expand.value = !expand.value
  await nextTick()
  if (!expand.value) {
    autoResize()
  }
}


const clearTag = (tag) => {
    listTags.value = listTags.value.filter(item => item !== tag)
}

const addTag = (event) => {
    if (event.key !== 'Enter') return
    const textNewTag = newTag.value.trim()
    if (!textNewTag) return
    if (listTags.value.includes(textNewTag)) return

    listTags.value.push(textNewTag)
    newTag.value = ''
    openAddtag.value = false
    
}


const removeMeaning = (meaning) => {
    listMeanings.value = listMeanings.value.filter(w => w !== meaning)
}

const addMeaning = () => {
    const textNewMeaning = newMeaning.value.trim()
    if (!textNewMeaning) return

    if (!listMeanings.value.includes(textNewMeaning)) {
        listMeanings.value.unshift(textNewMeaning)
    }
    newMeaning.value = ''
   openAddMeaning.value = false
}

const selectTranslations = (idx) => {
    if (!listMeanings.value.includes(usersTranslation.value[idx])) {
        listMeanings.value.unshift(usersTranslation.value[idx]) }
    console.log('listMeanings :', listMeanings.value)
    usersTranslation.value.splice(idx, 1)
}

onMounted(async() => {
    await nextTick()
    autoResize()
})

</script>


<style scoped>
/* Custom dark scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;              /* Firefox */
  scrollbar-color: #0A0F17 #ffffff00; /* thumb color | track color */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;             /* scrollbar width */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; /* no track */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #0A0F17;     /* the dark bar you want */
  border-radius: 999px;
}

</style>

<!-- <template>
    <div class="w-52 rounded-2xl  border border-gray-300 shadow-md p-3 z-10  bg-white flex flex-col ">
        <div class="w-[240px] flex flex-col rounded-[22px] gap-2 px-2 py-4 shadow-sm">
            <div
                v-for="item in actions"
                :key="item.label"
                class="mb-4 flex items-center gap-4 last:mb-0"
            >
                <div
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[22px] leading-none"
                    :class="'status-' + item['status']"
                >
                    <img v-if="item.kind === 'trash'" src="/icons/others/trash.svg" alt="trash">
                    <font-awesome v-else-if="item.kind === 'check'" icon="check" style="color: #86efac"/>
                    <span v-else>{{ item.index }}</span>
                </div>

                <span class="flex-1 text-[26px] leading-none text-[#0f2f61] scale-[0.52] origin-left whitespace-nowrap">
                    {{ item.label }}
                </span>

                <button

                    class=" h-6 w-6 border flex items-center justify-center rounded border-gray-400 border-r-[2px] border-b-[2px] shadow-[2px_2px_1px_rgba(0,0,0,0.50)]"
                >
                    {{ item.shortcut }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const actions = [
  {
    label: 'Ignore',
    shortcut: 'x',
    kind: 'trash',
  },
  {
    label: 'New',
    shortcut: '1',
    kind: 'number',
    index: 1,
  },
  {
    label: 'Recognized',
    shortcut: '2',
    kind: 'number',
    index: 2,
  },
  {
    label: 'Familiar',
    shortcut: '3',
    kind: 'number',
    index: 3,
  },
  {
    label: 'Learned',
    shortcut: '4',
    kind: 'number',
    index: 4,
  },
  {
    label: 'Known',
    shortcut: 'k',
    kind: 'check',
  },
]
</script> -->