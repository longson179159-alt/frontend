
// /composables/useTime.js
export function useConvert() {
// Convert seconds -> "M:SS"
const minutesSeconds = (sec) => {
  const m = Math.floor(sec / 60)
  const s = (sec % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

// Convert "M:SS" -> seconds
const seconds = (rawString) => {
  const [m, s] = rawString.split(":").map(Number)
  return m * 60 + s
}


// * @param {string} word
//  * @returns {string} cleaned word
//  */
const cleanWord = (word)=> {

  let w = String(word).toLowerCase().trim();

  // Unicode normalize (NFKD)
  // (Available in modern JS runtimes)
  w = w.normalize("NFKD");

  // Replace smart apostrophe and dash variants
  w = w.replace(/’/g, "'").replace(/[–—]/g, "-");

  w = w.replace(/[^\w\s'-]/g, "");
  return w;
}


// Why this one:

// allows letters only
// allows internal apostrophe or hyphen
// rejects leading/trailing ' or -
// rejects repeated separators like -- or ''
// rejects digits
// Examples:

// valid: hello, don't, well-known
// invalid: -hello, hello-, rock--solid, mp3, can''t

const isValidWord = (word) => {
  return /^[a-z]+(?:['-][a-z]+)*$/.test(String(word).toLowerCase().trim())
}

  return {
    minutesSeconds,
    seconds,
    cleanWord,
    isValidWord
  }
}
