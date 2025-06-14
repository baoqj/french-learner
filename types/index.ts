export interface Word {
  id: string
  french: string
  chinese: string
  english: string
  phonetic: string
  example: string
  exampleChinese: string
  exampleEnglish: string
  conjugation?: {
    present?: string[]
    past?: string[]
    future?: string[]
    conditional?: string[]
  }
  grammar?: {
    type: "verb" | "noun" | "adjective" | "adverb" | "preposition" | "other"
    gender?: "masculine" | "feminine" | "neutral"
    notes?: string
    chineseNotes?: string
    englishNotes?: string
  }
}

export interface DialogueLine {
  id: string
  speaker: string
  french: string
  chinese: string
  english: string
  words: Word[]
}

export interface Scenario {
  id: string
  name: string
  nameChinese: string
  nameEnglish: string
  icon: string
  description: string
  dialogues: DialogueLine[]
  progress: number
}

export interface UserProgress {
  currentScenario: string
  completedLessons: string[]
  savedWords: Word[]
  dailyStreak: number
}

export interface SpeechSettings {
  followAlong: boolean
  rate: 0.25 | 0.5 | 0.75 | 1
}
