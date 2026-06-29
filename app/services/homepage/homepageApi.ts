export const showCourseInfosRequest = async ({ courseName }: {
  courseName: string
}) => {
  return await $fetch('/api/show_course_infos/', {
    method: 'GET',
    query: {
      course_name: courseName,
    },
    credentials: 'include',
  })
}

export const getLessonCardsRequest = async ({ page }: {
  page: number
}) => {
  return await $fetch('/api/get_data_lessons_cards/', {
    method: 'GET',
    query: {
      page,
    },
    credentials: 'include',
  })
}

export const getCourseCardsRequest = async ({ page }: {
  page: number
}) => {
  return await $fetch('/api/get_data_courses_cards/', {
    method: 'GET',
    query: {
      page,
    },
    credentials: 'include',
  })
}

export const deleteCourseRequest = async ({ courseName }: {
  courseName: string
}) => {
  return await $fetch('/api/delete_course/', {
    method: 'DELETE',
    body: {
      course_name: courseName,
    },
    credentials: 'include',
  })
}

export const deleteLessonRequest = async ({
  lessonName,
  courseName,
  csrfToken,
}: {
  lessonName: string
  courseName: string
  csrfToken: string
}) => {
  return await $fetch('/api/delete_lesson/', {
    method: 'POST',
    body: {
      lesson_name: lessonName,
      course_name: courseName,
    },
    credentials: 'include',
    headers: {
      'X-CSRFToken': csrfToken,
    },
  })
}

export const getProgressDataRequest = async () => {
  return await $fetch('/api/get_progress_data/', {
    method: 'GET',
    credentials: 'include',
  })
}

export const logoutRequest = async ({ csrfToken }: {
  csrfToken: string
}) => {
  return await fetch('/api/logout/', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-CSRFToken': csrfToken,
    },
  })
}
