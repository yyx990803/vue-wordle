import { allWords } from './words'

export const getWordOfDay = () => {
    const epochMs = 1641013200000
    const now = Date.now()
    const msInDay = 86400000
    const index = Math.floor((now - epochMs) / msInDay)
  
    return {
      solution: allWords[index].toUpperCase(),
      solutionIndex: index,
    }
  }
  
export const { solution, solutionIndex } = getWordOfDay()