<template>
  <div class="max-w-sm md:max-w-md lg:max-w-6xl mx-auto px-3 my-5 " >
    <div class="flex justify-between items-start py-5">
      <NuxtLink to="/HomepageLingQ" class="hover:bg-gray-100 px-3 py-1 text-center rounded-md"> <font-awesome icon="chevron-left" /> Back
        Homepage</NuxtLink>
      <div class="flex flex-col items-end">
        <button @click="toggleSaveOrOpen" class="bg-[#0B1B32] hover:bg-black font-medium text-white px-3 py-1 rounded-md">
          {{createLessonSuccessfully ? 'Open  lesson' : loading? "Loading ..." : 'Save and generate lesson'}}
        </button>
          <span class="text-sm text-red-600 mr-3 whitespace-pre-line">{{messageCreateLesson}}</span>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row ">
      <LeftPart
       class="w-full lg:w-[236px] lg:pr-10 lg:mt-10 lg:border-r lg:border-r-gray-400" 
       @sendLanguage="language = $event"
       @sendPictureFile="pictureFile = $event"
        @sendLevel="level = $event;"
       />
      <div class=" w-full lg:pl-10">
        <!-- IMPORT LESSON PART -->
        <div>
          <span class="text-lg text-center text-blue-500 block font-bold">Lesson name && decription</span>
          <input type="text" v-model="lessonName"
            class="border border-gray-400 my-3 w-full px-3 py-2 rounded-md 
            placeholder:text-gray-700 
            focus:outline-none focus:ring-2  focus:ring-gray-300 focus:shadow-lg focus:border-gray-500"
            placeholder="Add title 60 charaters max" />

          <textarea type="text" v-model="lessonDescription"
            class="border border-gray-400 w-full px-3 py-2 rounded-md 
            placeholder:text-gray-600 focus:outline-none focus:ring-2 
            focus:ring-gray-300 focus:shadow-lg focus:border-gray-500"
            placeholder="Add description 200 charaters max (optional)" />

          <div class="flex gap-2">
            <div class="relative" ref="refCourse">
              <button @click="openSelectCourse = true" class=" max-w-60 whitespace-nowrap bg-gray-100 hover:bg-gray-300 rounded-md">
                <span v-if="idxCourse !== -1" class="inline-flex items-center px-2 py-1 rounded-md gap-1 max-w-52">
                  <img :src=listCourse[idxCourse].url alt="avatar" class="h-8 w-8 rounded-full shrink-0">
                  <span class=" text-start  truncate text-sm">{{listCourse[idxCourse].name}}</span>
                </span>
                <span v-else class="inline-block px-3 py-2">Select Course <font-awesome icon="chevron-down"/></span>
              </button>
              
              <div v-if = openSelectCourse class="absolute max-h-60 overflow-y-auto overflow-x-hidden  left-0 translate-y-full bottom-0  rounded-2xl bg-white z-10 border">
                <span class="inline-block py-1 px-3 font-medium text-gray-700">All course</span>
                <button v-for="(course , idx) in listCourse" 
                @click="idxCourse = idx; openSelectCourse = false"
                class="flex p-1 items-center justify-start gap-2 truncate w-60 py-1 hover:bg-gray-200"
                :class="idx === idxCourse && 'bg-gray-200'"
                >
                  <img :src=course.url alt="avatar" class="h-8 w-8 rounded-full shrink-0">
                  <span class="text-start truncate text-sm">{{course.name}}</span>
                </button>
              </div>
              
            </div>
            
            <button 
            @click="openAddCouse = true"
              class="px-3 py-2 whitespace-nowrap bg-gray-100 hover:bg-gray-300 rounded-md">
              <font-awesome icon="plus" />
              Course
            </button>
          </div>
        </div>

        <RightPart 
        @sendAudioFile="audioFile=$event"
        @sendTextFile="textFile=$event"
        @sendInputText="inputText=$event"
        @send-youtube-url="youtubeUrl = $event"
        />
      </div>
    </div>

    <CreateCourse 
    v-show="openAddCouse"
    @sendDataCourse="addNewCouse"
    @close-box="openAddCouse = $event; idxCourse = 0"
    />
  </div>
</template>


<script setup>

import {ref, onMounted, onBeforeUnmount} from "vue"
import CreateCourse from "~/components/createLesson/CreateCourse.vue";
import LeftPart from "~/components/createLesson/LeftPart.vue";
import RightPart from "~/components/createLesson/RightPart.vue";
// const config = useRuntimeConfig()

