"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { Scenario, Word, UserProgress, SpeechSettings } from "@/types";
import { scenarios } from "@/data/scenarios";
import { auth } from "@/lib/firebase"; // 导入你的 Firebase auth 实例
import { User, signOut } from "firebase/auth"; // 导入 User 类型和 signOut 函数

interface AppContextType {
  scenarios: Scenario[];
  currentScenario: Scenario | null;
  setCurrentScenario: (scenario: Scenario) => void;
  savedWords: Word[];
  addWordToVocabulary: (word: Word) => void;
  removeWordFromVocabulary: (wordId: string) => void;
  isWordSaved: (wordId: string) => boolean;
  userProgress: UserProgress;
  updateProgress: (scenarioId: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  speechSettings: SpeechSettings;
  updateSpeechSettings: (settings: Partial<SpeechSettings>) => void;
  user: User | null; // 增加 user 状态
  logout: () => Promise<void>; // 增加 logout 函数
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [savedWords, setSavedWords] = useState<Word[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    currentScenario: "",
    completedLessons: [],
    savedWords: [],
    dailyStreak: 1,
  });
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>({
    followAlong: true,
    rate: 0.75,
  });
  const [user, setUser] = useState<User | null>(null); // 初始化 user 状态

  // 加载本地存储数据
  useEffect(() => {
    const savedData = localStorage.getItem("french-learner-data");
    if (savedData) {
      try {
        // 添加 try-catch 块处理 JSON 解析错误
        const data = JSON.parse(savedData);
        setSavedWords(data.savedWords || []);
        // 注意：这里我们不从 localStorage 加载 userProgress 的用户相关部分，因为用户状态由 Firebase 管理
        // 如果你需要同步用户相关的进度，你需要在用户登录后从数据库加载
        setUserProgress((prev) => ({
          ...prev, // 保留非用户相关的进度信息
          completedLessons: data.userProgress?.completedLessons || [],
          dailyStreak: data.userProgress?.dailyStreak || 1,
          // savedWords 在上面已经单独处理了
        }));
        setDarkMode(data.darkMode || false);
        setSpeechSettings(data.speechSettings || speechSettings);
      } catch (error) {
        console.error("Failed to parse localStorage data:", error);
        // 可选：清除无效的 localStorage 数据
        // localStorage.removeItem("french-learner-data");
      }
    }

    // 监听 Firebase Authentication 状态变化
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // 更新 user 状态
      // 当用户登录时，你可能需要从数据库加载用户相关的进度数据
      if (user) {
        // TODO: 从数据库加载用户相关的 userProgress 数据
        console.log("User logged in:", user);
      } else {
        // 用户注销时，可以重置用户相关的状态
        setUserProgress((prev) => ({
          ...prev,
          currentScenario: "",
          completedLessons: [],
          // savedWords 保留本地存储的，或者根据需求清空/同步数据库
        }));
        console.log("User logged out");
      }
    });

    // 清理监听器
    return () => unsubscribe();
  }, []); // 空依赖数组确保只在组件挂载时运行一次

  // 保存数据到本地存储
  useEffect(() => {
    // 注意：这里我们不保存 userProgress 的用户相关部分到 localStorage
    const dataToSave = {
      savedWords,
      userProgress: {
        // 只保存非用户相关的 userProgress 部分
        completedLessons: userProgress.completedLessons,
        dailyStreak: userProgress.dailyStreak,
      },
      darkMode,
      speechSettings,
    };
    localStorage.setItem("french-learner-data", JSON.stringify(dataToSave));
  }, [
    savedWords,
    userProgress.completedLessons,
    userProgress.dailyStreak,
    darkMode,
    speechSettings,
  ]); // 依赖项更精确

  const addWordToVocabulary = (word: Word) => {
    if (!savedWords.find((w) => w.id === word.id)) {
      setSavedWords((prev) => [...prev, word]);
      // TODO: 如果用户已登录，同步到数据库
    }
  };

  const removeWordFromVocabulary = (wordId: string) => {
    setSavedWords((prev) => prev.filter((w) => w.id !== wordId));
    // TODO: 如果用户已登录，同步到数据库
  };

  const isWordSaved = (wordId: string) => {
    return savedWords.some((w) => w.id === wordId);
  };

  const updateProgress = (scenarioId: string) => {
    setUserProgress((prev) => {
      const updatedCompletedLessons = prev.completedLessons.includes(scenarioId)
        ? prev.completedLessons
        : [...prev.completedLessons, scenarioId];
      return {
        ...prev,
        currentScenario: scenarioId,
        completedLessons: updatedCompletedLessons,
      };
    });
    // TODO: 如果用户已登录，同步到数据库
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const updateSpeechSettings = (settings: Partial<SpeechSettings>) => {
    setSpeechSettings((prev) => ({
      ...prev,
      ...settings,
    }));
    // TODO: 如果用户已登录，同步到数据库
  };

  // 实现注销函数
  const logout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged 会处理 user 状态的更新
      // 你也可以在这里进行其他清理工作，例如清空用户相关的数据
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        scenarios, // 假设 scenarios 是从 scenarios.ts 导入的静态数据
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
        user, // 导出 user
        logout, // 导出 logout 函数
      }}
    >
      <div className={darkMode ? "dark" : ""}>{children}</div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
