<template>
    <div class="min-h-screen bg-gray-50 py-10">
        <div class=" max-w-6xl rounded-2xl border  shadow-lg px-8 py-5 mx-auto  flex flex-col gap-6 ">
            <NuxtLink to="/HomepageLingQ" class="inline-flex self-start justify-start items-center text-gray-600 font-medium hover:text-black hover:bg-gray-200 px-3 py-1 text-center rounded-md"> <font-awesome icon="chevron-left" /> Back
            Homepage</NuxtLink>
            
            <div class="flex flex-col items-center gap-2">
                <span  class="text-2xl font-bold text-gray-600 text-center">ÔN TẬP TỪ MỚI</span>
                <span class="text-gray-500 text-center text-sm">(Thời điểm tốt nhất để học từ mới là trước và sau mỗi bài học!)</span>
        
            </div>
            <!-- Words, Phrases, Courses, Lessons -->
            <div class="flex flex-col items-center gap-5 md:flex-row md:justify-between">
                <div class="flex gap-2 md:self-end ">
                    <button @click="changeData('words')" 
                    class="px-6 py-2 transition h-10 border border-b-2 rounded-t-lg text-lg hover:bg-gray-200"
                    
                    :class="toggleType === 'words' ? 'border-blue-600 text-blue-600 font-semibold': 'border-transparent text-gray-500 bg-gray-200 hover:text-black'">
                        Words
                    </button>
                    <button @click="changeData('phrases')" 
                    class="px-6 py-2 transition h-10 border border-b-2 rounded-t-lg text-lg hover:bg-gray-200"
                    :class="toggleType === 'phrases' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-gray-500 bg-gray-200 hover:text-black'">Phrases</button>
                </div>
                <!-- Courses, Lessons; -->
                <CourseAndLesson 
                @selectionChanged="handleSelectionChanged"
                @ready="currentPage = 1; getDataBackend()"
                :lessonNameRoute="lessonNameRoute"
                :courseNameRoute="courseNameRoute"
                />
            </div>
    
            <div class="bg-white p-4 rounded-xl border shadow-md">
                <span class="font-semibold text-gray-700">Filter</span>   
                <div class="flex gap-4 mt-2 flex-wrap">
                    <label v-for="statusOption in listStatusOptions" :key="statusOption.value">
                        <input type="checkbox" :value="statusOption.value" v-model="selectedStatuses" class="accent-black"> {{ statusOption.label }}
                    </label>
                </div>
            </div>
    
            <div class="bg-white p-4 rounded-xl border shadow-md">
                <span class="font-semibold text-gray-700">Sort by</span>
                <div class="mt-2 flex gap-4 flex-wrap">
                    <label v-for="option in sortOptions" :key="option.value">
                        <input type="radio" :value="option.value" v-model="selectSortOption" class="accent-black"> {{ option.label }}
                    </label>
                </div>
            </div>
    
    
            <div class="flex justify-between items-center">
                <div  class="flex ">
                    <button v-if="showUpdateButton" @click=" currentPage = 1; getDataBackend()" 
                    class=" px-6 py-2 bg-[#0B1B32] border text-white hover:bg-black transition rounded-lg">{{ isLoading ? 'Loading...' : 'Apply Filters' }}</button>
                </div>
    
                <div  class="self-end flex items-center  gap-1">
                    <div class="relative" ref="dropdownRef">
                        <button @click="openPageSizeDropdown = !openPageSizeDropdown" class="border boder-gray-300 w-32 py-2 rounded-lg shadow-md bg-gray-200 hover:bg-gray-300 font-medium">Show {{pageSize}} <font-awesome icon='chevron-down' class="text-sm"/></button>
                        <div v-if="openPageSizeDropdown" class="absolute overflow-hidden top-full right-0 translate-y-2 w-40 flex flex-col boder  rounded-md bg-white shadow-md z-10">
                            <button v-for="size in listPageSizes" :key="size" @click="currentPage = 1; pageSize = size; openPageSizeDropdown = false; getDataBackend()" class="text-start italic font-medium text-gray-600 px-3 py-2 hover:bg-gray-200">{{ size }} items</button>
                        </div>
                    </div>
                    
                    <button type="button" @click="prevPage" @keydown.enter.prevent @keyup.enter.prevent :disabled="hasPreviousPage  === false" class='p-1 rounded-md hover:bg-gray-200'><font-awesome icon='chevron-left' class="text-blue-500"/></button>
                        <span class="bg-[#0B1B32] h-8 hover:bg-black text-white px-3 py-1 rounded-lg">{{ currentPage }}/{{ totalPages }}</span>
                    <button type="button" @click="nextPage" @keydown.enter.prevent @keyup.enter.prevent :disabled="hasNextPage === false" class='p-1 rounded-md hover:bg-gray-200'><font-awesome icon='chevron-right' class="text-blue-500"/></button>
                </div>
            </div>
    
            <div v-if="isLoading === false && listVisibleData.length > 0" v-for="(item, index) in listVisibleData"  :key="item.word" class="border border-gray-600 rounded-lg  p-5 flex flex-col md:flex-row gap-3   items-center justify-between">
                <span class="font-medium text-lg w-40 text-center md:text-start">{{ item.word }}</span>
                
                <button @click="speakEnglish(item.word)"><img src='/icons/reader/volume.svg' alt='volume'/></button>
                <button @click="showWordMeaning(index)"  :class="[item.showMeaning? '' : 'italic underline' , 'text-blue-600 mb-3']">{{ item.showMeaning? item.meaning : 'Show meaning'  }}</button>
            
                <div class="flex  gap-3 w-full md:w-auto justify-between">
                    <button @click="changeStatus(index, 0)" class="h-10 w-10 rounded-full border border-gray-300 hover:bg-red-100 flex items-center justify-center" :class="[item.status === 0 && 'bg-red-100']"><img src="/icons/reader/trash.svg" alt="trash"/></button>
                    <button @click="changeStatus(index, 1)" class="h-10 w-10 rounded-full border border-gray-300 hover:bg-yellow-300 flex items-center justify-center" :class="[item.status === 1 && 'bg-yellow-300']">1</button>
                    <button @click="changeStatus(index, 2)" class="h-10 w-10 rounded-full border border-gray-300 hover:bg-yellow-200 flex items-center justify-center" :class="[item.status === 2 && 'bg-yellow-200']">2</button>
                    <button @click="changeStatus(index, 3)" class="h-10 w-10 rounded-full border border-gray-300 hover:bg-yellow-100 flex items-center justify-center" :class="[item.status === 3 && 'bg-yellow-100']">3</button>
                    <button @click="changeStatus(index, 4)" class="h-10 w-10 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center" :class="[item.status === 4 && 'bg-gray-300']">4</button>
                    <button @click="changeStatus(index, 5)" class="h-10 w-10 rounded-full border border-gray-300 hover:bg-green-100 flex items-center justify-center" :class="[item.status === 5 && 'bg-green-100']"><font-awesome icon='check' class="text-green-500"/></button>
                </div>
            </div>

            <div v-if="isLoading === false && listVisibleData.length ===0" class="flex items-center justify-center py-20 text-red-500 font-medium text-lg">
                <div>No data available</div>
            </div>
           
            <div v-if="isLoading === false && listVisibleData.length === pageSize" class="self-end flex items-center  h-8 gap-1">
                     <button type="button" @click="prevPage" @keydown.enter.prevent @keyup.enter.prevent :disabled="hasPreviousPage  === false" class='p-1 rounded-md hover:bg-gray-200'><font-awesome icon='chevron-left' class="text-blue-500"/></button>
                        <span class="bg-[#0B1B32] h-8 hover:bg-black text-white px-3 py-1 rounded-lg">{{ currentPage }}/{{ totalPages }}</span>
                    <button type="button" @click="nextPage" @keydown.enter.prevent @keyup.enter.prevent :disabled="hasNextPage === false" class='p-1 rounded-md hover:bg-gray-200'><font-awesome icon='chevron-right' class="text-blue-500"/></button>
                </div>
            </div>
    </div>
