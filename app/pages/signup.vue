<template>
    <div class="h-screen max-w-md mx-auto px-5 flex items-center">
      <div class="w-full max-w-[400px] border mx-auto p-5 flex flex-col gap-3 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center w-full ">Create your account</h2>
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-3">
          <input type="email" placeholder="email" v-model = "email" class="p-1 rounded-md border w-full">
          <input type="password" placeholder="password"  v-model = "password" class="p-1 rounded-md border w-full">
          <button type="submit" class="w-full bg-black text-white  p-1 rounded-md">{{isLoading? "Loading ... " : "Sign Up"}}</button>
          <p class="text-red-600 text-center text-sm" v-if="errMessage">{{errMessage}}</p>
        </form>
        <p class="text-sm w-full text-center">Areadly had an account? <NuxtLink class="text-blue-600" to="/"> Login</NuxtLink></p>
      </div>
    </div>
</template>

<script setup>
import {ref} from "vue"
import { useRouter } from "vue-router";


const router = useRouter()
const email = ref("")
const password = ref("")
const isLoading = ref(false)
const errMessage = ref("")

const handleSubmit =  async () => {
    isLoading.value = true
    errMessage.value = ""
    try {
      await $fetch (`/api/register/`, {
        method: "POST",
        body : {
          email : email.value,
          password : password.value
        }, credentials : "include"
      }) 

      alert("Created new account successfully!")
      router.push("/")
    }

    catch (error) {
      console.log("There is an error :", error)
      errMessage.value = error?.data?.message || "Failed to create new acount"
    }

    finally {
      isLoading.value = false
    }
}


</script>

<!-- test@example.com
1234abcd -->

<!-- $env:NUXT_PUBLIC_API_BASE="http://localhost:8000" -->
 
