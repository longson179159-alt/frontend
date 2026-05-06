<template>
   <!-- <div class=" flex  gap-2  max-w-md ml-auto"></div> -->
  <div class=" flex gap-2 ">

    <!-- progress goal -->
     <div ref="ProgressRef" class="relative hidden md:block md:whitespace-nowrap md:shrink-0" v-if="props.showPropgress && !isLoadingProgress">
       <button 
      @click="openGoalprogress  = !openGoalprogress;"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
      class="group h-10  flex gap-1 items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full px-1 "
      :class="!openGoalprogress && 'hover:bg-gray-300'"
      >
        <img src="/icons/header/flame.svg" alt="flame" class="">
        <div class="relative h-10 w-10 rounded-full flex items-center justify-center">
          <img src="/icons/reader/coins.svg" alt="coins" class="h-6">
          <div class="absolute inset-0 rounded-full [mask:radial-gradient(farthest-side,transparent_70%,black_71%)]"
         :style="{ background: `conic-gradient(#eab308 ${progressData[0]?.progressTotalPercent}%, ${hovered ? '#9ca3af' : '#d1d5db'} 0 )`}"
          >
            
          </div>

        </div>

        <span class="font-medium text-lg ml-1">{{`${progressData[0]?.progress}/${progressData[0]?.goal}`}}<font-awesome icon="chevron-down"/></span>
        
        </button>

      <div v-if="openGoalprogress "
       class="absolute whitespace-nowrap shrink-0 right-0  p-5 bg-white border border-gray-300 shadow-md rounded-2xl
        mt-3 w-80 z-10  flex flex-col gap-3">
       
      
        <div v-for="item in progressData" :key="item.name">
          <!-- known Words -->
          <span class="text-lg font-medium">{{ item.name }}</span >
          <div class="flex mb-1 justify-between">
            <span>{{ item.knownWords}} / {{ item.goalKnown }} Known words </span>
            <span class="font-medium" :class=" item.progressKnownWordsPercent   < 50 ? 'text-red-600': item.progressKnownWordsPercent  < 100 ? 'text-yellow-600': 'text-green-600'">{{ item.progressKnownWordsPercent   < 50 ? 'Attention': item.progressKnownWordsPercent  < 100 ? 'Ok': 'Good' }}</span>
          </div>
          <div class="h-1 w-full bg-gray-300 rounded-full">
            <div :class="`bg-${item.colorKnownWordsProgress}`" class="h-1 rounded" :style="{width: item.progressKnownWordsPercent + '%'}"></div>
          </div>

          <!-- lingQ create -->
          <div class="flex justify-between">
            <span>{{ item.lingqCreated}} / {{ item.goalLingqCreated }} LingQs created </span>
            <span class="font-medium" :class=" item.progressLingqCreatedPercent   < 50 ? 'text-red-600': item.progressLingqCreatedPercent  < 100 ? 'text-yellow-500': 'text-green-600'">{{ item.progressLingqCreatedPercent < 50? 'Attention': item.progressLingqCreatedPercent < 100 ? 'Ok': 'Good' }}</span>
          </div>
          <div class="h-1 w-full bg-gray-300 rounded-full">
            <div :class="`bg-${item.colorLingqCreatedProgress}`" class="h-1 rounded" :style="{width: item.progressLingqCreatedPercent + '%'}"></div>
          </div>
        </div>
    
      </div>
     </div>
    <!-- Choosing languages button -->
    <div ref="dropdownLangeRef"  class="relative ">
      <button @click="handletoggle('languages')" class="h-10 rounded-full flex items-center justify-center font-bold bg-gray-200 hover:bg-gray-300 gap-0.5">
        <img src="/images/England.png" alt="England flag" class="h-10 w-10 rounded-full">
        <span>2000</span>
        <font-awesome icon="chevron-down"/>
      </button>

      <div v-if="openLanguages" class="absolute right-0 bg-white border rounded-2xl mt-3 w-72  text-sm px-2 py-1 flex flex-col gap-1 font-medium">
        <NuxtLink to="/" class="flex justify-between hover:bg-gray-200 py-2 px-1 rounded-lg">
          <div class="inline-flex gap-2">
            <img src="/images/China.png" alt="China flag" class="h-5 w-5 rounded-full"/>
            <span>Chinese</span>
          </div>
          <span >(7340)</span>
        </NuxtLink>
        <NuxtLink to="/" class="flex justify-between hover:bg-gray-200 py-2 px-1 rounded-lg">
          <div class="inline-flex gap-2">
            <img src="/images/France.png" alt="French flag" class="h-5 w-5 rounded-full"/>
            <span>France</span>
          </div>
          <span >(4000)</span>
        </NuxtLink>

        <div class="h-0.5 w-full bg-gray-200"></div>

        <button class="py-3 w-full flex justify-start items-center ">
          <div class="w-full flex hover:bg-gray-200 py-2 px-1 rounded-lg ">
            <font-awesome icon="plus" class="ml-3"/>
            <span class="ml-12">Add a new language</span>
          </div>
        </button>
      </div>
    </div>

    <!-- profile and settings button -->
    <div ref="dropdownSettingsRef"  class="relative">
      <button @click="handletoggle('settings')" class="h-10 w-16 bg-gray-200 hover:bg-gray-300 flex rounded-full flex items-center gap-1">
        <div class="h-10 w-10 rounded-full relative">
          <img src="/images/avatar.jpg" alt="avatar" class="h-10 w-10 rounded-full">
          <div class="absolute bg-red-600 h-4 w-4 rounded-full -top-0.5 right-0 flex items-center justify-center text-xs text-white">90</div>
        </div>
        <font-awesome icon="chevron-down"/>
      </button>
      <!-- drop down of settings part -->
      <div v-if="openSetting" class="absolute bg-white border rounded-2xl mt-3 w-48  right-0 text-sm px-2 py-3 flex flex-col gap-2 font-medium">

        <button class="flex w-full px-2 py-4 rounded-lg h-5 hover:bg-gray-200 items-center justify-between">
          <span class="inline-flex gap-2 items-center">
            <img src="/icons/header/notifications.svg" alt="notificaitons" class="h-4"/>
            <span>Notificaitons</span>
          </span>
          <span>90</span>
        </button>

        <!-- make it pointer like a button -->
        <NuxtLink to="" class="cursor-pointer flex w-full px-2 py-4 rounded-lg justify-start h-5 items-center gap-2 hover:bg-gray-200">
           <img src="/icons/header/settings.svg" alt="settings" class="h-4"/>
           <span>Settings</span>
        </NuxtLink>

        <button @click="logout" class="flex w-full px-2 py-4 rounded-lg justify-start h-5 items-center gap-2 hover:bg-gray-200">
           <img src="/icons/header/logout.svg" alt="notificaitons" class="h-4"/>
           <span>Log out</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>

