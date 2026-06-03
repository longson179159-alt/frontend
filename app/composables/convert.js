
// /composables/useTime.js
export function useConvert() {
// Convert seconds -> "M:SS"
const minutesSeconds = (sec) => {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec - h * 3600) / 60)
  const s = (sec % 60).toString().padStart(2, "0")
  if (h >=1) return `${h}:${m.toString().padStart(2, '0')}:${s}`
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
