<template>
  <div class="  flex items-center justify-center">
      <div class="relative flex w-80 ">
        <div class="grid grid-cols-2 w-full gap-2">
         <!-- course visible part  -->
          <div ref="courseVisible" class="flex flex-col  ">
            <span class="font-semibold text-lg ">Courses</span>
            
            <button @click="openToggleCourse = !openToggleCourse" 
            class="flex items-center text-sm justify-between px-3 py-2 border rounded-lg"
            :class="isCourseDisabled && 'cursor-not-allowed bg-gray-100 text-gray-400'"
            > 
              <span class="truncate">{{ currentCourseName }}</span> 
              <font-awesome icon="chevron-down" /></button>
          </div>

          <!-- lesson visiable part -->
          <div ref="lessonVisible" class="flex flex-col">
            <span class="font-semibold text-lg">Lessons</span>
            <button @click="openToggleLesson = !openToggleLesson" 
            class="flex items-center text-sm justify-between px-3 py-2 border rounded-lg"
            :class="isLessonDisabled ? 'cursor-not-allowed bg-gray-100 text-gray-400' : ''">
              <span class="truncate">{{ currentLessonName }}</span>
              <font-awesome icon="chevron-down" />
            </button>
          </div>
        </div>

        <!-- Popup Course UI -->
        <div ref="coursePopup" v-if="openToggleCourse" class="absolute flex flex-col top-full left-0 w-full max-h-60   z-10">
          
          <input v-model="searchCourse" @keydown.enter="handleSearchCourse" 
          class="border my-1 px-3 py-1 rounded-lg outline-none hover:border-gray-400 focus:border-gray-800 focus:ring-1 focus:ring-gray-400 focus:shadow-md" 
          placeholder="Search courses"/>
          <div class="border rounded-lg bg-white shadow-md overflow-auto">
            <button
              v-for="course, idx in listCourseNames"
              v-show="includesearchCourse(course)"
              @click="currentCourseName = course; courseIdx = idx; lessonIdx = 0; openToggleCourse = false; searchCourse = ''; currentLessonName = 'All'"
              :key="course"
              :class="['w-full flex  items-center justify-start px-3 py-1 inline-block hover:bg-gray-200', currentCourseName === course ? 'bg-gray-200 font-medium' : '']"
            >
              <img class="inline-block mr-2" src="/icons/others/course.svg" alt="course">
              <span class="inline-block text-left text-sm">{{ course }}</span>
            </button>
          </div >
        </div>

        <!-- Popup Lesson UI -->
        <div ref="lessonPopup" v-if="openToggleLesson" class="absolute flex flex-col top-full left-0 w-full max-h-60   z-10">
          
          <input v-model="searchLesson" @keydown.enter="handleSearchLesson" class="border my-1 px-3 py-1 rounded-lg outline-none hover:border-gray-400 focus:border-gray-800 focus:ring-1 focus:ring-gray-400 focus:shadow-md" 
          placeholder="Search lessons"/>
          <div class="border rounded-lg bg-white shadow-md overflow-auto">
            <button
              v-for="lesson, idx in listLessonNames"
              v-show="includeSearchLesson(lesson)"
              @click="currentLessonName = lesson; lessonIdx = idx; openToggleLesson = false; searchLesson = ''"
              :key="lesson"
              :class="['w-full flex  items-center justify-start px-3 py-1 inline-block hover:bg-gray-200', currentLessonName === lesson ? 'bg-gray-200 font-medium' : '']"
            >
              <img class="inline-block mr-2" src="/icons/others/lesson.svg" alt="lesson">
              <span class="inline-block text-left text-sm">{{ lesson }}</span>
            </button>
          </div >
        </div>
      </div>

      


  </div>
</template>


<script setup>


import {ref, computed, onMounted, onBeforeUnmount, watch} from 'vue'


const demoData = {
  "English Beginner Course": [
    "Introduction to English",
    "Daily Conversations",
    "Travel Vocabulary",
    "Ordering Food",
    "At the Airport",
    "Shopping Basics",
    "Making Friends",
    "Work and Career",
    "Health and Fitness",
    "Technology Today"
  ],
  "English Intermediate Conversation and Reading Mastery Course": [
    "Introduction to English",
    "Daily Conversations",
    "Travel Vocabulary",
    "Ordering Food",
    "At the Airport",],
  "French for Travelers, Everyday Real-Life Communication, and Practical Speaking Mastery Course": [
    "Introduction to English",
    "Daily Conversations",
    "Travel Vocabulary",
    "Ordering Food",
    "At the Airport",
    "Shopping Basics",
    "Making Friends",]
}

const props = defineProps({
  lessonNameRoute: {
    type: String,
    default: ''
  },
  courseNameRoute: {
    type: String,
    default: ''
  }
})

const currentCourseName = ref('All')
const currentLessonName = ref('All')

const dataBackend = ref({})
const visibleData = ref({})
// in the case user have course and lesson named "All"
const lessonIdx = ref(0)
const courseIdx = ref(0)

