"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { emotionData } from "@/lib/emotions"
import type { DiaryEntry } from "@/lib/types"

// Mock data for demonstration
const mockEntries: DiaryEntry[] = [
  {
    id: "1",
    content: "Today was peaceful and I felt very calm throughout the day.",
    date: new Date(2025, 3, 15),
    emotion: "calm",
    wordCount: 12,
  },
  {
    id: "2",
    content: "I felt so energized today! Got so much done.",
    date: new Date(2025, 3, 17),
    emotion: "energized",
    wordCount: 9,
  },
  {
    id: "3",
    content: "Feeling a bit down today. The weather didn't help.",
    date: new Date(2025, 3, 19),
    emotion: "sad",
    wordCount: 10,
  },
  {
    id: "4",
    content: "I'm frustrated with how things went at work today.",
    date: new Date(2025, 3, 20),
    emotion: "angry",
    wordCount: 11,
  },
  {
    id: "5",
    content: "Spent time thinking about my goals and future plans.",
    date: new Date(2025, 3, 22),
    emotion: "reflective",
    wordCount: 11,
  },
  {
    id: "6",
    content: "So thankful for my friends and family today.",
    date: new Date(2025, 3, 24),
    emotion: "grateful",
    wordCount: 9,
  },
]

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)

  // Find entry for a specific date
  const getEntryForDate = (date: Date | undefined): DiaryEntry | null => {
    if (!date) return null

    return (
      mockEntries.find(
        (entry) =>
          entry.date.getDate() === date.getDate() &&
          entry.date.getMonth() === date.getMonth() &&
          entry.date.getFullYear() === date.getFullYear(),
      ) || null
    )
  }

  // Handle date selection
  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedEntry(getEntryForDate(date))
  }

  // Custom day render function to show emotion icons
  const renderDay = (day: Date) => {
    const entry = getEntryForDate(day)
    if (!entry) return null

    const emotion = entry.emotion
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-7 w-7 flex items-center justify-center">{emotionData[emotion].icon}</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          className="border border-black/10 rounded-md p-4"
          components={{
            DayContent: ({ date }) => renderDay(date),
          }}
          modifiers={{
            hasEntry: mockEntries.map((entry) => entry.date),
          }}
          modifiersClassNames={{
            hasEntry: "bg-black/5 font-medium",
          }}
        />
      </div>

      <div>
        {selectedEntry ? (
          <Card className="border-black/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-black/5">
                  {emotionData[selectedEntry.emotion].icon}
                </div>
                <div>
                  <p className="font-medium">
                    {selectedEntry.date.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-black/60">
                    Feeling {emotionData[selectedEntry.emotion].label.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="font-serif text-lg">{selectedEntry.content}</div>

              <div className="mt-4 text-xs text-black/40">{selectedEntry.wordCount} words</div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-black/40">Select a date with an entry to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}
