import dictionary from "./dictionary.json"

type GameInfo = {
  word: string | null
  sender: string | null
  indicator: keyof typeof indications
}

export const indications = {
  common: "📗✔️ This word is in the dictionary",
  extended: "📚✔️ This word is in the extended dictionary",
  unknown: "📚❌ This word is not in the dictionary (all guesses are allowed)",
  invalid: "❌ Invalid link",
  notEnoughLetters: "🔠 Not enough letters",
}

const nullGame = { word: null, sender: null, indicator: null }

export function getWordOfTheDay(): GameInfo {
  const gameId = new URLSearchParams(location.search).get("game")
  if (gameId == null) return { ...nullGame, indicator: "invalid" }

  let decodedGameId
  try {
    decodedGameId = atob(gameId)
  } catch (error) {
    console.error(error)
    return { ...nullGame, indicator: "invalid" }
  }

  let [sender, word] = [decodedGameId.slice(0, -5), decodedGameId.slice(-5)]
  word = word.toUpperCase().replaceAll(/[^A-Z]/g, "")
  if (word.length !== 5) return { word, sender, indicator: "invalid" }

  return { word, sender, indicator: wordInDictionary(word) }
}

export function wordInDictionary(word: string): keyof typeof indications {
  word = word.toLowerCase().trim()
  if (dictionary.common.includes(word)) return "common"
  if (dictionary.extended.includes(word)) return "extended"
  return "unknown"
}

export function normaliseWord(word: string) {
  word = word.toUpperCase()
  word = word.replaceAll(/[^A-Z]/g, "")
  if (word.length > 5) word = word.slice(0, 5)
  return word
}

export function recreateGameId(word: string, sender: string | null) {
  if (!sender) sender = ""
  word = normaliseWord(word)
  return btoa(sender + word)
}
