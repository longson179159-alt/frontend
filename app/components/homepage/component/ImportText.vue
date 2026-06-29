<template>
  <div class="fixed inset-0 h-screen bg-gray-500/50 z-20  px-5 w-full flex flex-col items-center justify-center">
    <!-- BEFORE IMPORTING -->
    <div v-if="!importing" class=" max-w-[600px] md:w-[600px] px-3 border bg-white p-5 rounded-2xl">

      <!-- upper part -->
      <div class="flex justify-between">
        <span class="inline-flex gap-5 whitespace-nowrap items-center">
          <img src="/icons/header/importText.svg" alt="importText" >
          <span class="font-bold text-lg">Import ebook</span>
        </span>

        <button @click="sendToParent"
          class="h-10 w-10 hover:bg-gray-300 rounded-full flex items-center justify-center"><font-awesome
            icon="times" /></button>
      </div>
      <span class="text-lg inline-block my-5">
        Import your digital copy of your favourite book here! Just drag and drop in the selected area or choose a file
        from your computer. All imported books are private and only visible to you.
      </span>

      <label class="cursor-pointer ">
        <input type="file" accept=".pdf, .docx, .txt, .epub" @change="handleFile" class="sr-only">
        <div class="border border-dashed w-full h-20 border-blue-300 p-2 flex min-h-60 rounded-md">
          <div class="  border-8 border-blue-300 flex-1 flex items-center justify-center gap-2 px-3">
            <span class="text-xl">Drag and drop your file here or </span>
            <span class="bg-[#0B1B32] text-white px-3 py-3 text-xl font-semibold rounded-lg">Select file</span>
          </div>
        </div>
      </label>

      <span class="text-center mt-3 block">Supported formats: <span class="text-red-600">EPUB, PDF, DOCX,
          TXT</span></span>
    </div>
    <!-- IMPORTING -->
    <div v-if="importing" class=" max-w-sm md:max-w-4xl px-3  border bg-white p-5 rounded-2xl">
      <div class="flex justify-between">
        <span class="inline-flex gap-5 whitespace-nowrap items-center">
          <img src="/icons/header/importText.svg" alt="importText" >
          <span class="font-bold text-lg">Import ebook</span>
        </span>

        <button @click="sendToParent"
          class="h-10 w-10 hover:bg-gray-300 rounded-full flex items-center justify-center"><font-awesome
            icon="times" /></button>
      </div>
      <span class="text-lg inline-block ">
        Your file is importing. Once the first lesson is ready it will open additionall parts continue to import.
      </span>
      <span class="text-lg inline-block mb-5">
        Depending on the speed of your connection and the size fo the file, this could take a few minutes.
      </span>

      <Spiner v-if="loading"/>
      <span v-if="message" class=" text-red-600 block text-center">{{ message }}</span>
    </div>

    
  </div>
</template>


<script setup>

import { ref } from "vue"
import Spiner from "./Spiner.vue"
import { createLessonManuallyRequest } from '~/services/importLesson/importLessonApi'
// const config = useRuntimeConfig()


const uploadFile = ref(null)
const message = ref("")
const importing = ref(false)
const loading = ref(false)

const emit = defineEmits(["send-message"])
const sendToParent = () => {
  emit("send-message", "closeUpload")
}

const router = useRouter()

const handleFile = async (e) => {
  if (loading.value) return
  message.value = ""
  const file = e.target?.files?.[0]
  if (!file) return

  uploadFile.value = file

  importing.value = true
  loading.value = true
  const formData = new FormData()
  formData.append("textfile", uploadFile.value)
  // extract file name without extetension
  const lessonName = uploadFile.value.name.split(".").slice(0, -1).join(".")
  formData.append("lessonName", lessonName)
  formData.append("courseName", 'Quick Import')
  formData.append("language", 'en')

  try {
    const result = await createLessonManuallyRequest({
      formData
    })

    const lesson_name = result.lesson_name
    const course_name = result.course_name

    router.push({
      path: '/ReaderMain',
      query: {
        lessonName: lesson_name,
        courseName: course_name
      },
    })

  }

  catch (error) {
    console.error(error)
    message.value = error?.data?.message || ("Failed to upload : " + uploadFile.value.name)
  }

  finally {
    loading.value = false
    uploadFile.value = null
    if (message.value) importing.value = false

  }

}
</script>
