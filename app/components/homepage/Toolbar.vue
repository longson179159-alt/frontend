<template>

  <div class="px-3 py-5 md:px-[56px] bg-gray-50 flex gap-3 items-center flex-wrap">
    <button  @click="moveToOtherPage('library')" :class="['px-[14px] py-[6px] rounded-md text-center font-semibold', currentPage === 'library' ? 'bg-gray-200' : '']" >Library</button>
    <button  @click="moveToOtherPage('playlists')" :class="['px-[14px] py-[6px] rounded-md text-center font-semibold', currentPage === 'playlists' ? 'bg-gray-200' : '']">Playlists</button>
    <!-- nagvigate to Review page -->
    <NuxtLink  
    to="/ReviewVocabs"
    @click="moveToOtherPage('vocabulary')" 
    :class="['px-[14px] py-[6px] rounded-md text-center font-semibold', currentPage === 'vocabulary' ? 'bg-gray-200' : '']">
      Vocabulary
  </NuxtLink>
  </div>
  <div class="w-full pb-5 bg-gray-50 px-3 md:px-[56px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 lg:gap-3">
    <div class="border  rounded-lg border-gray-300 w-full  lg:w-[250px] flex inline-block">
      <input type="text" placeholder="Search Library" class="placeholder-black  p-2 flex-1 focus:outline-none  border border-transparent hover:border-gray-900 rounded-l-lg">
      <button class="border border-transparent  hover:border-gray-800 hover:text-lg rounded-r-lg flex w-10  items-center justify-center"><font-awesome icon="search" /></button>
    </div>

    <!-- SLIDER -->
    <div class="flex flex-col md:flex-row w-full px-2  lg:max-w-[430px] items-center gap-2 text-sm md:text-base font-medium ">
      <div class="flex justify-between w-full md:w-[120px] whitespace-nowrap  md:py-1">
        <span>{{ Levels[range[0] -1] }}</span>
        <span class="md:hidden">{{ Levels[range[1] -1] }}</span>
      </div>

      <div class=" w-full flex flex-col gap-10 relative group">
        <div class="w-full "><Slider v-model="range" :min="1" :max="6" :tooltips="false" :step="1" class="my-slider" /></div>

        <!-- hidden  group-hover:block hover:bg-gray-200  -->

        <div class="absolute hidden  group-hover:block w-full -translate-y-1/2 ">
          <div class="relative h-20   ">
            <!-- <div class="w-full h-1 bg-red-200"></div> -->
            <div v-for="i in 6">    
              <div class="absolute h-6 w-1 rounded-ms bg-gray-300 -translate-x-1/2 bottom-6" :style="{left: `${(i - 1) * 20}%`}"></div>
            </div>
          </div>
        </div>


      </div>

      <span class="hidden md:inline md:w-[120px] whitespace-nowrap  py-1">{{ Levels[range[1] -1] }}</span>
    </div>

    <div ref="importElement" class="relative  self-end lg:self-center ">
      <button @click="openImport=!openImport"  class="flex gap-2 border px-3 py-2  rounded-xl items-center justify-center w-36 text-white font-semibold text-lg bg-[#0B1B32] hover:bg-black">
        <img src="/icons/header/import.svg" alt="import icon"/>
        <span>Import</span>
        <font-awesome icon="chevron-down"/>
      </button>

      <div v-if="openImport" class="absolute whitespace-nowrap border bg-white font-normal z-10 shadow-md px-3 mt-0.5 py-2  w-44 top-full right-0 rounded-xl flex flex-col ">
        <nuxt-link to="/ImportLesson" class="flex justify-start items-center gap-4 hover:bg-gray-200 px-2 py-2">
          <img src="/icons/header/importLesson.svg" alt="ImportLesson" />
          <span class="text-black">Lesson</span>
        </nuxt-link>
        <a 
          href="https://chromewebstore.google.com/detail/langoda/kpblnhhcheigaooflkijekahfflpamaf"
          target="_blank"
          rel="noopener noreferrer"
          @click="openImport = false"
           class="flex justify-start items-center gap-4 hover:bg-gray-200 px-2 py-2">
          <img src="/icons/others/youtubeIcon.svg" alt="ImportVocabulary" />
          <span class="text-black">Youtube</span>
        </a>
        <button @click="OpenUpload('newword')" class="flex justify-start items-center gap-4 hover:bg-gray-200 px-2 py-2" >
          <img src="/icons/header/importVocabulary.svg" alt="ImportVocabulary" />
          <span class="text-black">Vocabulary</span>
        </button>
        <button @click="OpenUpload('text')" class="flex justify-start items-center gap-4 hover:bg-gray-200 px-2 py-2">
          <img src="/icons/header/importText.svg" alt="importText" />
          <span class="text-black">Ebook/File</span>
        </button>
        <button @click="OpenUpload('audio')" class="flex justify-start items-center gap-4 hover:bg-gray-200 px-2 py-2 ">
          <img src="/icons/header/importAudio.svg" alt="ImportAudio"  class="ml-1"/>
          <span class="text-black">Audio</span>
        </button>
      </div>

      <import-text v-if="uploadObject === 'text'" @send-message="uploadObject=$event"/>
      <import-audio v-if="uploadObject === 'audio'" @send-message="uploadObject=$event"/>
      <import-vocabulary v-if="uploadObject === 'newword' " @send-message="uploadObject=$event"/>
    </div>

   
  </div>
</template>

<script setup>
import { ref , onMounted, onBeforeMount} from 'vue'
import { useRouter } from 'vue-router'
import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'
import ImportText from './component/ImportText.vue'
import ImportAudio from './component/ImportAudio.vue'
import importVocabulary from './component/importVocabulary.vue'

const range = ref([3, 5])
const Levels = ["Beginner 1", "Beginner 2", "Intermediate 1", "Intermediate 2", "Advanced 1", "Advanced 2"]
const importElement = ref(null)
const currentPage = ref("library")


const moveToOtherPage = (pageName) => {
  currentPage.value = pageName
 
}

const openImport = ref(false)
const uploadObject = ref("")
const OpenUpload = (item) => {
    uploadObject.value = item
    openImport.value = false
}

const handleClickOutside = (e) => {
  if (importElement.value && !importElement.value.contains(e.target)) {
    openImport.value = false
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})


onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
})

</script>



<style>
/* Target the slider handle (the draggable circle) inside this component */
.my-slider .slider-handle {
  /* Make the handle have a black border (2px thickness) */
  border: 1px solid black !important;
  transition: transform 0.15s ease-in-out;
  /* smooth animation */
  /* Make the handle background white */
  background: rgb(245, 243, 243) !important;
  border: 2px solid black !important;
}

/* enlarge on hover */
.my-slider .slider-handle:hover {
  transform: scale(2);
  /* 25% bigger */
}

/* Target the "connected" filled part between the two handles */
.my-slider .slider-connect {
  /* Make the connecting bar black */
  background-color: rgb(24, 3, 3) !important;
}

/* Target the handle when it is focused (clicked or keyboard-selected) */
.my-slider .slider-handle:focus {
  /* Remove the default blue outline glow */
  box-shadow: none !important;
}



.my-slider {
  max-width: 100%;
  /* same as Tailwind's max-w-md */
  margin: 0 auto;
  /* center it */
}

@media (min-width : 1024px) {
  .my-slider {
    max-width: 330px;
  }
}
</style>