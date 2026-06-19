import debounce from "lodash/debounce";
export function useGooleTranslate () {


const onTranslate = async (text) => {
    
    try {
        const data = await $fetch(
        'https://translate.googleapis.com/translate_a/single',
        {
            params: {
                client: 'gtx',
                sl: 'en',
                tl: 'vi',
                dt: 't',
                q: text
            }
        }
        )
        const result = data?.[0]?.[0]?.[0]?? ''

        return result
    }

    catch (err) {
        console.error('Translation failed', err)

        return ''
    }
}

// 🟢 Speak English input text
const speakEnglish = debounce((text, speed = 1) => {
    if (!text) return
    try {  // Create a speech utterance using the input text
    const utterance = new SpeechSynthesisUtterance(text)

    // Set the language/accent for pronunciation
    utterance.lang = 'en-US'

    // Control speaking speed (1 = normal)
    utterance.rate = speed

    utterance.voice = speechSynthesis
        .getVoices()
        .find(v => v.name === 'Microsoft David – English')

    // Send the utterance to the browser’s speech engine to play audio
    speechSynthesis.speak(utterance)}
    catch (error) {
        console.error('there is an error with speakEnglish', error)
    }
}, 500)


const openTranslatePopup = (text) => {
  const q = text.trim();
  if (!q) return;

  const url =
    "https://translate.google.com/?sl=en&tl=vi&op=translate&text=" +
    encodeURIComponent(q);

  window.open(
    url,
    "translatePopup",
    "width=1000,height=600,noopener,noreferrer"
  );
}

return {
    onTranslate,
    speakEnglish,
    openTranslatePopup,
}}