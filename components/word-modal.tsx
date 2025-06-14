"use client"

import { useState } from "react"
import type { Word } from "@/types"
import { useApp } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2, BookOpen, X } from "lucide-react"

interface WordModalProps {
  word: Word
  isOpen: boolean
  onClose: () => void
}

export function WordModal({ word, isOpen, onClose }: WordModalProps) {
  const { addWordToVocabulary, isWordSaved } = useApp()
  const [showTranslation, setShowTranslation] = useState<"chinese" | "english">("chinese")
  const [activeTab, setActiveTab] = useState<"definition" | "grammar" | "conjugation">("definition")

  if (!isOpen) return null

  const handleSaveWord = () => {
    addWordToVocabulary(word)
  }

  const playPronunciation = () => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(word.french)
      utterance.lang = "fr-FR"
      utterance.rate = 0.7 // Slower for learning
      utterance.pitch = 1

      // Try to find a French voice
      const voices = window.speechSynthesis.getVoices()
      const frenchVoice = voices.find((voice) => voice.lang.startsWith("fr"))
      if (frenchVoice) {
        utterance.voice = frenchVoice
      }

      window.speechSynthesis.speak(utterance)
    } else {
      console.log("Text-to-speech not supported in this browser")
      alert("语音功能在此浏览器中不支持")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-blue-600 dark:text-blue-400">{word.french}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-300">{word.phonetic}</span>
            <Button variant="ghost" size="sm" onClick={playPronunciation}>
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 border-b">
            <Button
              variant={activeTab === "definition" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("definition")}
            >
              释义
            </Button>
            {word.grammar && (
              <Button
                variant={activeTab === "grammar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("grammar")}
              >
                语法
              </Button>
            )}
            {word.conjugation && (
              <Button
                variant={activeTab === "conjugation" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("conjugation")}
              >
                变位
              </Button>
            )}
          </div>

          {/* Definition Tab */}
          {activeTab === "definition" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    variant={showTranslation === "chinese" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowTranslation("chinese")}
                  >
                    中文
                  </Button>
                  <Button
                    variant={showTranslation === "english" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowTranslation("english")}
                  >
                    English
                  </Button>
                </div>
                <p className="text-lg font-medium">{showTranslation === "chinese" ? word.chinese : word.english}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">例句 Example:</h4>
                <p className="text-blue-600 dark:text-blue-400 mb-1">{word.example}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {showTranslation === "chinese" ? word.exampleChinese : word.exampleEnglish}
                </p>
              </div>
            </div>
          )}

          {/* Grammar Tab */}
          {activeTab === "grammar" && word.grammar && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">词性 Word Type:</h4>
                <p className="text-blue-600 dark:text-blue-400 capitalize">{word.grammar.type}</p>
                {word.grammar.gender && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    性别: {word.grammar.gender === "masculine" ? "阳性 (masculine)" : "阴性 (feminine)"}
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2">语法说明 Grammar Notes:</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      variant={showTranslation === "chinese" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowTranslation("chinese")}
                    >
                      中文
                    </Button>
                    <Button
                      variant={showTranslation === "english" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowTranslation("english")}
                    >
                      English
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {showTranslation === "chinese" ? word.grammar.chineseNotes : word.grammar.englishNotes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Conjugation Tab */}
          {activeTab === "conjugation" && word.conjugation && (
            <div className="space-y-4">
              {word.conjugation.present && (
                <div>
                  <h4 className="font-medium mb-2">现在时 Present Tense:</h4>
                  <div className="grid grid-cols-1 gap-1 text-sm">
                    {word.conjugation.present.map((form, index) => (
                      <div key={index} className="text-blue-600 dark:text-blue-400">
                        {form}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {word.conjugation.past && (
                <div>
                  <h4 className="font-medium mb-2">过去时 Past Tense:</h4>
                  <div className="grid grid-cols-1 gap-1 text-sm">
                    {word.conjugation.past.map((form, index) => (
                      <div key={index} className="text-green-600 dark:text-green-400">
                        {form}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {word.conjugation.future && (
                <div>
                  <h4 className="font-medium mb-2">将来时 Future Tense:</h4>
                  <div className="grid grid-cols-1 gap-1 text-sm">
                    {word.conjugation.future.map((form, index) => (
                      <div key={index} className="text-purple-600 dark:text-purple-400">
                        {form}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {word.conjugation.conditional && (
                <div>
                  <h4 className="font-medium mb-2">条件式 Conditional:</h4>
                  <div className="grid grid-cols-1 gap-1 text-sm">
                    {word.conjugation.conditional.map((form, index) => (
                      <div key={index} className="text-orange-600 dark:text-orange-400">
                        {form}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <Button onClick={handleSaveWord} disabled={isWordSaved(word.id)} className="w-full">
            <BookOpen className="h-4 w-4 mr-2" />
            {isWordSaved(word.id) ? "已加入生词本" : "加入生词本"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
