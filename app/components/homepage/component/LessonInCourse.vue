<template>
    <NuxtLink :to="{
        path : '/ReaderMain',
        query : {
            lessonName : props.lessonName,
            courseName : props.courseName
        }
    }"
    class="px-8  block cursor-pointer">
        <div class="shadow-md border p-1 border-gray-300 flex flex-col md:flex-row rounded-2xl">
            <div class="relative rounded-2xl">
                <img :src="normalizedLessonImgUrl" alt="lessonImgUrl" class="h-40 w-full md:w-40 rounded-2xl object-cover">
            </div>

            <div class="flex flex-col justify-center md:justify-between flex-1 px-3 pt-2">
                <span class="text-lg font-bold text-center md:text-left pb-3">{{ lessonName }}</span>
                <div class="flex flex-col items-center justify-center space-y-3 md:space-y-0 md:flex-row md:justify-between">
                    <!-- leftbottom -->
                    <div class="flex flex-col space-y-2 sm:space-y-0 sm:flex-row items-center gap-0.5 text-sm">
                        <!-- percent new words and lingq -->
                        <div class="flex items-center gap-1 shrink-0">
                            <div class="h-4 w-6 rounded-lg border border-blue-400 bg-blue-200"></div>
                            <span> {{`${numberNewWords} (${newWordsPercents}%)`}}</span>
                            <div class="h-4 w-6 ml-2 rounded-lg border border-yellow-400 bg-yellow-200"></div>
                            <span>{{ numberLingQs }}</span>
                        </div>
                        <span class="ml-2 text-gray-600 font-medium">{{level}}</span>
                        <!-- time and link button -->
                        <div class="shrink-0 flex items-center">
                            <img src="/icons/header/importAudio.svg" alt="importAudio" class="ml-2 mr-1"/>
                            <span>{{audioDuration}}</span>
                            <button @click.stop.prevent="likeThisLesson" 
                            class="h-5 border px-2 py-1 ml-2 mr-1 rounded-xl inline-flex items-center gap-1  border-gray-400"
                            :class="likeLesson && 'bg-gray-200 border-gray-800'"
                            >
                                <img v-if="!likeLesson" src="/icons/others/heartPreLike.svg" alt="heartPreLike">
                                <img v-else src="/icons/others/heartLike.svg" alt="heartPreLike">
                                {{likes}}
                            </button>
                        </div>
                    </div>

                    <!-- rightbottom -->
                     <div class="flex gap-2">
                        <button @click.stop.prevent="" class="h-10 w-10 rounded-full border bg-green-400 hover:bg-green-600 transition duration-300"><font-awesome icon="plus"/></button>
                        <button @click.stop.prevent="" class="h-10 w-10 rounded-full border bg-white hover:bg-gray-300 border-gray-300 transition duration-300"><font-awesome icon="ellipsis-v"/></button>
                     </div>
                </div>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup>

import {computed, ref, toRefs} from 'vue'
import { normalizeMediaUrl } from '~/utils/media/normalizeMediaUrl'

const likeLesson = ref(false)



const props = defineProps({
    lessonImgUrl : {type: String, default: '/images/lesson.jpg'},
    lessonName : {type:String, default: "Lesson name by default"},
    courseName : {type: String, default: "Quick import"},
    lessonNumber : {type: Number, default : 10},
    numberNewWords : {type: Number, default: 8},
    numberLingQs: {type: Number, default: 9},
    numberKnownWords: {type: Number, default: 10},
    newWordsPercents: {type:Number, default: 11},
    continuingLesson : {type: Boolean, default : false},
    builtinLesson: {type: Boolean, default: false},


    level: {type:String, default: "Intermediate 1"},
    audioDuration: {type: String, default: "10:10"},
    numberLike: {type: Number, default: 17}
})

const normalizedLessonImgUrl = computed(() => {
  return normalizeMediaUrl(props.lessonImgUrl, '/images/lesson.png')
})





const {
  lessonImgUrl, courseName, lessonName,
  numberNewWords, numberLingQs, newWordsPercents,
  level, audioDuration, numberLike
} = toRefs(props)


const likes = ref(numberLike.value)
const likeThisLesson = () => {
    if (likeLesson.value) {
        likes.value --
    }
    else {
        likes.value ++
    }

    likeLesson.value = !likeLesson.value

}

</script>