const refreshCourseAndLesson = (dataBackend, lessonNameRoute, courseNameRoute) => {
    if (!courseNameRoute) {
      visibleData.value = dataBackend.value
       currentCourseName.value = 'All'
      currentLessonName.value = 'All'
      courseIdx.value = 0
      lessonIdx.value = 0
      return
    }

    currentCourseName.value = courseNameRoute
    courseIdx.value = 1
    if (Object.keys(dataBackend.value).includes(courseNameRoute)) {
        
        
      if (dataBackend.value[courseNameRoute].includes(lessonNameRoute)) {
        lessonIdx.value = 1
        currentLessonName.value = lessonNameRoute
        visibleData.value = dataBackend.value
      }

      else {
        visibleData.value = dataBackend.value
        if(!lessonNameRoute) {  
          currentLessonName.value = 'All'
          lessonIdx.value = 0          
          return
        }
        dataBackend.value[courseNameRoute].unshift(lessonNameRoute)
        currentLessonName.value = lessonNameRoute
        lessonIdx.value = 1

      }
    }

    else {
        visibleData.value = dataBackend.value
        if(!lessonNameRoute) {   
          currentLessonName.value = 'All'
            lessonIdx.value = 0         
          return
        }
        dataBackend.value[courseNameRoute] = [lessonNameRoute]
        currentLessonName.value = lessonNameRoute
        lessonIdx.value = 1
        
    }
}


const getDataBackend = async () => {
  try {
    const response = await fetch(`/api/Review/getCoursesAndLessons`)
    const data = await response.json()
    dataBackend.value = data ?? demoData
    console.log('Fetched backend data:', dataBackend.value)
    refreshCourseAndLesson(dataBackend, props.lessonNameRoute, props.courseNameRoute)
  } catch (error) {
    dataBackend.value = demoData
    refreshCourseAndLesson(dataBackend, props.lessonNameRoute, props.courseNameRoute)
    // console.error('Error fetching backend data:', error)
  }

  console.log('Current backend data:', dataBackend.value)
}

const listCourseNames = computed(() => [
  "All", 
  ...Object.keys(dataBackend.value ?? {})
])
// COURSE PART
const isCourseDisabled = computed(() => {
  return listCourseNames.value.length <= 1 || dataBackend.value === null
})
const courseVisible = ref(null)
const coursePopup = ref(null)
const openToggleCourse = ref(false)

const searchCourse = ref('')
const includesearchCourse = (course) => {
  if (course === 'All') return true
  return course.toLowerCase().includes(searchCourse.value.trim().toLowerCase())
}

const handleSearchCourse = () => {

  const matchedIdx = listCourseNames.value.findIndex(course => course.toLowerCase().includes(searchCourse.value.trim().toLowerCase()))

  currentCourseName.value = matchedIdx === -1 ? 'All' : listCourseNames.value[matchedIdx]
  courseIdx.value = matchedIdx === -1 ? 0 : matchedIdx

  openToggleCourse.value = false
  searchCourse.value = ''
  currentLessonName.value = 'All'
  lessonIdx.value = 0
}

// LESSON PARTS
const isLessonDisabled = computed(() => {
  return currentCourseName.value === 'All'
})
const lessonVisible = ref(null)
const lessonPopup = ref(null)

const listLessonNames = computed(() => {
  if (currentCourseName.value === 'All') {
    return ['All']
  }

  const lessons = dataBackend.value[currentCourseName.value] ?? []
  return ['All', ...lessons]
})

const openToggleLesson = ref(false)
const searchLesson = ref('')
const includeSearchLesson = (lesson) => {
  if (lesson === 'All') return true
  return lesson.toLowerCase().includes(searchLesson.value.trim().toLowerCase())
}

const handleSearchLesson = () => {
  const matchedIdx = listLessonNames.value.findIndex(lesson => lesson.toLowerCase().includes(searchLesson.value.trim().toLowerCase()))
  currentLessonName.value = matchedIdx === -1 ? 'All' : listLessonNames.value[matchedIdx]
  lessonIdx.value = matchedIdx === -1 ? 0 : matchedIdx
  openToggleLesson.value = false
  searchLesson.value = ''
}

const handleClickOutside = (event) => {
  if ((courseVisible.value && !courseVisible.value.contains(event.target)) && (coursePopup.value && !coursePopup.value.contains(event.target))) {
    openToggleCourse.value = false
  }


  if ((lessonVisible.value && !lessonVisible.value.contains(event.target)) && (lessonPopup.value && !lessonPopup.value.contains(event.target))) {
    openToggleLesson.value = false
  }
}
const emit = defineEmits(['selectionChanged','ready'])
watch([currentCourseName, currentLessonName, courseIdx, lessonIdx], ([newCourse, newLesson]) => {
  console.log('Selected Course:', newCourse)
  console.log('Selected Lesson:', newLesson)
  emit('selectionChanged', { courseName: currentCourseName.value, lessonName: currentLessonName.value, courseIdx: courseIdx.value, lessonIdx: lessonIdx.value })
})



onMounted(async() => {
   await getDataBackend()
   emit('selectionChanged', { courseName: currentCourseName.value, lessonName: currentLessonName.value, courseIdx: courseIdx.value, lessonIdx: lessonIdx.value })
   emit('ready')
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

</script>