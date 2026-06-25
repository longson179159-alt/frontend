import type { Ref } from 'vue'

type StatusMapEntry = {
    tags: unknown[]
    your_meanings: unknown[]
    global_tags: unknown[]
    global_meanings: unknown[]
    status: number
}

type PhraseData = StatusMapEntry & {
    phrase: string
}

type StatusMapRef = Ref<Record<string, StatusMapEntry>>



export function useStatusMapMutations(statusTagsMeanings: StatusMapRef) {
    const removeStatusMapEntry = (phrase: string) => {
        delete statusTagsMeanings.value[phrase]
    }

    const upsertStatusMapEntry = (phraseData: PhraseData) => {
        statusTagsMeanings.value[phraseData.phrase] = {
            tags: phraseData.tags,
            your_meanings: phraseData.your_meanings,
            global_tags: phraseData.global_tags,
            global_meanings: phraseData.global_meanings,
            status: phraseData.status,
        }
    }

    return {
        removeStatusMapEntry,
        upsertStatusMapEntry,
    }
}
