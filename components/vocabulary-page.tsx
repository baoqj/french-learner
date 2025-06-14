"use client"

import { useState } from "react"
import { useApp } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Volume2, Trash2 } from "lucide-react"

interface VocabularyPageProps {
  onBack: () => void
}

export function VocabularyPage({ onBack }: VocabularyPageProps) {
  const { savedWords, removeWordFromVocabulary } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [showTranslation, setShowTranslation] = useState<"chinese" | "english">("chinese")

  const filteredWords = savedWords.filter(
    (word) =>
      word.french.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.chinese.includes(searchTerm) ||
      word.english.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const playPronunciation = (word: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = "fr-FR"
      utterance.rate = 0.7
      utterance.pitch = 1

      const voices = window.speechSynthesis.getVoices()
      const frenchVoice = voices.find((voice) => voice.lang.startsWith("fr"))
      if (frenchVoice) {
        utterance.voice = frenchVoice
      }

      window.speechSynthesis.speak(utterance)
    } else {
      console.log("Text-to-speech not supported")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">生词本 ({savedWords.length})</h1>
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
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜索生词..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Words Grid */}
        {filteredWords.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? "没有找到匹配的生词" : "还没有保存任何生词"}
              </p>
              {!searchTerm && <p className="text-sm text-gray-400 mt-2">在学习对话时点击生词即可添加到生词本</p>}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWords.map((word) => (
              <Card key={word.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-blue-600 dark:text-blue-400">{word.french}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => playPronunciation(word.french)}>
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWordFromVocabulary(word.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{word.phonetic}</p>
                </CardHeader>
                <CardContent>
                  <p className="font-medium mb-2">{showTranslation === "chinese" ? word.chinese : word.english}</p>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p className="italic mb-1">{word.example}</p>
                    <p>{showTranslation === "chinese" ? word.exampleChinese : word.exampleEnglish}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