</template>

<script setup>

import {ref,watch, onMounted, computed, onBeforeUnmount} from 'vue'
import {useRoute} from 'vue-router'
import CourseAndLesson from '~/components/ReviewPage/CourseAndLesson.vue'

const {speakEnglish} = useGooleTranslate();
const route  = useRoute()

const lessonName = ref('')
const courseName = ref('')
const getALLCourseData = ref(false)
const getALLLessonData = ref(false)

const lessonNameRoute = computed(() => route.query.lessonName || '')
const courseNameRoute = computed(() => route.query.courseName || '')

const handleSelectionChanged = (data) => {
    courseName.value = data.courseName
    lessonName.value = data.lessonName
    getALLCourseData.value = data.courseIdx === 0 // if courseIdx is 0, means select "All" course, then set getALLCourseData to true to get all course data
    getALLLessonData.value = data.lessonIdx === 0 // if lessonIdx is 0
  
}


const listStatusOptions = [
  { value: 1, label: '1 - New' },
  { value: 2, label: "2 - Can't Remember" },
  { value: 3, label: '3 - Not Sure' },
  { value: 4, label: '4 - Learned' },
  { value: 5, label: '√ - Known words' }
]  

const sortOptions = [
    { value: 1, label: 'A-Z' },
    { value: 2, label: 'Z-A' },
    { value: 3, label: 'Creation date' },
]

