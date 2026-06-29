export const getLessonRequest = async ({
  lessonName,
  courseName,
}: {
  lessonName: string
  courseName: string
}) => {
  return await $fetch('/api/get_lesson/', {
    method: 'GET',
    query: {
      lesson_name: lessonName,
      course_name: courseName,
    },
    credentials: 'include',
  })
}

export const finishLessonRequest = async ({
  statusDict,
  csrfToken,
}: {
  statusDict: Record<string, number>
  csrfToken: string
}) => {
  return await $fetch('/api/finish_lesson/', {
    method: 'PUT',
    body: JSON.stringify(statusDict),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
  })
}

export const updateLastReadWordIdxRequest = async ({
  lessonName,
  courseName,
  lastReadWordIdx,
  isYoutubeVideo,
  youtubeStartTime,
  csrfToken,
}: {
  lessonName: string
  courseName: string
  lastReadWordIdx: number
  isYoutubeVideo: boolean
  youtubeStartTime?: number
  csrfToken: string
}) => {
  const payload = {
    lessonName,
    courseName,
    lastReadWordIdx,
    isYoutubeVideo,
    youtubeStartTime,
  }

  return await $fetch('/api/update_last_read_word_idx/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify(payload),
  })
}

export const updateWordRequest = async ({
  payload,
  csrfToken,
}: {
  payload: Record<string, unknown>
  csrfToken: string
}) => {
  return await $fetch('/api/update_word/', {
    method: 'PUT',
    body: payload,
    credentials: 'include',
    headers: {
      'X-CSRFToken': csrfToken,
    },
  })
}