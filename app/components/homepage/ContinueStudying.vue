<template>
    <div v-if="data.length !== 0" class="flex flex-col py-2 bg-gray-50">
        <div class="flex items-center  flex-gap flex-col md:flex-row px-3 md:px-[56px] mb-2">
            <span class="font-semibold mr-3 self-start">Continue Studying <font-awesome icon='play' class="text-gray-300 text-sm"></font-awesome></span>
            <div class="flex gap-3 self-center">
                <button @click="changeMode('lesson')" :class="mode === 'lesson' && 'font-bold'">Lesson</button>
                <button @click="changeMode('course') " :class="mode === 'course' && 'font-bold'">Course</button>              
            </div>
        </div>

        <div class="flex mb-2">
            <button 
            :disabled="indexStart === 0"
            class="w-[12px] md:w-[56px] flex items-center justify-center text-3xl hover:text-4xl "      
            @click="Previous">
                <font-awesome icon="chevron-left" v-show="!isMobile && data.length > numberGrid && indexStart !== 0"/>
            </button>
            <div v-if="mode === 'lesson'" class=" w-full flex flex-row overflow-x-auto gap-x-2 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                <LessonCard
                v-for="(item , idx) in visibleData" :key="item.lessonName + item.courseName"
                :course-name="item.courseName"
                :lesson-img-url="item.imgUrl"
               
                :lesson-name="item.lessonName"
                :lesson-number="item.lessonNumber"
                :youtube-duration="item.youtubeDuration"
                :number-new-words="item.numberNewWords"
                :number-ling-qs="item.numberLingQs"
                :number-known-words="item.numberKnownWords"
                :new-words-percents="item.newWordsPercents"
                :continuing-lesson="true" 
                :builtin-lesson="item.builtinLesson ?? false"
                @remove-from-continuing="removeLesson"
                @show-course-infos="emit('showCourseInfos', $event)"
                />
            </div>
            <div v-else class=" w-full flex flex-row overflow-x-auto gap-x-2 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                <CourseCard
                v-for="(item , idx) in visibleData" :key="item.courseName"
                :course-img-url="item.imgUrl"
                :number-lessons="item.numberLessons"
                :course-name="item.courseName"
                :number-new-words="item.numberNewWords"
                :number-ling-qs="item.numberLingQs"
                :number-known-words="item.numberKnownWords"
                :new-words-percents="item.newWordsPercents"
                @delete-course="removeCourse"
                @show-course-infos="emit('showCourseInfos', $event)"
                />
            </div>
            
            <button 
            :disabled="!canGoNext"
            class="w-[12px] md:w-[56px] flex items-center justify-center text-3xl hover:text-4xl "
            @click="Next" >
                <font-awesome icon="chevron-right" v-show="!isMobile && canGoNext"/>
            </button>
        </div>
    </div>
</template>


<script setup>


import {ref, computed, watch, onMounted} from 'vue'
import { useBreakpoints } from '@vueuse/core';
// import CourseCard from './homepage/component/CourseCard.vue';
// import LessonCard from './homepage/component/LessonCard.vue';
import CourseCard from './component/CourseCard.vue';
import LessonCard from './component/LessonCard.vue';
import {
    getCourseCardsRequest,
    getLessonCardsRequest,
} from '~/services/homepage/homepageApi.js'



const data = ref([])
const dataLessonCards = ref([])
const dataCourseCards = ref([])

const lessonCurrentPage = ref(1)
const lessonTotalPage = ref(2)

const lessonHasNextPage = ref(false)
const courseHasNextPage = ref(false)

const courseCurrentPage = ref(1)
const courseTotalPage = ref(2)


const props = defineProps({
    newLessonData : {type : Object, default: () => ({})}
})

const emit = defineEmits(['showCourseInfos'])



// Get lesson cards data
const getLessonCardsData = async () => {

    try {
        const dataBackend = await getLessonCardsRequest({
            page: lessonCurrentPage.value
        })

        dataLessonCards.value = [
            ...dataLessonCards.value,
            ...(dataBackend?.['dataLessonCards'] ?? [])
        ]

        data.value = dataLessonCards.value

        const paginationInfo = dataBackend?.["pagination"] ?? {}
        lessonTotalPage.value = paginationInfo.totalPages ?? 1

        lessonHasNextPage.value = paginationInfo.hasNext ?? false

}
    catch (error) {
        console.log('error fetching lesson cards data:', error)
    }
}

