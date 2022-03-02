import dictionary from "./dictionary.json"

type GameInfo = {
  word: string | null
  sender: string | null
  indicator: keyof typeof indications | null
}

const indications = {
  common: "✅ This word is in the dictionary.",
  extended: "⚠️ This word is in the extended dictionary.",
  unknown: "❔ Word is not in dictionary (all guesses are allowed)",
  invalid: "❌ Invalid link",
}

const nullGame = { word: null, sender: null, indicator: null }

export function getWordOfTheDay(): GameInfo {
  const gameId = new URLSearchParams(location.search).get("game")
  if (gameId == null) return nullGame

  let decodedGameId
  try {
    decodedGameId = atob(gameId)
  } catch (error) {
    console.error(error)
    return { ...nullGame, indicator: "invalid" }
  }

  const [sender, word] = [decodedGameId.slice(0, -5), decodedGameId.slice(-5)]

  return { word, sender, indicator: wordInDictionary(word) }
}

export function wordInDictionary(word: string): keyof typeof indications {
  if (dictionary.common.includes(word)) return "common"
  if (dictionary.extended.includes(word)) return "extended"
  return "unknown"
}
