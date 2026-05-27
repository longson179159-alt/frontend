<template>

    <NuxtLink :to="{
        path : '/ReaderMain',
        query : {
            lessonName : props.lessonName,
            courseName : props.courseName
        }
        
    }"
        :preserve-scroll="true"
        class=" z-10 mb-3 bg-white min-h-64  block border w-full rounded-2xl overflow-hidden shadow-md group shrink-0"
        :class="showUnder && 'border-gray-300'"> 
        <!-- UPPER   -->
        <div class=" relative aspect-[3/2] border bg-cover bg-center "
            :style="{ backgroundImage: `url(${normalizedLessonImgUrl})` }">
            <div
                class="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 via-black/40 to-black-30">
            </div>
            <!-- top left -->
            <div class="absolute top-2 left-2 flex items-center gap-1">
                <img src="/images/lingLogo.png" alt="lingLogo" class=" h-10 ">
                <span class="text-white text-sm hidden group-hover:inline">LingQ</span>
            </div>
            <!-- top right -->
            <div class="absolute top-2 right-2  items-center hidden  group-hover:flex">
                <button
                    @mouseenter="hoverPlusButton = true"
                    @mouseleave="hoverPlusButton = false"
                    @click.stop.prevent="moveLessonCard"
                    :class="(hoverPlusButton && continuingLesson && !builtinLesson) && 'hover:bg-red-600'"
                    class="h-8 w-8 bg-green-400 hover:bg-green-600 rounded-full mr-1 flex items-center justify-center">

                    <img v-if="hoverPlusButton && continuingLesson && !builtinLesson"  src="/icons/others/whiteTrash.svg" alt ="whiteTrash"/>
                    <font-awesome v-else-if="hoverPlusButton && continuingLesson && builtinLesson" icon="minus" />
                    <font-awesome v-else icon="plus" />
                    </button>
                <button @click.stop.prevent="emit('showCourseInfos', courseName)" class="h-8 w-8 bg-white rounded-full"><font-awesome icon="chevron-down" /></button>
            </div>

            <!-- center -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                    class=" h-16 w-16 rounded-full bg-blue-800/80 flex items-center justify-center text-3xl font-semibold text-yellow-400">
                    {{ lessonNumber }}
                </div>
            </div>

            <!-- bottom left -->
            <div class="absolute left-2 bottom-2 text-white text-sm font-medium">
                <div class="flex items-center justify-start">
                    <div class="w-6 h-3 rounded-full bg-blue-400 border border-blue-600"></div>
                    <span class="ml-1">{{ numberNewWords }} <span class="hidden group-hover:inline">New
                            Words</span></span>
                </div>
                <div class="flex items-center justify-start">
                    <div class="w-6 h-3 rounded-full bg-yellow-400 border border-yellow-600"></div>
                    <span class="ml-1">{{ numberLingQs }} <span
                            class="hidden group-hover:inline">LingQs</span></span>
                </div>
                <div class="flex items-center justify-start">
                    <div class="w-6 h-3 rounded-full bg-white border border-gray-300"></div>
                    <span class="ml-1">{{ numberKnownWords }} <span class="hidden group-hover:inline">Known
                            Words</span></span>
                </div>
            </div>

            <!-- bottom right -->
            <span
                class="absolute block h-5 w-10 right-2 bottom-2 rounded-full border border-white text-white text-sm flex justify-center items-center font-medium gap-0.5 bg-gray-500/90">
                <img src="/icons/header/heart.svg" class="h-4" /> 10
            </span>
        </div>

        <!-- LOWER -->
        <div class="px-2 text-sm">
            <div class="flex justify-between items-start text-base">
                <span class=" inline-block truncate">
                    {{ lessonName }}
                </span>
                <button
                    class="h-8 w-8 hover:bg-gray-200 self-start rounded-full flex items-center justify-center flex-shrink-0">
                    <font-awesome icon="ellipsis-v" />
                </button>
            </div>

            <div> <span class="inline-block mt-3 h-2 w-2 rounded-full bg-blue-400"></span> {{ newWordsPercents }}% New
                words Intermediate 1 </div>
            <div class="flex justify-between ">
                <span class="truncate max-w-40">LingQ Mini Stories - France histoir Une nouvelle maison</span>
                <!-- <span class="inline-flex gap-1 whitespace-nowrap "><img src="/icons/header/importAudio.svg" />
                    3:03</span> -->
            </div>

            <span class="inline-block my-2 text-gray-500 truncate">{{ courseName }}</span>
        </div>


    </NuxtLink>

    