import {ref, computed,  onMounted,  onBeforeUnmount} from "vue"
const dropdownLangeRef = ref(null)
const dropdownSettingsRef = ref(null)
const ProgressRef = ref(null)
const isLoadingProgress = ref(true)

const openGoalprogress = ref(false)
const openSetting = ref(false)
const openLanguages = ref(false)

const hovered = ref(false)

const props = defineProps({
  showPropgress: {type: Boolean, default: true}
})



const coreData = ref([])
const progressData = ref([])

const getBackEndData = async() => {
  if (!props.showPropgress) return
  let dataBackend = null
  try {
   
    dataBackend = await $fetch(`/api/get_progress_data/`, {
    method: "GET",
    credentials: 'include'
    })

  
  }
  
  catch (error) {
    const messageErr = error?.data?.message || 'Fail to get progress data'
    // alert(messageErr)
  }

  coreData.value = dataBackend || []



  progressData.value = coreData.value.map(
    item => {
      const goalLingqCreated = Math.round(item.goal / 3 )
      const goalKnown = Math.round(item.goal /3)
      const progress = item.lingqCreated + item.knownWords * 2
      const progressTotalPercent = Math.min((progress / item.goal) * 100, 100)
      
      const progressLingqCreatedPercent = Math.min((item.lingqCreated / goalLingqCreated) * 100, 100)
      const progressKnownWordsPercent = Math.min((item.knownWords / goalKnown) * 100, 100)
      const colorLingqCreatedProgress = progressLingqCreatedPercent < 50 ? 'red-400': progressLingqCreatedPercent < 100 ? 'yellow-400' : 'green-400'
      const colorKnownWordsProgress = progressKnownWordsPercent < 50 ? 'red-400': progressKnownWordsPercent < 100 ? 'yellow-400' : 'green-400'
      return {
        ...item,
        goalLingqCreated, 
        goalKnown,
        progress, 
        progressTotalPercent,
        progressLingqCreatedPercent, 
        progressKnownWordsPercent,
        colorKnownWordsProgress, 
        colorLingqCreatedProgress
      }
    }

)

    isLoadingProgress.value = false

}




const handletoggle = (toggle_kind) => {
  if (toggle_kind === 'settings') {
    openLanguages.value = false
    openSetting.value = !openSetting.value
    // console.log("openSetting ", openSetting.value)
  }

  if (toggle_kind === "languages") {
    openSetting.value = false
    openLanguages.value = !openLanguages.value
    // console.log("languages ", openLanguages.value)
  }
}


// ⬇️ Close when clicking outside
const handleClickOutside = (e) => {
  if (ProgressRef.value && !ProgressRef.value.contains(e.target)) {
    openGoalprogress.value = false
  }

  if (dropdownLangeRef.value && !dropdownLangeRef.value.contains(e.target)) {
    openLanguages.value = false
  }
  if (dropdownSettingsRef.value && !dropdownSettingsRef.value.contains(e.target)) {
    openSetting.value = false
  }
}


const router = useRouter();
const {getCsrfToken} = useCsrf();
const logout = async () => {
  try {
    const response  = await fetch(`/api/logout/`, {
      method: "POST",
      credentials: "include",
      headers: {
                'X-CSRFToken': getCsrfToken()
            }
    })

    if (response.ok) {
      console.log('Logout successful');
      router.push('/login')
    } else {
      const data = await response.json()
      const message = data?.message || 'Failed to logout'
      console.log('message', message)
    }
  }

  catch (error) {
      const message = error?.data?.message || 'Failed to logout'
      console.log('message', message)
  }
}


onMounted( async () => {
  await getBackEndData()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