const listCourse =ref( [
  {name: "Cafe avec Johan check truncate", url : "/images/avatar.jpg"},
  {name: "To fluency", url : "/images/avatar.jpg"},
  {name: "Steve Kaufman", url : "/images/avatar.jpg"},
  {name: "Vinh Giang", url : "/images/avatar.jpg"}
])

const get_list_courses = async () => {
  const result = await $fetch(`/api/get_list_courses/`, {
    method: "GET",
    credentials: 'include'
  })
  
  listCourse.value = result?.listCourse?? listCourse.value

  console.log('listCourse.value', listCourse.value)
}


const openAddCouse = ref(false)
const addNewCouse = (data) => {
  listCourse.value.unshift({
    name: data.courseName,
    url: data.pictureUrl || "/images/avatar.jpg"
  })
}

const loading = ref(false)
const youtubeUrl = ref("")

const idxCourse = ref(-1)
const openSelectCourse = ref(false)
const refCourse = ref(null)

const lessonName = ref("")
const lessonDescription = ref("")
const messageCreateLesson = ref("")
const createLessonSuccessfully = ref(false)

const pictureFile = ref(null)
const level = ref('')
const language = ref("")
const audioFile = ref(null)
const textFile = ref(null)
const inputText = ref("")

const course_name = ref('')
const lesson_name = ref('')
const router = useRouter()

const saveAndGenerate = async () => {


  messageCreateLesson.value = ''
  

  // create with youtube
  if (youtubeUrl.value.trim()) {
    loading.value = true

    // console.log('course_name', listCourse.value[idxCourse.value].name)
    try {
      const data = {
          "course_name": listCourse.value[idxCourse.value].name ?? 'default',
          "youtube_url": youtubeUrl.value.trim()
        }

      if (lessonName.value.trim()) {
        data.lesson_name = lessonName.value.trim()
      }
      const result = await $fetch(`/api/create_youtube_lesson/`, {
        method: 'POST', 
        body: data,
        credentials: "include"
      })

      course_name.value = result.course_name
      lesson_name.value = result.lesson_name
      messageCreateLesson.value = result?.message || "Create lesson successfully!"
      createLessonSuccessfully.value = true
    }
    catch (error) {
      messageCreateLesson.value = error?.data?.message || "Can't create lesson with this youtube url \nChoose one of two option: \n1. Change youtube url. \n2. Create lesson manually."
    }
    loading.value = false

    return
  }


  // check lesson name
  if (!lessonName.value.trim()) {
    messageCreateLesson.value = "Please give lesson a name"
    return
  }
  const formData = new FormData()

  // check existing text
  if (textFile.value) {
      formData.append("textfile", textFile.value)
  }
  else if (inputText.value.trim()) {
    formData.append('inputText', inputText.value.trim())
  }
  else {
    messageCreateLesson.value = 'Missing a text!'
    return
  }


  // create lesson manually
  formData.append("lesson_name", lessonName.value.trim() )
  formData.append(
    "course_name",
    idxCourse.value >= 0 ? listCourse.value[idxCourse.value].name : "default"
  )
  // formData.append('lesson_description', lessonDescription.value)
  formData.append("language", language.value)
  // formData.append('level', level.value)
  if (pictureFile.value) formData.append('picture', pictureFile.value)
  if (audioFile.value) formData.append('audiofile', audioFile.value)

  
  try {
    loading.value = true
    const result = await $fetch(`/api/create_lesson_manually/`, {
      method: 'POST',
      body: formData,
      credentials: "include"
    })

    course_name.value = result.course_name
    lesson_name.value = result.lesson_name
    messageCreateLesson.value = result?.message || "Create lesson successfully!"
    createLessonSuccessfully.value = true
  }

  catch (error) {
    console.error(error)
    messageCreateLesson.value = error?.data?.message || "Failed to generate new lesson"
  }

  loading.value = false

}

const openLesson = () => {
  router.push({
    path : '/ReaderMain',
    query : {
      lessonName : lesson_name.value,
      courseName: course_name.value
    }
  })
}

const toggleSaveOrOpen = () => {
  if (createLessonSuccessfully.value === true) {
    openLesson()
  }
  else {
    saveAndGenerate()
  }
}





const handleClickOutsides = (e) => {
  if (!refCourse.value || !refCourse.value.contains(e.target)) {
    openSelectCourse.value = false
  }
}

onMounted( async() => {
  await get_list_courses();
  window.addEventListener("click", handleClickOutsides)
})
onBeforeUnmount(() => window.removeEventListener("click", handleClickOutsides))


</script>