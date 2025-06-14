"use client"

import { useApp } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Play } from "lucide-react"

interface ScenarioPageProps {
  onBack: () => void
  onSelectScenario: (scenarioId: string) => void
}

export function ScenarioPage({ onBack, onSelectScenario }: ScenarioPageProps) {
  const { scenarios } = useApp()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">选择学习场景</h1>
          <div></div>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className="hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => onSelectScenario(scenario.id)}
            >
              <CardHeader className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{scenario.icon}</div>
                <CardTitle className="text-xl">
                  <div className="text-blue-600 dark:text-blue-400">{scenario.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-normal">
                    {scenario.nameChinese} / {scenario.nameEnglish}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{scenario.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{scenario.dialogues.length} 个对话</span>
                  <Button size="sm" className="group-hover:bg-blue-600">
                    <Play className="h-4 w-4 mr-1" />
                    开始学习
                  </Button>
                </div>
                {scenario.progress > 0 && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${scenario.progress}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">进度: {scenario.progress}%</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
