<template>
    <div  class="flex flex-col h-screen">
        <HeaderLing />
        <div v-if="!loading" class="flex flex-1 h-full min-h-0  pr-5">
            <div class="flex flex-1 flex-col">
                <HeaderReader v-model:currentValue="current" v-model:totalValue="total"/>
                <div ref="mainRef" class="flex-1 min-h-0 flex px-3 ">
                    <button
                        type="button"
                        @click="current = Math.max(1, current -1); $event.currentTarget.blur()"
                        :class="(current === 1) && 'transparent text-transparent pointer-events-none'"
                        class=" hover:bg-gray-300 px-2 my-20 text-2xl rounded-xl"
                    >
                        <font-awesome icon="chevron-left" />
                    </button>
                    <div class="flex-1 min-h-0 ">
                        <demoSmallReader  
                        v-if="boxHeight > 0"
                        :lesson-data="lessondata"
                        :list-sentence="listSentence"
                        :readerHeight="boxHeight" 
                        :current-phrase-status="currentPhraseData.status"
                        :status-tags-meanings="statusTagsMeanings"
                        :core-data="core_data"
                        :timestamp="timestamp"
                        :last-read-word-idx="lastReadWordIdx"
                        :lesson-and-course-name="{
                            lessonName: lesson_name,
                            courseName: course_name
                        }"
                        :is-youtube-video="youtubeData.youtube_id ? true : false"
                        v-model:current-value="current" 
                        :audio-current-time="audioCurrentTime"
                        @send-total-page="total = $event"
                        @selected="onSelected"
                        @send-status-from-reader="currentPhraseData.status = $event"
                        />

                        
                    </div>
                    <button
                        v-if="current !== total"
                        type="button"
                        @click="current = Math.min(total, current + 1); $event.currentTarget.blur()"
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
                    @send-current-time-to-parent="audioCurrentTime = $event; "
                />
            </div>

                <demoSidebar
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
import demoSidebar from './demoSidebar.vue';
// import Reader from '~/components/reading/middle/Reader.vue';
import demoSmallReader from './demoSmallReader.vue';
import LoadingProgressBar from '~/components/LoadingProgressBar.vue';
import lesson from '~/server/mock/ReaderMain.json'


const mainRef = ref(null)
const boxHeight = ref(0)
const loading = ref(true)


const current = ref(1)
const total = ref(1)

const messure = () => {
    boxHeight.value = Math.round(mainRef?.value.getBoundingClientRect().height)

}

const lessondata = ref( [])
const listSentence = ref([])
const core_data = ref([])
const statusTagsMeanings = ref({})
const youtubeData = ref({})
const timestamp = ref([])
const lastReadWordIdx = ref(0)

const audioCurrentTime = ref()



const route = useRoute()
const lesson_name = computed(() => route.query.lessonName || 'Default lesson')
const course_name = computed(() => route.query.courseName || 'Quick import')
const getLesson = async () => {
    loading.value = true
    
    try {
        const data = await $fetch('/mock/ReaderMain.json', {
        method : "GET",
        query: {
            lesson_name : lesson_name.value,
            course_name : course_name.value
        },
        credentials : 'include'
    })

    // console.log('data', data)
    // window.readerMock = data
    // JSON.stringify(window.readerMock, null, 2)
    

    lessondata.value = data.lesson_data ?? []
    listSentence.value = data.list_sentences ?? []
    statusTagsMeanings.value = data.Tags_Meanings ?? {}
    core_data.value = data.core_data?? []
    youtubeData.value = data.youtube_data?? []
    timestamp.value = data.timestamp ?? null
    lastReadWordIdx.value = data.lastReadWordIdx ?? 0



}
    catch (error) {
        console.error(error)
    }
    loading.value = false

}

const validCurrentPhrase = ref(true)

const currentPhraseData = ref({
    phrase: 'breakfast',
    tags: ["demo"],
    your_meanings: [],
    global_tags : [],
    global_meanings: [],
    status: validCurrentPhrase.value ? 2 : 0,
})



watch(currentPhraseData, (newVal) => {
  

    if (newVal.phrase.split(" ").length > 1 && newVal.status === 6) return

    if (newVal.phrase.split(" ").length > 1 && newVal.status === 0 ) { delete statusTagsMeanings.value[newVal.phrase]}
    statusTagsMeanings.value[newVal.phrase] = {
        "tags": newVal.tags,
        "your_meanings": newVal.your_meanings,
        "global_tags": newVal.global_tags,
        "global_meanings": newVal.global_meanings,
        "status": newVal.status,

    }

}, {deep: true})



const onSelected = (data) => {

    validCurrentPhrase.value  = data.valid
    currentPhraseData.value = {
        phrase : data.text,
        tags : statusTagsMeanings.value[data.text]?.tags?? [],
        your_meanings : statusTagsMeanings.value[data.text]?.your_meanings?? [],
        global_tags : statusTagsMeanings.value[data.text]?.global_tags?? [],
        global_meanings : statusTagsMeanings.value[data.text]?.global_meanings?? [],
        status : validCurrentPhrase.value ?  statusTagsMeanings.value[data.text]?.status?? 6 : 0,
    }

} 


const router = useRouter()
const {getCsrfToken} = useCsrf()
const finishLesson = async () => {
  //   loading.value = true
    
  //   const statusDict = {}
  //   const listKeys = Object.keys(statusTagsMeanings.value)
  //   for (const item of listKeys) {

  //       if (item.split(' ').length > 1 || statusTagsMeanings.value[item].status !== 6) continue
  //       statusDict[item] = statusTagsMeanings.value[item].status
  //   }

  //   console.log("statusDict to send to backend", statusDict)

  //  try {
  //       await $fetch(`/api/finish_lesson/`, {
  //           method: "PUT", 
  //           body: JSON.stringify(statusDict),
  //           credentials: "include",
  //               headers: {
  //                   "Content-Type": "application/json",
  //                   "X-CSRFToken": getCsrfToken(),
  //               }
  //       })

  //       router.push({
  //           path: '/ReviewVocabs',
  //           query: {        
  //               courseName: course_name.value,
  //               lessonName: lesson_name.value
  //           }
  //       })
  //  }

  //  catch(error) {
  //       console.log("there is an error with finish lesson", error)
  //       loading.value = false
  //  }
}



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
