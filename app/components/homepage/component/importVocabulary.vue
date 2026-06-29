<template>
  <div class="fixed inset-0 h-screen w-full z-20 bg-gray-500/10 flex flex-col items-center justify-center">

    <div v-if="!importing" class="flex border max-w-sm md:max-w-2xl  xl:max-w-3xl bg-white rounded-3xl p-5 flex flex-col">
      <div class="flex justify-between w-full ">
        <span class="inline-flex gap-5 whitespace-nowrap items-center">
          <img src="/icons/header/importVocabulary.svg" alt="importVocabulary" class="h-5 w-5">
          <span class="text-xl font-bold">Vocabulary Import</span>
        </span>

        <button @click="sendToParent" class="h-8 w-8 bg-gray-300 rounded-full">
          <font-awesome icon="times"/>
        </button>
      </div>

      <span class="font-bold text-lg mt-3 mb-1">Import Term</span>
      <input type="text" placeholder="Enter terms. One term per line." class="p-2 border rounded-md placeholder:text-gray-700 placeholder:text-lg">

      <span class="text-lg font-bold mt-3 mb-1">Import .csv file</span>
      <span class="font-medium text-gray-600 ">Label columns as follows: term, phrase, tag1, tag2, meaninglanguage1, meaning1, meaninglanguage2, meaning2</span>

      <label class="cursor-pointer ">
        <span class="border border-gray-300 hover:border-gray-600 px-4 py-2 mt-3 inline-block rounded-lg text-lg">Browse...</span>
        <input type="file" @change="uploadFile" accept=".csv" class="sr-only">

        <span v-if="vocabularyFile.name" class="ml-2 text-gray-500 text-lg"> {{ vocabularyFile.name}}</span>
      </label>

      <button @click="handleUpload" class="border mt-3 px-4 py-2 self-end bg-[#0B1B32] hover:bg-black text-white  text-center rounded-lg text-lg font-semibold">Submit</button>
    </div>

    <div v-if="importing" class=" max-w-sm md:max-w-4xl px-3  border bg-white p-5 rounded-2xl">
      <div class="flex justify-between">
        <span class="inline-flex gap-5 whitespace-nowrap items-center">
          <img src="/icons/header/importVocabulary.svg" alt="importVocabulary" class="inline-block h-5 w-5">
          <span class="font-bold text-lg">Vocabulary</span>
        </span>

        <button @click="sendToParent"
          class="h-10 w-10 hover:bg-gray-300 rounded-full flex items-center justify-center"><font-awesome
            icon="times" /></button>
      </div>
   
      <span class="text-lg inline-block mb-5">
        Your file is importing. Depending on the speed of your connection and the size fo the file, this could take a few minutes.
      </span>

      <Spiner  />
    </div>

    <span v-if="message" class="mt-3 text-red-600">{{ message }}</span>
  </div>
</template>


<script setup>
import {ref} from "vue"
import Spiner from "./Spiner.vue"
import { uploadNewWordsRequest } from '~/services/importLesson/importLessonApi'
// const config = useRuntimeConfig()
const vocabularyFile = ref("")
const message = ref(null)
const importing = ref(false)

const emit = defineEmits(["send-message"])
const sendToParent = () => {
  emit("send-message", "closeUpload")
}

const uploadFile = (e) => {
    vocabularyFile.value = e.target.files[0]
}

const handleUpload = async () => {
    
    message.value = ""
    const formData = new FormData()
    if (!vocabularyFile.value) return
    formData.append("file", vocabularyFile.value)

    importing.value = true
    try {
      const result = await uploadNewWordsRequest({
        formData
      })

      message.value = "uploaded successfully file : " + result.filename
    }

    catch (error) {
        console.log(error)
        message.value = "Failed to upload : " + vocabularyFile.value.name
    }

    importing.value = false
} 
</script>
