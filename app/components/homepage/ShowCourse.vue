<template>
    <div class="fixed inset-0 cursor-pointer w-full bg-black/50 z-30 px-5 py-5  flex  justify-center overflow-y-auto ">
        <div class="max-w-4xl pb-10 flex flex-col w-full  bg-white rounded-3xl shadow-lg border border-gray-300 ">
            <!-- upper Part -->
            <div class="relative h-80 ">
                <button @click="emit('showCourseInfos', false)" class="absolute z-10 top-5 left-5 h-10 w-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 whitespace-nowrap shrink-0">
                    <font-awesome icon="times" class="text-xl"/>
                </button>
                <img :src="normalizedCourseImgUrl || '/images/course.png'" alt="courePicture"
                class="w-full h-full object-cover rounded-3xl "
                >
                <div class="absolute inset-0 bg-gradient-to-b from-black/0 to-black/50 "></div>
            </div>

            <!-- Course infos -->
             <div class="flex p-8 justify-between flex-col md:flex-row ">
                <!-- left side -->
                 <div class="space-y-3">
                    <!-- first line -->
                   <span class=" w-full flex  items-center font-semibold justify-center md:justify-start">
                        <span>{{level}}</span>
                        <img src="/icons/header/importAudio.svg" alt="importAudio" class="ml-3 mr-1">
                        <span>{{audioDuration}}</span>
                   </span>
                   <!-- second line -->
                   <div class="flex space-x-3">
                        <span v-for="ref in listReferences" :key="ref"
                        class="px-1 py-1 bg-gray-200 text-xs text-gray-600 flex border border-gray-300 rounded whitespace-nowrap shrink-0">
                            {{ref}}
                        </span>
                   </div>

                   <!-- third line -->
                    <div class="flex space-x-5">
                        <img :src="authorAvatar" alt="authorAvatar" class="h-10 w-10 rounded-full">
                        <div class="flex flex-col">
                            <span class="font-medium text-gray-500">SHARE BY</span>
                            <span class="font-medium">{{author}}</span>
                        </div>
                    </div>
                 </div>
                <!-- right side (show statistics)-->
                 <div class="w-full md:w-[250px] flex flex-col gap-3">
                    <!-- New word -->
                    <div class="w-full">
                        <!-- show new words statistics -->
                        <div class="flex justify-between w-full">
                            <span class="text-sm">{{`New words (${newWordsPercents}%)`}}</span>
                            <span class="font-medium text-sm">{{numberNewWords}}</span>
                        </div>
                        <!-- progress bar -->
                        <div class="h-2 w-full bg-gray-200 rounded">
                            <div class="h-full bg-blue-300 rounded" :style="{width: newWordsPercents + '%'}"></div>
                        </div>
                    </div>
                    <!-- LingQs -->
                    <div class="w-full">
                        <!-- show lingqs statistics -->
                        <div class="flex justify-between w-full">
                            <span class="text-sm">LingQs</span>
                            <span class="font-medium text-sm">{{numberLingQs}}</span>
                        </div>
                        <!-- progress bar -->
                        <div class="h-2 w-full bg-gray-200 rounded">
                            <div class="h-full bg-yellow-300 rounded" :style="{width: (numberTotalWords? (numberLingQs / numberUniqueWords) * 100  : 0) + '%'}"></div>
                        </div>
                    </div>
                    <!--  number KnownWords -->
                    <div class="w-full">
                        <!-- show known words statistics -->
                        <div class="flex justify-between w-full">
                            <span class="text-sm">Known words</span>
                            <span class="font-medium text-sm">{{numberKnownWords}}</span>
                        </div>
                        <!-- progress bar -->
                        <div class="h-2 w-full bg-gray-200 border rounded">
                            <div class="h-full bg-white rounded" :style="{width: (numberTotalWords ? ( numberKnownWords / numberUniqueWords) * 100 : 0) + '%'}"></div>
                        </div>
                    </div>

                    <span class="block text-xs text-center w-full">{{`${numberTotalWords} Total Words | ${numberUniqueWords} Unique Words`}}</span>
                 </div>
             </div>

             <!-- Course name and search lesson -->
              <div class="flex px-8 py-0 md:py-8 flex-col justify-center gap-3  md:flex-row md:justify-between">
                <span class="font-medium text-gray-700 text-center">Course: {{courseName}}</span>
                <div class="w-auto md:w-2/5 flex flex-col gap-3 justify-center items-center md:flex-row">
                    <div class="border px-2 py-1 text-sm rounded-md bg-gray-200 whitespace-nowrap shrink-0">
                        <input type="text" placeholder="Search lesson" class="outline-none bg-gray-200 ring-0 appearance-none">
                        <font-awesome icon="search" class="text-gray-600"/>
                    </div>
                    <div class="flex flex-row whitespace-nowrap shrink-0">
                        <img src="/icons/others/course.svg" alt="">
                        {{numberLessons}} 
                        lesson
                    </div>
                </div>
              </div>

              
                <LessonInCourse
                class="py-3 z-50 bg-white"
                v-for="item in dataLessons"
                :lesson-img-url="item.imgUrl || '/images/lesson.png'"
                :course-name="item.courseName"
                :lesson-name="item.lessonName"
                :lesson-number="item.lessonNumber"
                :number-new-words="item.numberNewWords"
                :number-ling-qs="item.numberLingQs"
                :number-known-words="item.numberKnownWords"
                :new-words-percents="item.newWordsPercents"
                :builtin-lesson='item.builtinLesson ?? false'

                />

              
        </div>
    </div>
</template>

<script setup>
import {ref, computed,  toRefs} from 'vue'
import LessonInCourse from './component/LessonInCourse.vue'


const listReferences = ['literature', 'audiobooks', 'books', 'kids', 'children', 'le petit prince']


const emit = defineEmits(['showCourseInfos'])

const props = defineProps({
    dataCourse: {type: Object, default: () => {}},
    dataLessons: {type: Array, default : () => []},

    level: {type:String, default: "Intermediate 1"},
    audioDuration: {type: String, default: "10:10"},
    numberLike: {type: Number, default: 17},
    authorAvatar: {type: String, default : '/images/lesson.png'},
    author: {type: String, default : 'Mr Steve'}
})

const courseImgUrl = computed(() => props.dataCourse.imgUrl)
const numberLessons = computed(() => props.dataCourse.numberLessons)
const courseName = computed(() => props.dataCourse.courseName)
const numberNewWords = computed(() => props.dataCourse.numberNewWords)
const numberLingQs = computed(() => props.dataCourse.numberLingQs)
const numberKnownWords = computed(() => props.dataCourse.numberKnownWords)
const newWordsPercents = computed(() => props.dataCourse.newWordsPercents)
const numberTotalWords = computed(() => props.dataCourse.numberTotalWords)
const numberUniqueWords = computed(() => props.dataCourse.numberUniqueWords)


const normalizedCourseImgUrl = computed(() => {
  const input = courseImgUrl.value
  if (!input || typeof input !== 'string') return '/images/course.png'

  // already relative media path
  if (input.startsWith('/media/')) {
    return `/api${input}`
  }

  // generic absolute URL (http/https) whose path is /media/...
  if (input.startsWith('http://') || input.startsWith('https://')) {
    try {
      const u = new URL(input)
      if (u.pathname.startsWith('/media/')) {
        return `/api${u.pathname}${u.search}`
      }
    } catch {
      // invalid URL string -> keep original
    }
  }

  return input
})




</script>



