"use client"

import { useState, useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Save, AlertCircle } from "lucide-react"
import { emotionData } from "@/lib/emotions"
import { analyzeEntry } from "@/app/actions"
import type { Emotion } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EntryForm() {
  const [content, setContent] = useState("")
  const [emotion, setEmotion] = useState<Emotion | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null)
  const [apiLimited, setApiLimited] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()
  const [lastSavedContent, setLastSavedContent] = useState("")

  useEffect(() => {
    // Focus the textarea on mount
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  useEffect(() => {
    // Update word count locally for immediate feedback
    const words = content.split(/\s+/).filter((word) => word.length > 0)
    setWordCount(words.length)

    // Set up autosave
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }

    if (content.trim().length > 0 && content !== lastSavedContent) {
      const timer = setTimeout(() => {
        saveEntry()
      }, 5000) // Autosave after 5 seconds of inactivity
      setAutoSaveTimer(timer)
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer)
      }
    }
  }, [content, lastSavedContent])

  const saveEntry = async () => {
    if (content.trim().length === 0 || content === lastSavedContent) return

    setIsSaving(true)
    try {
      // Call the server action to analyze the entry
      const result = await analyzeEntry(content)

      if (result.success) {
        setEmotion(result.emotion as Emotion)
        setLastSavedContent(content)
        setApiLimited(false) // Reset API limited state on success

        toast({
          title: "Entry saved",
          description: `You're feeling ${emotionData[result.emotion as Emotion].label.toLowerCase()}`,
        })
      } else {
        setApiLimited(true)
        toast({
          title: "Entry saved with local analysis",
          description: "AI analysis unavailable. Using local analysis instead.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving entry:", error)
      setApiLimited(true)
      toast({
        title: "Error saving entry",
        description: "Using local emotion analysis instead.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-xl font-serif font-light mb-2">Today's Reflection</h2>
        <p className="text-sm text-black/60">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {apiLimited && (
        <Alert variant="outline" className="mb-6 border-black/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            AI emotion analysis is currently limited. Your entries are being analyzed using a simpler method.
          </AlertDescription>
        </Alert>
      )}

      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="How did today feel?"
          className="min-h-[300px] p-6 text-lg border-black/10 focus-visible:ring-black resize-none font-serif"
        />

        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          <span className="text-xs text-black/40">{wordCount} words</span>
          <Button
            size="icon"
            variant="outline"
            onClick={saveEntry}
            disabled={isSaving || content.trim().length === 0 || content === lastSavedContent}
            className={cn(
              "rounded-full h-10 w-10 transition-all duration-300",
              isSaving && "bg-black text-white",
              content === lastSavedContent && content.trim().length > 0 && "bg-black/5",
            )}
          >
            <Save className="h-4 w-4" />
            <span className="sr-only">Save</span>
          </Button>
        </div>
      </div>

      {emotion && (
        <div className="mt-6 flex items-center gap-2 text-sm">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-black/5">
            {emotionData[emotion].icon}
          </div>
          <div>
            <p>
              You're feeling <span className="font-medium">{emotionData[emotion].label.toLowerCase()}</span>
            </p>
            <p className="text-xs text-black/60">{emotionData[emotion].description}</p>
          </div>
        </div>
      )}
    </div>
  )
}
