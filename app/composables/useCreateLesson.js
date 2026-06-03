

const changeStatus = (listPhrase) => {
    const listPreviousPhraseIndexs = new Set();
    for (const phrase of listPhrase) {
        for ( const wordItem of phrase["phrase"]) {
            if (listPreviousPhraseIndexs.has(wordItem["w_idx"])) {
                wordItem["visible_in_phrase"] = false
            }

            else {
                wordItem["visible_in_phrase"] = true;
                listPreviousPhraseIndexs.add(wordItem["w_idx"])
            }
        }
        phrase.visible = phrase.phrase.some( w => w.visible_in_phrase === true)
    }

}

const buildSentence = (listPhrase, flatSentenceData) => {
    let indexLastItem = -1
    const newSenteceData = []
    for (const phrase of listPhrase) {
        const listWordsBeforeCurrentPhrase = flatSentenceData.filter( item => item["idx_w_in_s"] < phrase.phrase[0]["idx_w_in_s"] && indexLastItem < item["idx_w_in_s"])
        newSenteceData.push(...listWordsBeforeCurrentPhrase)
        newSenteceData.push(phrase)
        indexLastItem = Math.max(indexLastItem, phrase.phrase[0]["idx_w_in_s"] + phrase.phrase.length -1)
    }

    const remainingWords = flatSentenceData.filter( item => item["idx_w_in_s"] > indexLastItem)
    newSenteceData.push(...remainingWords)

    return newSenteceData
}


const getSentenceData = (sentenceData, phraseArr, phraseStatusDict) => {
    const wordInSentenceArr = sentenceData.map(item => item["cleaned"])
    
    const paraIndex = sentenceData?.[0]?.p_idx ?? -1;
    const sentenceIndex = sentenceData?.[0]?.s_idx ?? -1;

    const listAllPhrases = []

    for (const phrase of phraseArr) {
        if (sentenceData.length < phrase.length) continue;

        for (let i =0; i < sentenceData.length ; i ++) {
            if (wordInSentenceArr.slice(i, i + phrase.length).join(" ") === phrase.join(" ")) {
                const chunkData = JSON.parse(JSON.stringify(sentenceData.slice(i, i + phrase.length)))
                listAllPhrases.push({
                    "phrase" : chunkData,
                    "status" : phraseStatusDict[phrase.join(" ")],
                    "p_idx": paraIndex,
                    "s_idx": sentenceIndex,
                    "visible": true,
                    "type": "phrase"
                })
                //  console.log("phrase", phrase.join(" "), "status", phraseStatusDict[phrase.join(" ")])
            }

           
        }



    }

    // console.log("list all phrase in this sentence", listAllPhrases)
    if (listAllPhrases.length === 0 ) return sentenceData
    
    const sortedPhraseLists = listAllPhrases.sort((a,b) => {
    const indexDifference = a["phrase"][0]["idx_w_in_s"] - b["phrase"][0]["idx_w_in_s"]

    if (indexDifference !== 0) return indexDifference

    return b.phrase.length - a.phrase.length
    })

    changeStatus(sortedPhraseLists)
    
    const newSentenceData = buildSentence(sortedPhraseLists, sentenceData)
    return newSentenceData
}

export function useCreateLesson(core_data, statusDict, indexParaStart, indexParaEnd) {

// list all current phrase
const phraseArr = Object.keys(statusDict.value).map(item => item.split(" ")).filter(item => item.length > 1)



const phraseStatusDict = {}

for (const item of phraseArr) {
    const phraseText = item.join(" ")
    phraseStatusDict[phraseText] =
        statusDict.value[phraseText] ?? -1
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
                return getSentenceData(updatedSentenceArr, phraseArr, phraseStatusDict)
            }
        )

        return paraArrBeforeflatten.flat()
    }
)



    return {
        lessondataChunk
    }


}
