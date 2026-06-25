import debounce from 'lodash/debounce'

export function useLastReadPersistence({
    getCsrfToken,
    getLessonAndCourseName,
    getIsYoutubeVideo,
    resolveYoutubeStartTime
}) {
    const saveLastReadWordIdx = debounce(
        async (newLastReadWordIdx, youtubeStartTime) => {
            try {
                const lessonAndCourseName = getLessonAndCourseName()
                const isYoutubeVideo = getIsYoutubeVideo()

                const payload = {
                    lessonName: lessonAndCourseName.lessonName,
                    courseName: lessonAndCourseName.courseName,
                    lastReadWordIdx: newLastReadWordIdx,
                    isYoutubeVideo,
                    youtubeStartTime
                }

                if (isYoutubeVideo) {
                    payload.youtubeStartTime = resolveYoutubeStartTime(youtubeStartTime)
                }

                await $fetch(`/api/update_last_read_word_idx/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCsrfToken(),
                    },
                    body: JSON.stringify(payload),
                })
            } catch (error) {
                console.error('Failed to update last read word index:', error)
            }
        },
        1000
    )

    const handleVisibilityChange = () => {
        if (document.hidden) {
            saveLastReadWordIdx.flush()
        }
    }

    return {
        saveLastReadWordIdx,
        handleVisibilityChange
    }
}
