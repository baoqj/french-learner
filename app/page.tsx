"use client";

import { useState, useEffect } from "react";
import { AppProvider, useApp } from "@/contexts/app-context";
import { HomePage } from "@/components/home-page";
import { ScenarioPage } from "@/components/scenario-page";
import { DialoguePage } from "@/components/dialogue-page";
import { VocabularyPage } from "@/components/vocabulary-page";
import { initializeSpeech } from "@/utils/speech";
import Header from "@/components/header";

type Page = "home" | "scenarios" | "dialogue" | "vocabulary";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const { scenarios, setCurrentScenario, currentScenario } = useApp();

  // Initialize speech synthesis
  useEffect(() => {
    initializeSpeech();
  }, []);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleSelectScenario = (scenarioId: string) => {
    const scenario = scenarios.find((s) => s.id === scenarioId);
    if (scenario) {
      setCurrentScenario(scenario);
      setCurrentPage("dialogue");
    }
  };

  const handleBack = () => {
    if (currentPage === "dialogue") {
      setCurrentPage("scenarios");
    } else {
      setCurrentPage("home");
    }
  };

  return (
    <div className='min-h-screen'>
      <Header />

      {currentPage === "home" && <HomePage onNavigate={handleNavigate} />}

      {currentPage === "scenarios" && (
        <ScenarioPage
          onBack={handleBack}
          onSelectScenario={handleSelectScenario}
        />
      )}

      {currentPage === "dialogue" && currentScenario && (
        <DialoguePage
          dialogues={currentScenario.dialogues}
          onBack={handleBack}
        />
      )}

      {currentPage === "vocabulary" && <VocabularyPage onBack={handleBack} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
