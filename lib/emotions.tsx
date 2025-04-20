import { Moon, Zap, Cloud, Flame, CloudIcon, Sparkles } from "lucide-react"
import type { Emotion, EmotionData } from "./types"

export const emotionData: Record<Emotion, EmotionData> = {
  calm: {
    emotion: "calm",
    icon: <Moon className="h-4 w-4" />,
    label: "Calm",
    description: "Peaceful and serene",
  },
  energized: {
    emotion: "energized",
    icon: <Zap className="h-4 w-4" />,
    label: "Energized",
    description: "Powerful and dynamic",
  },
  sad: {
    emotion: "sad",
    icon: <Cloud className="h-4 w-4" />,
    label: "Sad",
    description: "Heavy and melancholic",
  },
  angry: {
    emotion: "angry",
    icon: <Flame className="h-4 w-4" />,
    label: "Angry",
    description: "Frustrated and intense",
  },
  reflective: {
    emotion: "reflective",
    icon: <CloudIcon className="h-4 w-4" />,
    label: "Reflective",
    description: "Thoughtful and contemplative",
  },
  grateful: {
    emotion: "grateful",
    icon: <Sparkles className="h-4 w-4" />,
    label: "Grateful",
    description: "Inspired and appreciative",
  },
}

// Utility function to count words in text
export function getWordCount(text: string): number {
  return text.split(/\s+/).filter((word) => word.length > 0).length
}
