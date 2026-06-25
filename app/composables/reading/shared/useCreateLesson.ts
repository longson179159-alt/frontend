type WordItem = {
    cleaned: string
    status: number
    w_idx: number
    p_idx: number
    s_idx: number
    idx_w_in_s: number
    type?: string
    visible_in_phrase?: boolean
    [key: string]: unknown
}

type PhraseItem = {
    phrase: WordItem[]
    status: number
    p_idx: number
    s_idx: number
    visible: boolean
    type: "phrase"
}

type SentenceItem = WordItem | PhraseItem

type PhraseCandidate = {
    words: string[]
    text: string
    status: number
}

type StatusDictRef = {
    value: Record<string, number>
}

const changeStatus = (listPhrase: PhraseItem[]) => {
    const listPreviousPhraseIndexs = new Set<number>();
    for (const phrase of listPhrase) {
        for (const wordItem of phrase["phrase"]) {
            if (listPreviousPhraseIndexs.has(wordItem["w_idx"])) {
                wordItem["visible_in_phrase"] = false
            }

            else {
                wordItem["visible_in_phrase"] = true;
                listPreviousPhraseIndexs.add(wordItem["w_idx"])
            }
        }
        phrase.visible = phrase.phrase.some(w => w.visible_in_phrase === true)
    }

}

const buildSentence = (listPhrase: PhraseItem[], flatSentenceData: WordItem[]) => {
    let indexLastItem = -1
    const newSenteceData: SentenceItem[] = []
    for (const phrase of listPhrase) {
        const firstWordInPhrase = phrase.phrase[0]
        if (!firstWordInPhrase) continue

        const listWordsBeforeCurrentPhrase = flatSentenceData.filter(item => item["idx_w_in_s"] < firstWordInPhrase["idx_w_in_s"] && indexLastItem < item["idx_w_in_s"])
        newSenteceData.push(...listWordsBeforeCurrentPhrase)
        newSenteceData.push(phrase)
        indexLastItem = Math.max(indexLastItem, firstWordInPhrase["idx_w_in_s"] + phrase.phrase.length - 1)
    }

    const remainingWords = flatSentenceData.filter(item => item["idx_w_in_s"] > indexLastItem)
    newSenteceData.push(...remainingWords)

    return newSenteceData
}


const getSentenceData = (sentenceData: WordItem[], phrasesByFirstWord: Record<string, PhraseCandidate[]>) => {
    const wordInSentenceArr = sentenceData.map(item => item["cleaned"])

    const paraIndex = sentenceData?.[0]?.p_idx ?? -1;
    const sentenceIndex = sentenceData?.[0]?.s_idx ?? -1;

    const listAllPhrases: PhraseItem[] = []

    for (let i = 0; i < sentenceData.length; i++) {
        const startWord = wordInSentenceArr[i]
        if (startWord === undefined) continue

        const candidatePhrases = phrasesByFirstWord[startWord] ?? []

        for (const candidate of candidatePhrases) {
            const phraseWords = candidate.words
            const phraseLen = phraseWords.length

            if (i + phraseLen > wordInSentenceArr.length) continue

            let isMatch = true
            for (let j = 0; j < phraseLen; j++) {
                if (wordInSentenceArr[i + j] !== phraseWords[j]) {
                    isMatch = false
                    break
                }
            }

            if (isMatch) {
                const chunkData = sentenceData.slice(i, i + phraseLen).map(word => ({ ...word }))
                listAllPhrases.push({
                    "phrase": chunkData,
                    "status": candidate.status,
                    "p_idx": paraIndex,
                    "s_idx": sentenceIndex,
                    "visible": true,
                    "type": "phrase"
                })
            }
        }
    }

    if (listAllPhrases.length === 0) return sentenceData

    const sortedPhraseLists = listAllPhrases.sort((a, b) => {
        const firstWordA = a["phrase"][0]
        const firstWordB = b["phrase"][0]

        if (!firstWordA || !firstWordB) return 0

        const indexDifference = firstWordA["idx_w_in_s"] - firstWordB["idx_w_in_s"]

        if (indexDifference !== 0) return indexDifference

        return b.phrase.length - a.phrase.length
    })

    changeStatus(sortedPhraseLists)

    const newSentenceData = buildSentence(sortedPhraseLists, sentenceData)
    return newSentenceData
}

export function useCreateLesson(
    core_data: WordItem[][][],
    statusDict: StatusDictRef,
    indexParaStart: number,
    indexParaEnd: number
) {

    const phrasesByFirstWord: Record<string, PhraseCandidate[]> = {}

    for (const phraseText of Object.keys(statusDict.value)) {
        const words = phraseText.split(" ")
        if (words.length <= 1) continue

        const firstWord = words[0]
        if (firstWord === undefined) continue

        if (!phrasesByFirstWord[firstWord]) {
            phrasesByFirstWord[firstWord] = []
        }

        phrasesByFirstWord[firstWord].push({
            words,
            text: phraseText,
            status: statusDict.value[phraseText] ?? -1,
        })
    }



    const lessondataChunk = core_data.slice(indexParaStart, indexParaEnd).map(
        paraArr => {
            const paraArrBeforeflatten = paraArr.map(
                sentenceArr => {
                    const updatedSentenceArr = sentenceArr.map(
                        wordObject => ({
                            ...wordObject,
                            status: statusDict.value[wordObject.cleaned] ?? -1
                        })
                    )
                    return getSentenceData(updatedSentenceArr, phrasesByFirstWord)
                }
            )

            return paraArrBeforeflatten.flat()
        }
    )



    return {
        lessondataChunk
    }


}
