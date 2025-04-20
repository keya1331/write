import type React from "react"
export type Emotion = "calm" | "energized" | "sad" | "angry" | "reflective" | "grateful"

export interface DiaryEntry {
  id: string
  content: string
  date: Date
  emotion: Emotion
  wordCount: number
}

export interface EmotionData {
  emotion: Emotion
  icon: React.ReactNode
  label: string
  description: string
}
