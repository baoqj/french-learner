"use client"

import { useState, useEffect } from "react"
import type { DialogueLine, Word } from "@/types"
import { getWordData, createGenericWord } from "@/data/scenarios"
import { useApp } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WordModal } from "./word-modal"
import { ArrowLeft, ArrowRight, Volume2, Eye, EyeOff, Settings } from "lucide-react"
import { speakFrench, splitTextIntoWords } from "@/utils/speech"

interface DialoguePageProps {
  dialogues: DialogueLine[]
  onBack: () => void
}

export function DialoguePage({ dialogues, onBack }: DialoguePageProps) {
  const { speechSettings, updateSpeechSettings } = useApp()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTranslation, setShowTranslation] = useState(true)
  const [translationLang, setTranslationLang] = useState<"chinese" | "english">("chinese")
  const [selectedWord, setSelectedWord] = useState<Word | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const currentDialogue = dialogues[currentIndex]

  // Reset current word index when dialogue changes
  useEffect(() => {
    setCurrentWordIndex(null)
  }, [currentIndex])

  const handleWordClick = (word: Word) => {
    setSelectedWord(word)
    // Speak the word when clicked
    speakFrench(word.french, speechSettings.rate)
  }

  const handleNext = () => {
    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const playAudio = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setCurrentWordIndex(null)
      return
    }

    setIsSpeaking(true)

    // If follow-along is enabled, we'll highlight words as they're spoken
    if (speechSettings.followAlong) {
      const words = splitTextIntoWords(currentDialogue.french)
      const wordPositions: number[] = []
      let currentPos = 0

      // Calculate the starting position of each word
      words.forEach((word) => {
        wordPositions.push(currentPos)
        currentPos += word.length
      })

      speakFrench(
        currentDialogue.french,
        speechSettings.rate,
        (word, charIndex) => {
          // Find which word this character index corresponds to
          const wordIndex = wordPositions.findIndex((pos, idx) => {
            const nextPos = idx < wordPositions.length - 1 ? wordPositions[idx + 1] : currentDialogue.french.length
            return charIndex >= pos && charIndex < nextPos
          })

          if (wordIndex !== -1) {
            setCurrentWordIndex(wordIndex)
          }
        },
        () => {
          setIsSpeaking(false)
          setCurrentWordIndex(null)
        },
      )
    } else {
      // Simple playback without highlighting
      speakFrench(currentDialogue.french, speechSettings.rate, undefined, () => {
        setIsSpeaking(false)
      })
    }
  }

  // Enhanced function to make any word clickable with follow-along highlighting
  const renderClickableText = (text: string) => {
    const words = splitTextIntoWords(text)

    return (
      <span className="leading-relaxed break-words">
        {words.map((word, index) => {
          const cleanWord = word.trim()
          if (!cleanWord || /^[.,!?;:\s]+$/.test(cleanWord)) {
            return <span key={index}>{word}</span>
          }

          const isHighlighted = speechSettings.followAlong && currentWordIndex === index && isSpeaking

          return (
            <span
              key={index}
              className={`word-clickable cursor-pointer px-1 py-0.5 rounded transition-colors inline-block ${
                isHighlighted ? "bg-blue-500 text-white" : "hover:bg-blue-100 dark:hover:bg-blue-900"
              }`}
              onClick={() => {
                const wordData = getWordData(cleanWord) || createGenericWord(cleanWord)
                handleWordClick(wordData)
              }}
            >
              {word}
            </span>
          )
        })}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {currentIndex + 1} / {dialogues.length}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={() => setShowTranslation(!showTranslation)}>
              {showTranslation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Speech Settings Panel */}
        {showSettings && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">语音设置 Speech Settings</h3>

              <div className="space-y-4">
                {/* Follow Along Toggle */}
                <div className="flex items-center justify-between">
                  <span>跟读高亮 Follow Along</span>
                  <Button
                    variant={speechSettings.followAlong ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSpeechSettings({ followAlong: !speechSettings.followAlong })}
                  >
                    {speechSettings.followAlong ? "开启 On" : "关闭 Off"}
                  </Button>
                </div>

                {/* Speed Controls */}
                <div>
                  <span className="block mb-2">语速 Speed</span>
                  <div className="flex gap-2 flex-wrap">
                    {[0.25, 0.5, 0.75, 1].map((rate) => (
                      <Button
                        key={rate}
                        variant={speechSettings.rate === rate ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSpeechSettings({ rate: rate as 0.25 | 0.5 | 0.75 | 1 })}
                      >
                        x{rate}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / dialogues.length) * 100}%` }}
          />
        </div>

        {/* Dialogue Card */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{currentDialogue.speaker}</span>
              <Button variant="ghost" size="sm" onClick={playAudio}>
                <Volume2 className={`h-4 w-4 ${isSpeaking ? "text-blue-600" : ""}`} />
              </Button>
            </div>

            <div className="space-y-4">
              {/* French text with proper wrapping */}
              <div className="w-full overflow-hidden">
                <p className="text-xl font-medium text-gray-900 dark:text-gray-100 leading-relaxed break-words hyphens-auto">
                  {renderClickableText(currentDialogue.french)}
                </p>
              </div>

              {showTranslation && (
                <div className="border-t pt-4">
                  <div className="flex gap-2 mb-2 justify-end flex-wrap">
                    <Button
                      variant={translationLang === "chinese" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTranslationLang("chinese")}
                    >
                      中文
                    </Button>
                    <Button
                      variant={translationLang === "english" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTranslationLang("english")}
                    >
                      English
                    </Button>
                  </div>
                  <div className="w-full overflow-hidden">
                    <p className="text-gray-600 dark:text-gray-300 break-words hyphens-auto">
                      {translationLang === "chinese" ? currentDialogue.chinese : currentDialogue.english}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex-1 sm:flex-none"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            上一句
          </Button>
          <Button onClick={handleNext} disabled={currentIndex === dialogues.length - 1} className="flex-1 sm:flex-none">
            下一句
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Word Modal */}
      {selectedWord && <WordModal word={selectedWord} isOpen={!!selectedWord} onClose={() => setSelectedWord(null)} />}
    </div>
  )
}
