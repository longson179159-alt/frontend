import debounce from 'lodash/debounce'
import { updateLastReadWordIdxRequest } from '~/services/reading/readerApi'
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

                await updateLastReadWordIdxRequest(payload)
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
