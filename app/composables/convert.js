
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

  // Remove non-alphanumeric characters except apostrophes.
  // Python regex: r"[^\w\s']", ""
  // JS equivalent: keep [A-Za-z0-9_], whitespace, and apostrophes.
  w = w.replace(/[^\w\s'-]/g, "");
  return w;
}

// check if word only contains alphabets, or '-' or ''', and it has any alphabet in it.
const isValidWord = (word) => {
  return /^[a-zA-Z'-]+$/.test(word) && /[a-zA-Z]/.test(word);
}

  return {
    minutesSeconds,
    seconds,
    cleanWord,
    isValidWord
  }
}
