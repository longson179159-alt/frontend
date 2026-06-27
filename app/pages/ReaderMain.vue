<template>
    <div  class="flex flex-col h-screen">
        <HeaderLing />
        <div v-if="!loading" class="flex flex-1 h-full min-h-0  pr-5">
            <div class="flex flex-1 flex-col">
                <HeaderReader v-model:currentValue="currentPageMain" v-model:totalValue="total"/>
                <div ref="mainRef" class="flex-1 min-h-0 flex px-3 ">
                    <button
                        type="button"
                        @click="currentPageMain = Math.max(1, currentPageMain -1); $event.currentTarget.blur()"
                        :class="(currentPageMain === 1) && 'transparent text-transparent pointer-events-none'"
                        class=" hover:bg-gray-300 px-2 my-20 text-2xl rounded-xl"
                    >
                        <font-awesome icon="chevron-left" />
                    </button>
                    <div class="flex-1 min-h-0 ">
                        <Reader  
                        v-if="boxHeight > 0 && !personalData.isSentenceMode"
                        :lesson-and-course-name="{
                            lessonName: lesson_name,
                            courseName: course_name
                        }"
                        :is-youtube-video="youtubeData.youtube_id ? true : false"
                        :readerHeight="boxHeight" 
                        :lesson-data="lessondata"
                        :list-sentence="listSentence"
                        :status-tags-meanings="statusTagsMeanings"
                        :core-data="core_data"
                        :timestamp="timestamp"
                        :current-phrase-status="currentPhraseData.status"
                        v-model:current-value="currentPageMain" 
                        v-model:last-read-word-idx="lastReadWordIdx"
                        :audio-current-time="audioCurrentTime"
                        @selected="onSelected"
                        @send-status-from-reader="currentPhraseData.status = $event"
                        @send-total-page="total = $event"
                        />

                        <SentenceView

                        v-else-if="boxHeight > 0  && personalData.isSentenceMode"
                        :lesson-and-course-name="{
                            lessonName: lesson_name,
                            courseName: course_name
                        }"
                        :is-youtube-video="youtubeData.youtube_id ? true : false"
                        :readerHeight="boxHeight" 
                        :lesson-data="lessondata"
                        :list-sentence="listSentence"
                        :status-tags-meanings="statusTagsMeanings"
                        :core-data="core_data"
                        :timestamp="timestamp"
                        :current-phrase-status="currentPhraseData.status"
                        v-model:current-value="currentPageMain"
                        v-model:last-read-word-idx="lastReadWordIdx"
                        :youtube-data="youtubeData"
                        @selected="onSelected"
                        @send-status-from-reader="currentPhraseData.status = $event"
                        />


                        
                    </div>
                    <button
                        v-if="currentPageMain !== total"
                        type="button"
                        @click="currentPageMain = Math.min(total, currentPageMain + 1); $event.currentTarget.blur()"
                        class=" hover:bg-gray-300 px-2 my-20 text-2xl rounded-xl "
                    >
                        <font-awesome icon="chevron-right" />
                    </button>
                    <button
                        v-else
                        type="button"
                        @click.prevent.stop="finishLesson(); $event.currentTarget.blur()"
                        class="self-center h-10 w-10 my-20 hover:bg-gray-200 rounded-full"
                    >
                        <font-awesome icon="fa-check" class="text-green-500"/>
                    </button>
                   
                </div>
                <FooterReader 
                    @pointerdown.stop
                    @pointermove.stop
                    @pointerup.stop
                    :youtube-data="youtubeData"
                    :is-sentence-mode="personalData.isSentenceMode"
                    @send-current-time-to-parent="audioCurrentTime = $event; "
                    @is-sentence-mode="handleSentenceModeChange"
                />
            </div>

                <Sidebar
                    @click.stop
                    @pointerdown.stop
                    @pointermove.stop
                    @pointerup.stop
                    v-model:sidebar-data="currentPhraseData"
                    :valid-phrase="validCurrentPhrase"
                    
                />

        </div>
    
        <div v-else class="px-5 py-20 w-1/2  self-center ">
            <LoadingProgressBar />
            
        </div>
    </div>
</template>

<script setup>

import { ref, computed, onMounted, nextTick, onBeforeUnmount, watch } from 'vue'

import HeaderLing from '~/components/reading/HeaderLing.vue';
import FooterReader from '~/components/reading/FooterReader.vue';
import HeaderReader from '~/components/reading/HeaderReader.vue';
import Sidebar from '~/components/reading/middle/Sidebar.vue';
import Reader from '~/components/reading/middle/Reader.vue';
import LoadingProgressBar from '~/components/LoadingProgressBar.vue';
import SentenceView from '~/components/reading/middle/SentenceView.vue';
import { useStatusMapMutations } from '~/composables/reading/shared/useStatusMapMutations';


const mainRef = ref(null)
const boxHeight = ref(0)
const loading = ref(true)



const route = useRoute()
const router = useRouter()
const {getCsrfToken} = useCsrf()

