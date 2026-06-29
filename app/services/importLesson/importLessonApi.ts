export const createLessonManuallyRequest = async ({ formData }: {
  formData: FormData
}) => {
  return await $fetch('/api/create_lesson_manually/', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  })
}

export const uploadNewWordsRequest = async ({ formData }: {
  formData: FormData
}) => {
  return await $fetch('/api/uploadNewWords', {
    method: 'POST',
    body: formData,
  })
}
