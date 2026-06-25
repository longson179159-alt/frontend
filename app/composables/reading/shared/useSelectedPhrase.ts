import { computed, type ComputedRef, type Ref } from 'vue'

type Pointer = [number, number, number, number] | null

type SelectedPhraseRef = Ref<string[]> | ComputedRef<string[]>

type SelectedPhraseResult = {
    text: string
    valid: boolean
    error?: string
}

type UseSelectedPhraseOptions = {
    startPointer: Ref<Pointer>
    currentPointer: Ref<Pointer>
    listSentence: SelectedPhraseRef
    cleanWord: (word: string) => string
    isValidWord: (word: string) => boolean
}

export function useSelectedPhrase({
    startPointer,
    currentPointer,
    listSentence,
    cleanWord,
    isValidWord
}: UseSelectedPhraseOptions) {
    const selected = computed<SelectedPhraseResult>(() => {
        // Guard: selection not started or not updated
        if (!startPointer.value || !currentPointer.value) return { text: '', valid: false, error: 'empty' }

        // Guard: do not allow cross-sentence selection
        if (startPointer.value[1] !== currentPointer.value[1]) {
            const realStart = startPointer.value[0] < currentPointer.value[0] ? startPointer.value : currentPointer.value
            const realEnd = startPointer.value[0] < currentPointer.value[0] ? currentPointer.value : startPointer.value

            const firstSentenceChuck = listSentence.value[realStart[1]].split(' ').splice(realStart[2]).join(' ')

            const middleSentence = listSentence.value.slice(realStart[1] + 1, realEnd[1]).join(' ')
            const lastSentenceChuck = listSentence.value[realEnd[1]].split(' ').splice(0, realEnd[2] + 1).join(' ')
            const text = firstSentenceChuck + ' ' + middleSentence + " " + lastSentenceChuck
            return { text: text, valid: false, error: 'cross-sentence' }
        }

        const a = Math.min(startPointer.value[2], currentPointer.value[2])
        const b = Math.max(startPointer.value[2], currentPointer.value[2])


        const sentence = listSentence.value[currentPointer.value[1]]
        const listWordInSentence = sentence.split(' ')
        const selected_phrase = listWordInSentence.slice(a, b + 1)
        const cleaned_selected_phrase = selected_phrase.map(item => cleanWord(item))

        // check if all words of selected phrase are valid
        if (!cleaned_selected_phrase.every(word => isValidWord(word))) {
            return { text: cleaned_selected_phrase.join(' '), valid: false, error: 'invalid-word' }
        }


        if (selected_phrase.length > 8) return { text: cleaned_selected_phrase.join(' '), valid: false, error: 'too-long' }
        return { text: cleaned_selected_phrase.join(' '), valid: true }
    })

    return {
        selected
    }
}