const dropdownRef = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)
const listPageSizes = [25, 50, 75, 100]
const openPageSizeDropdown = ref(false)
const pageSize = ref(25)

const hasPreviousPage = ref(false)
const hasNextPage = ref(false)
const isLoading = ref(false)


const listVisibleData = ref([]) // default show words data, when toggle to phrases, will set listVisibleData to listPhrasesData

const showWordMeaning = (index) => {
    listVisibleData.value[index].showMeaning = !listVisibleData.value[index].showMeaning
}


const showUpdateButton = ref(false)
const selectedStatuses = ref([1,2,3]) // default show all words with status 1-3 (exclude 0 - deleted)
const selectSortOption = ref(1)
const toggleType = ref('words') // default show words, other option is 'phrases'


import debounce from 'lodash/debounce'




const getDataBackend = async () => {
    isLoading.value = true
    try {
        const data = await $fetch(`/api/get_list_words/`, {
            method: "GET",
            query: {
                type: toggleType.value,
                statuses: selectedStatuses.value,
                selectSortOption: selectSortOption.value,
                pageSize: pageSize.value,
                currentPage: currentPage.value,
                lessonName: lessonName.value,
                courseName: courseName.value,
                getALLCourseData: getALLCourseData.value,
                getALLLessonData: getALLLessonData.value
            },
            credentials: 'include'})
            

            if (toggleType.value === 'words') {
                listVisibleData.value = data.listWordsData ?? []
            }
            else {
                listVisibleData.value = data.listPhrasesData ?? []
            }
            
            totalPages.value = data?.totalPages ?? 1
            hasPreviousPage.value = data?.hasPreviousPage ?? false
            hasNextPage.value = data?.hasNextPage ?? false
        }
    catch(error) {
        console.log('error with get list words data', error)
    }

    finally {
        // setitmeout to delay 1s before set isLoading to false to avoid loading too fast and make user can't see the loading state
        // setTimeout(() => {
        //     isLoading.value = false
        // }, 1000)
        isLoading.value = false
        showUpdateButton.value = false
    }

}

const prevPage = () => {
  if (!hasPreviousPage.value) return
  currentPage.value--
  getDataBackend()
}

const nextPage = () => {
  if (!hasNextPage.value) return
  currentPage.value++
  getDataBackend()
}

const syncPhrase = debounce(async(playLoad) => {
    try {
        await $fetch(`/api/update_word/`, {
            method: "PUT",
            body: playLoad,
             credentials: "include"
        })
    }

    catch(error) {
        console.log('error with update currentphrase data', error)
    }
}, 500) 


const changeStatus = async (index, status) => {

    const playLoad = {
        phrase: listVisibleData.value[index].word,
        status: status,
        changes :['status']
    }

    syncPhrase(playLoad)
    

    listVisibleData.value[index].status = status
    if (status === 0) {
        // delete item index k from listVisibleData.value
        listVisibleData.value.splice(index, 1)
    }
}

const changeData = (type) => {
    toggleType.value = type
    currentPage.value = 1
    getDataBackend()

}

watch([selectSortOption, selectedStatuses, lessonName, courseName, toggleType], () => {
    showUpdateButton.value = true
})

const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        openPageSizeDropdown.value = false
    }
}


onMounted( async() => {
  
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})


</script>

