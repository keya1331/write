"use server"

import { analyzeEmotionWithAI } from "@/lib/openai"
import { getWordCount } from "@/lib/emotions"

export async function analyzeEntry(content: string) {
  try {
    // Analyze the emotion using OpenAI with fallback
    const emotion = await analyzeEmotionWithAI(content)

    // Calculate word count
    const wordCount = getWordCount(content)

    // In a real app, you would save the entry to a database here

    return {
      success: true,
      emotion,
      wordCount,
      date: new Date().toISOString(),
      isAIAnalysis: true, // Flag to indicate if AI was used
    }
  } catch (error) {
    console.error("Error in analyzeEntry:", error)
    return {
      success: false,
      error: "Failed to analyze entry",
    }
  }
}
