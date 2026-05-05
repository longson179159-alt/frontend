<template>
  <div class="relative h-16 border shadow-md flex ">
  

    <div class="flex items-center px-2">
      <button @click="handleToggleLeftSide" class="md:hidden">
        <font-awesome :icon="isOpen? 'times' : 'bars'" class="h-5 w-5"/>
      </button>

      <div class="hidden md:flex items-center font-semibold">
        <img src="/icons/header/lingicon.svg" alt="Linglogo" class="h-8 w-8 mr-2" />
        <NuxtLink class="hover:bg-gray-200 h-16 inline-flex justify-center items-center px-1  border-t-4 border-black">Lesson</NuxtLink>
        <NuxtLink class="hover:bg-gray-200 h-16 inline-flex justify-center items-center px-1 border-t-4 border-transparent" >Tutors</NuxtLink>
        <NuxtLink class="hover:bg-gray-200 h-16 inline-flex justify-center items-center px-1 border-t-4 border-transparent">Community</NuxtLink>
      </div>
    </div>
    <RightSide 
    class="ml-auto px-2 z-10 self-center"
  
    />


    <div  v-if="isOpen" class="absolute w-full top-full mt-2  text-lg gap-1 md:hidden">
      <NuxtLink to="" class="w-full inline-flex hover:bg-gray-200 gap-2 px-2 py-3 h-12 items-center">
        <img src="/icons/header/notifications.svg" alt="notifications" class="h-4 w-4 "/>
        <span>Notifications</span>
      </NuxtLink>
      <NuxtLink to="" class="w-full inline-flex hover:bg-gray-200 gap-2 px-2 py-3 h-12 items-center">
        <img src="/icons/header/settings.svg" alt="settings" class="h-4 w-4 "/>
        <span>Settings</span>
      </NuxtLink>
      <NuxtLink to="" class="w-full inline-flex hover:bg-gray-200 gap-2 px-2 py-3 h-12 items-center">
        <img src="/icons/header/contact.svg" alt="contact" />
        <span>Contact</span>
      </NuxtLink>
      <NuxtLink @click="logout" class="w-full inline-flex hover:bg-gray-200 gap-2 px-2 py-3 h-12 items-center">
        <img src="/icons/header/logout.svg" alt="logout" class="h-4 w-4 ml-0.5"/>
        <span>Log out</span>
      </NuxtLink>

      <span class="block text-center ">GET THE MOBILE APP</span>

      <div class="flex justify-center items-center flex-col">
        <img src="/images/ios.svg" alt="ios" class="w-56">
        <img src="/images/android.svg" alt="android" class="w-56">
      </div>
      
    </div>
  </div>
</template>

<script setup>
import RightSide from "./component/RightSide.vue"
import {ref} from "vue"


const emit = defineEmits(['sending-toggle'])

const props = defineProps({
  showMain : Boolean,
 
})
const isOpen = ref(!props.showMain)

const handleToggleLeftSide = () => {
  isOpen.value = !isOpen.value
  emit('sending-toggle', !isOpen.value)
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
</script>