const lesson_name = computed(() => route.query.lessonName || 'Default lesson')
const course_name = computed(() => route.query.courseName || 'Quick import')

const personalData = ref({})
const lessondata = ref( [])
const listSentence = ref([])
const core_data = ref([])
const statusTagsMeanings = ref({})
const youtubeData = ref({})
const timestamp = ref([])
const lastReadWordIdx = ref(0)

const isSentenceMode = computed(() => personalData.value.isSentenceMode?? false)
// const current = ref(1)
const currentPageSentenceMode = ref(1)
const currentPageProseMode = ref(1)

const currentPageMain = computed( {
    get: () => isSentenceMode.value ? currentPageSentenceMode.value : currentPageProseMode.value,
    set: (value) => {
        if (isSentenceMode.value)  {
            currentPageSentenceMode.value = value
        }
        else {
            currentPageProseMode.value = value
        }
    }
})


const total = ref(1)





const audioCurrentTime = ref()

const validCurrentPhrase = ref(true)

const currentPhraseData = ref({
    phrase: 'breakfast',
    tags: ["demo"],
    your_meanings: [],
    global_tags : [],
    global_meanings: [],
    status: validCurrentPhrase.value ? 2 : 0,
})

const { removeStatusMapEntry, upsertStatusMapEntry } = useStatusMapMutations(statusTagsMeanings)

const messure = () => {
    if (!mainRef.value) return
    boxHeight.value = Math.round(mainRef?.value.getBoundingClientRect().height)

}

const applyLessonResponse = (data) => {
    lessondata.value = data.lesson_data ?? []
    listSentence.value = data.list_sentences ?? []
    statusTagsMeanings.value = data.Tags_Meanings ?? {}
    core_data.value = data.core_data?? []
    youtubeData.value = data.youtube_data?? []
    timestamp.value = data.timestamp ?? []
    
    personalData.value = data.personalData ?? {
        isSentenceMode : false
    }

    lastReadWordIdx.value = data.lastReadWordIdx ?? 0
}

const buildCurrentPhraseData = (data) => ({
    phrase : data.text,
    tags : statusTagsMeanings.value[data.text]?.tags?? [],
    your_meanings : statusTagsMeanings.value[data.text]?.your_meanings?? [],
    global_tags : statusTagsMeanings.value[data.text]?.global_tags?? [],
    global_meanings : statusTagsMeanings.value[data.text]?.global_meanings?? [],
    status : validCurrentPhrase.value ?  statusTagsMeanings.value[data.text]?.status?? 6 : 0,
})

const buildFinishLessonPayload = () => {
    const statusDict = {}
    const listKeys = Object.keys(statusTagsMeanings.value)
    for (const item of listKeys) {

        if (item.split(' ').length > 1 || statusTagsMeanings.value[item].status !== 6) continue
        statusDict[item] = statusTagsMeanings.value[item].status
    }

    return statusDict
}

const onSelected = (data) => {

    validCurrentPhrase.value  = data.valid
    currentPhraseData.value = buildCurrentPhraseData(data)

} 

const handleSentenceModeChange = (nextMode) => {
    personalData.value.isSentenceMode = nextMode

    
}

const getLesson = async () => {
    loading.value = true
    
    try {
        const data = await $fetch(`/api/get_lesson/`, {
        method : "GET",
        query: {
            lesson_name : lesson_name.value,
            course_name : course_name.value
        },
        credentials : 'include'
    })

    

    applyLessonResponse(data)



}
    catch (error) {
        console.error(error)
    }
    loading.value = false

}

const finishLesson = async () => {
    loading.value = true
    
    const statusDict = buildFinishLessonPayload()

    console.log("statusDict to send to backend", statusDict)

   try {
        await $fetch(`/api/finish_lesson/`, {
            method: "PUT", 
            body: JSON.stringify(statusDict),
            credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                }
        })

        router.push({
            path: '/ReviewVocabs',
            query: {        
                courseName: course_name.value,
                lessonName: lesson_name.value
            }
        })
   }

   catch(error) {
        console.log("there is an error with finish lesson", error)
        loading.value = false
   }
}

watch(currentPhraseData, (newVal, oldVal) => {
  

    if (newVal.phrase.split(" ").length > 1 && newVal.status === 6) return

    if (newVal.phrase.split(" ").length > 1 && (newVal.status === 0 || oldVal.status === 0) ) { removeStatusMapEntry(newVal.phrase); return}
    upsertStatusMapEntry(newVal)

}, {deep: true})

watch(
   isSentenceMode,
   async (newVal) => {
    total.value = newVal
      ? timestamp.value.length
      : total.value
    if (!newVal) {
        // total.value = 1
        // currentPageProseMode.value = 1
        await nextTick();
        messure();  
    }
  },
  { immediate: true }
)


onMounted(async () => {
    await getLesson()
    messure();  
    await nextTick();
   
    window.addEventListener('resize', messure)

})

onBeforeUnmount(() => {
    window.removeEventListener('resize', messure)
})


</script>