</template>

<script setup>

import {ref, computed} from 'vue'


const showUnder = ref(false)
const hoverPlusButton = ref(false)
// const config = useRuntimeConfig()
const { getCsrfToken } = useCsrf()


const props = defineProps({
    lessonImgUrl : {type: String, default: '/images/demo.png'},
    courseName : {type: String, default: "Quick import"},
    lessonNumber : {type: Number, default : 10},
    lessonName : {type:String, default: "Lesson name by default"},
    numberNewWords : {type: Number, default: 8},
    numberLingQs: {type: Number, default: 9},
    numberKnownWords: {type: Number, default: 10},
    newWordsPercents: {type:Number, default: 11},
    continuingLesson : {type: Boolean, default : false},
    builtinLesson: {type: Boolean, default: false}
})


// Create a computed value named normalizedLessonImgUrl that recalculates when dependencies change
const normalizedLessonImgUrl = computed(() => {
  // Read the lessonImgUrl prop into a local variable
  const input = props.lessonImgUrl
  // If input is missing or not a string, return a fallback image path
  if (!input || typeof input !== 'string') return '/images/lesson.png'

  // Comment: input is already a relative media path (example: /media/abc.jpg)
  // Check if input starts with /media/
  if (input.startsWith('/media/')) {
    // Prefix /api so it routes through your backend API path
    return `/api${input}`
  }

  // Comment: input is a full URL (http/https), maybe like https://site.com/media/abc.jpg
  // Check if input starts with http:// or https://
  if (input.startsWith('http://') || input.startsWith('https://')) {
    // Try parsing the URL safely
    try {
      // Create URL object from the input string
      const u = new URL(input)
      // If the URL path begins with /media/, rewrite it to your /api media route and keep query params
      if (u.pathname.startsWith('/media/')) {
        // Return /api + path + search query (if any)
        return `/api${u.pathname}${u.search}`
      }
    // If URL parsing fails, handle it here
    } catch {
      // Comment: invalid URL string, so do nothing and fall through to return original input
    }
  }

  // If none of the above matched, return the input as-is
  return input
// End of computed function
})





const emit = defineEmits(['deleteLesson', 'removeFromContinuing', 'addToContinuting','showCourseInfos'])



const addToContinuingLesson = () => {
    emit('addToContinuting', {
            imgUrl : props.lessonImgUrl,
            courseName : props.courseName,
            lessonNumber : props.lessonNumber,
            lessonName : props.lessonName,
            numberNewWords : props.numberNewWords,
            numberKnownWords : props.numberKnownWords,
            newWordsPercents : props.newWordsPercents,
            builtinLesson : props.builtinLesson,
        })

    
}

const removeFromContinuingLesson = () => {
    emit('removeFromContinuing', {
        courseName: props.courseName,
        lessonName: props.lessonName
    })

}

const deleteLesson = async() =>{
    try {
        await $fetch(`/api/delete_lesson/`, {
            method: 'POST',
            body: {
                lesson_name : props.lessonName,
                course_name : props.courseName
            },
            credentials : 'include',
            headers: {
                'X-CSRFToken': getCsrfToken()
            }
        })
        removeFromContinuingLesson()
    }

    catch (error) {
        const messageErr = error?.data?.message?? 'Error with delete lesson'
        alert(messageErr)
    }
}

const moveLessonCard =  () => {
    if (hoverPlusButton.value && props.continuingLesson && !props.builtinLesson) {
        deleteLesson()
    }

    else if (hoverPlusButton && props.continuingLesson && props.builtinLesson) {
        removeFromContinuingLesson()
    }

    else {
        addToContinuingLesson()
    }
}


</script>