const getCourseCardsData = async () => {

    try {
        const dataBackend = await getCourseCardsRequest({
            page: courseCurrentPage.value
        })

        dataCourseCards.value = [
            ...dataCourseCards.value,
            ...(dataBackend?.["dataCourseCards"] ?? [])
        ]
        data.value = dataCourseCards.value

        const paginationInfo = dataBackend?.["pagination"] ?? {}
        courseTotalPage.value = paginationInfo.totalPages ?? 1
        courseHasNextPage.value = paginationInfo.hasNext ?? false

}
    catch (error) {
        console.log('error fetching course cards data:', error)
    }
}


const mode = ref("lesson")
const changeMode = async (type) => {
    mode.value = type
    indexStart.value = 0
    if (type === "lesson") {
        data.value = dataLessonCards.value
    }
    else if (type === "course") {
        console.log("change to course mode")
        if (dataCourseCards.value.length === 0) await getCourseCardsData()
        data.value = dataCourseCards.value
    }
}

const indexStart = ref(0)
const breakpoints = useBreakpoints({
    md: 768,
    lg: 1024,
    xl: 1280,
})

const isMobile = computed(() => breakpoints.smaller("md").value)

const numberGrid = computed(() => {
    if (isMobile.value) return data.value.length
    else if (breakpoints.between("md", "lg").value) return 3
    else if (breakpoints.between("lg", "xl").value) return 4
    else return 5
})

const hiddenLoadedCount = computed(() => {
    if (isMobile.value) return 0
    return Math.max(0, data.value.length - (indexStart.value + numberGrid.value))
})

const visibleData = computed(() => {
    if (isMobile.value) return data.value
    return data.value.length - numberGrid.value > 0 ? data.value.slice(indexStart.value, indexStart.value + numberGrid.value) : data.value
})

const Previous = () => {
    if (isMobile.value) return
    indexStart.value = Math.max(0, indexStart.value - numberGrid.value)
}


const hasLocalPartialNextPage = computed(() => hiddenLoadedCount.value > 0)

const Next = async () => {
    if (isMobile.value) return

   

    if (data.value.length < numberGrid.value) return


    const needMoreData  = data.value.length < indexStart.value + 2 * numberGrid.value

   
    if (needMoreData) {
        if (mode.value === 'lesson') {
            if (lessonCurrentPage.value === lessonTotalPage.value) {
                 if (hasLocalPartialNextPage.value) {
                        indexStart.value = Math.min(data.value.length - numberGrid.value, indexStart.value + numberGrid.value)
                    }
                    return
            }
            lessonCurrentPage.value += 1
             await getLessonCardsData()
        } else if (mode.value === 'course') {
            if (courseCurrentPage.value === courseTotalPage.value) {
               if (hasLocalPartialNextPage.value) {
                    indexStart.value = Math.min(data.value.length - numberGrid.value, indexStart.value + numberGrid.value)
                }
                return 
            }
            courseCurrentPage.value += 1
            await getCourseCardsData()
        }
    } 
    
    indexStart.value = Math.min(data.value.length - numberGrid.value, indexStart.value + numberGrid.value)   

}

const canGoNext = computed(() => {
    if (isMobile.value) return false

    const hasMoreLoadedData = data.value.length > indexStart.value + numberGrid.value
    const hasMoreBackendData = mode.value === 'lesson' ? lessonHasNextPage.value : courseHasNextPage.value

    return hasMoreLoadedData || hasMoreBackendData
}) 




watch([() => data.value.length, () => isMobile.value, () => numberGrid.value], ([newLen, newIsMobile, newNumberGrid]) => {
    if (newIsMobile) return
    if (newLen < newNumberGrid) {
        indexStart.value = 0
        return
    }

    indexStart.value = Math.max(0, Math.min(newLen - newNumberGrid, indexStart.value))
})

watch(() => props.newLessonData, (newVal) => {
  
   
    const index = dataLessonCards.value.findIndex(item => item.lessonName === newVal.lessonName && item.courseName === newVal.courseName)
    if (index !== -1) {
        dataLessonCards.value.splice(index, 1)
        dataLessonCards.value.unshift(newVal)
        data.value = dataLessonCards.value
    }

    else {
        dataLessonCards.value.unshift(newVal)
        data.value = dataLessonCards.value
    }
}, {deep: true})


const removeLesson = (childData) => {
    dataLessonCards.value = dataLessonCards.value.filter(card => !(card.lessonName === childData.lessonName && card.courseName === childData.courseName))
    data.value = dataLessonCards.value

}


const removeCourse = (courseDelete) => {
 
    dataLessonCards.value = dataLessonCards.value.filter(card => card.courseName !== courseDelete)
    dataCourseCards.value = dataCourseCards.value.filter(card => card.courseName !== courseDelete)

    data.value = dataCourseCards.value

}

onMounted(async () => {
    await getLessonCardsData()
  
})


</script>
