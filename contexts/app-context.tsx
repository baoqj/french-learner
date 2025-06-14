"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Scenario, Word, UserProgress, SpeechSettings } from "@/types"
import { scenarios } from "@/data/scenarios"

interface AppContextType {
  scenarios: Scenario[]
  currentScenario: Scenario | null
  setCurrentScenario: (scenario: Scenario) => void
  savedWords: Word[]
  addWordToVocabulary: (word: Word) => void
  removeWordFromVocabulary: (wordId: string) => void
  isWordSaved: (wordId: string) => boolean
  userProgress: UserProgress
  updateProgress: (scenarioId: string) => void
  darkMode: boolean
  toggleDarkMode: () => void
  speechSettings: SpeechSettings
  updateSpeechSettings: (settings: Partial<SpeechSettings>) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [savedWords, setSavedWords] = useState<Word[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    currentScenario: "",
    completedLessons: [],
    savedWords: [],
    dailyStreak: 1,
  })
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>({
    followAlong: true,
    rate: 0.75,
  })

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem("french-learner-data")
    if (savedData) {
      const data = JSON.parse(savedData)
      setSavedWords(data.savedWords || [])
      setUserProgress(data.userProgress || userProgress)
      setDarkMode(data.darkMode || false)
      setSpeechSettings(data.speechSettings || speechSettings)
    }
  }, [])

  useEffect(() => {
    // Save data to localStorage
    const dataToSave = {
      savedWords,
      userProgress,
      darkMode,
      speechSettings,
    }
    localStorage.setItem("french-learner-data", JSON.stringify(dataToSave))
  }, [savedWords, userProgress, darkMode, speechSettings])

  const addWordToVocabulary = (word: Word) => {
    if (!savedWords.find((w) => w.id === word.id)) {
      setSavedWords((prev) => [...prev, word])
    }
  }

  const removeWordFromVocabulary = (wordId: string) => {
    setSavedWords((prev) => prev.filter((w) => w.id !== wordId))
  }

  const isWordSaved = (wordId: string) => {
    return savedWords.some((w) => w.id === wordId)
  }

  const updateProgress = (scenarioId: string) => {
    setUserProgress((prev) => ({
      ...prev,
      currentScenario: scenarioId,
      completedLessons: [...prev.completedLessons, scenarioId],
    }))
  }

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
  }

  const updateSpeechSettings = (settings: Partial<SpeechSettings>) => {
    setSpeechSettings((prev) => ({
      ...prev,
      ...settings,
    }))
  }

  return (
    <AppContext.Provider
      value={{
        scenarios,
        currentScenario,
        setCurrentScenario,
        savedWords,
        addWordToVocabulary,
        removeWordFromVocabulary,
        isWordSaved,
        userProgress,
        updateProgress,
        darkMode,
        toggleDarkMode,
        speechSettings,
        updateSpeechSettings,
      }}
    >
      <div className={darkMode ? "dark" : ""}>{children}</div>
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
