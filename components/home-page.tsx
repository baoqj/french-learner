"use client"

import { useApp } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Play, Moon, Sun, Flame } from "lucide-react"

interface HomePageProps {
  onNavigate: (page: "scenarios" | "vocabulary") => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { scenarios, savedWords, userProgress, darkMode, toggleDarkMode } = useApp()

  const todayScenario = scenarios[0] // For demo, use first scenario as today's lesson
  const totalWords = savedWords.length
  const streak = userProgress.dailyStreak

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">French Learner</h1>
            <p className="text-gray-600 dark:text-gray-300">法语学习 · 生活场景对话</p>
          </div>
          <Button variant="ghost" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">连续学习</p>
                  <p className="text-2xl font-bold">{streak} 天</p>
                </div>
                <Flame className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">生词本</p>
                  <p className="text-2xl font-bold">{totalWords} 个</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">已完成</p>
                  <p className="text-2xl font-bold">{userProgress.completedLessons.length} 课</p>
                </div>
                <Play className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Lesson */}
        <Card className="mb-6 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{todayScenario.icon}</span>
              今日推荐课程
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  {todayScenario.name} - {todayScenario.nameChinese}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{todayScenario.description}</p>
                <p className="text-sm text-gray-500">{todayScenario.dialogues.length} 个对话 · 预计 10 分钟</p>
              </div>
              <Button size="lg" onClick={() => onNavigate("scenarios")} className="bg-blue-600 hover:bg-blue-700">
                <Play className="h-5 w-5 mr-2" />
                开始学习
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate("scenarios")}>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="text-lg font-semibold mb-2">场景对话</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">选择不同生活场景，学习实用对话</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate("vocabulary")}>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold mb-2">生词本</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">复习已保存的生词，巩固记忆</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
