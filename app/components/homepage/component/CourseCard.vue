
<template>
  <!-- <div class="max-w-md border m-5 mx-auto flex items-center justify-center "> -->
    <div @click="emit('showCourseInfos', courseName)" class="relative cursor-pointer min-w-52 mb-3 inline-flex items-center justify-between" @mouseenter="showUnder = true"
        @mouseleave="showUnder = false">
        <div class=" z-10 bg-white min-h-64  block border w-full rounded-2xl overflow-hidden group shrink-0 shadow-md"
            :class="showUnder && 'border-gray-300'">
            <!-- UPPER   -->
            <div class=" relative aspect-[3/2] border bg-cover bg-center "
                :style="{ backgroundImage: `url(${normalizedCourseImgUrl} )` }">
                <div
                    class="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-black/20 to-transparent">
                </div>
                <!-- top left -->
                <div class="absolute top-2 left-2 flex items-center gap-1">
                    <img src="/images/lingLogo.png" alt="lingLogo" class=" h-10 ">
                    <span class="text-white text-sm hidden group-hover:inline">LingQ</span>
                </div>
                <!-- top right -->
                <div class="absolute top-2 right-2  items-center hidden group-hover:flex ">
                    <button
                        @mouseenter="showTrash = true"
                        @mouseleave="showTrash = false"
                        @click.stop.prevent="deleteCourse"
                        class="h-8 w-8 bg-green-400 hover:bg-red-600 rounded-full mr-1 flex items-center justify-center">
                        <img v-if="showTrash" src="/icons/others/whiteTrash.svg" alt="whiteTrash"/>
                        <font-awesome v-else icon="plus" />
                        </button>
                    <button class="h-8 w-8 bg-white rounded-full"><font-awesome icon="chevron-down" /></button>
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
            <div class="px-2 py-2  text-sm flex flex-col ">
                <div class="flex justify-between items-start text-base">
                    <span class=" inline-block truncate">
                        {{ courseName }}
                    </span>
                    <button
                        class="h-8 w-8 hover:bg-gray-200 self-start rounded-full flex items-center justify-center flex-shrink-0">
                        <font-awesome icon="ellipsis-v" />
                    </button>
                </div>

                <div> <span class="inline-block mt-3 h-2 w-2 rounded-full bg-blue-400"></span> {{ newWordsPercents }}% New
                    words Beginner 1 </div>
                <div class="flex justify-between ">
                    <span class="truncate max-w-40">LingQ Mini Stories - France histoir Une nouvelle maison</span>
                    <!-- <span class="inline-flex gap-1 whitespace-nowrap "><img src="/icons/header/importAudio.svg" />
                        3:03</span> -->
                </div>

                <div class="inline-flex gap-1 my-1">
                    <img src="/icons/others/course.svg" alt="course"/>
                    <span>{{numberLessons}} lessons</span>
                </div>
            </div>


        </div>
        <div v-show="showUnder" class=" absolute -bottom-[5px]  w-full ">
            <div class="bg-gray-50 ml-2 mr-1 h-5 rounded-2xl border border-gray-300 shadow-md"></div>
        </div>
    </div>

  <!-- </div> -->
</template>

<script setup>

import {ref} from 'vue'
import { deleteCourseRequest } from '~/services/homepage/homepageApi'
import { normalizeMediaUrl } from '~/utils/media/normalizeMediaUrl'
// const config = useRuntimeConfig()
const showUnder = ref(false)
const showTrash = ref(false)
const props = defineProps({
    courseImgUrl : {type:String, default : '/images/course.png'},  
    numberLessons : {type: Number, default : 10},
    courseName : {type:String, default: "Lesson name by default"},
    numberNewWords : {type: Number, default: 8},
    numberLingQs: {type: Number, default: 9},
    numberKnownWords: {type: Number, default: 10},
    newWordsPercents: {type:Number, default: 11},
})

const normalizedCourseImgUrl = computed(() => {
  return normalizeMediaUrl(props.courseImgUrl, '/images/course.png')
})



const emit = defineEmits(['deleteCourse', 'showCourseInfos'])

const deleteCourse = async () => {
    try {
        const result =  await deleteCourseRequest({
            courseName: props.courseName
        })

        emit('deleteCourse', props.courseName)
    }

    catch (error) {
        const errMessage = error?.data?.message?? "Can't delete this course"
       
        alert(errMessage)
    }
}

</script>
