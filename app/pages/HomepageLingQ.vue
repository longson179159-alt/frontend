<template>
  <div class="h-screen overflow-y-auto" :class="showCourseInfos && 'no-scrollbar'">
    <div class="sticky top-0 bg-white z-20 " :class="showCourseInfos && 'bg-gray-300'">
      <header-ling-q :show-main="showMain" @sending-toggle="showMain = $event" />
      <div v-show="!(isMobile && !showMain)">
        <Toolbar />
      </div>

    </div>
    <div v-show="!(isMobile && !showMain)" class="">
      <ContinueStudying :new-lesson-data="newLessonData" @show-course-infos="showCourse" />
      <Contents v-for="(content, idx) in listContents" :key="idx" :content-name="content"
        @add-to-continuing="newLessonData = $event" @show-course-infos="showCourse" />
    </div>
  </div>

  <ShowCourse v-if="showCourseInfos" 
  @show-course-infos="showCourseInfos = false"
  :data-course="dataCourseCard"
  :data-lessons="dataLessonCards"
  />
</template>


<script setup>


import { useBreakpoints } from '@vueuse/core'

import HeaderLingQ from '~/components/homepage/HeaderLingQ.vue'
import Toolbar from '~/components/homepage/Toolbar.vue'
import ContinueStudying from '~/components/homepage/ContinueStudying.vue'
import Contents from '~/components/homepage/Contents.vue'
import ShowCourse from '~/components/homepage/ShowCourse.vue'
import { ref } from 'vue'
import { showCourseInfosRequest } from '~/services/homepage/homepageApi'
const config = useRuntimeConfig()
const showCourseInfos = ref(false)

const {
  dataLessonCardsDemo,
  dataCourseCardsDemo
} = useDataLessonCard()
const dataCourseCard = ref({})
const dataLessonCards = ref([])

const showCourse = async (courseName) => {
  try {
    const data = await showCourseInfosRequest({ courseName })
    // console.log('picture Course url', data?.dataCourseCard?.imgUrl?? 'There is no img url')

   
    dataCourseCard.value = data?.dataCourseCard ?? dataCourseCardsDemo[0]
    dataLessonCards.value = data?.dataLessonCards ?? dataLessonCardsDemo

    showCourseInfos.value = true
  }
  catch (error) {
    const errorMessage = error?.data?.message ?? "Can't get data for this course"
    alert(errorMessage)
  }
}




const breakpoints = useBreakpoints({
  md: 768
})
const listContents = ["Bussiness", "History", "Book", "Podcast", "Culture"]

const isMobile = breakpoints.smaller('md')

const showMain = ref(false)

const newLessonData = ref({})




</script>

<style scoped>
/* Hide scrollbar but keep scrolling */
.no-scrollbar {
  -ms-overflow-style: none;
  /* IE/Edge */
  scrollbar-width: none;
  /* Firefox */
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
  /* Chrome/Safari */
}
</style>
