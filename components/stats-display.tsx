"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { emotionData } from "@/lib/emotions"
import type { Emotion } from "@/lib/types"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for demonstration
const mockWordCountData = [
  { date: "Apr 15", count: 120 },
  { date: "Apr 16", count: 150 },
  { date: "Apr 17", count: 90 },
  { date: "Apr 18", count: 200 },
  { date: "Apr 19", count: 180 },
  { date: "Apr 20", count: 220 },
  { date: "Apr 21", count: 130 },
  { date: "Apr 22", count: 170 },
  { date: "Apr 23", count: 190 },
  { date: "Apr 24", count: 210 },
]

const mockEmotionData = [
  { emotion: "calm", count: 5 },
  { emotion: "energized", count: 3 },
  { emotion: "sad", count: 2 },
  { emotion: "angry", count: 1 },
  { emotion: "reflective", count: 4 },
  { emotion: "grateful", count: 3 },
]

export default function StatsDisplay() {
  const totalEntries = mockWordCountData.length
  const totalWords = mockWordCountData.reduce((sum, item) => sum + item.count, 0)
  const avgWordsPerEntry = Math.round(totalWords / totalEntries)

  // Find most common emotion
  const mostCommonEmotion = [...mockEmotionData].sort((a, b) => b.count - a.count)[0].emotion as Emotion

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="border-black/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-light">Writing Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-xs text-black/60">Total Entries</p>
              <p className="text-2xl font-serif">{totalEntries}</p>
            </div>
            <div>
              <p className="text-xs text-black/60">Total Words</p>
              <p className="text-2xl font-serif">{totalWords}</p>
            </div>
            <div>
              <p className="text-xs text-black/60">Avg Words</p>
              <p className="text-2xl font-serif">{avgWordsPerEntry}</p>
            </div>
          </div>

          <div className="h-[200px]">
            <ChartContainer
              config={{
                count: {
                  label: "Word Count",
                  color: "hsl(0, 0%, 0%)",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockWordCountData}>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="count" strokeWidth={2} stroke="var(--color-count)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-black/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-light">Emotion Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-xs text-black/60">Most Common Emotion</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-black/5">
                {emotionData[mostCommonEmotion].icon}
              </div>
              <p className="text-lg font-serif">{emotionData[mostCommonEmotion].label}</p>
            </div>
          </div>

          <div className="space-y-4">
            {mockEmotionData.map((item) => (
              <div key={item.emotion} className="flex items-center gap-3">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-black/5">
                  {emotionData[item.emotion as Emotion].icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">{emotionData[item.emotion as Emotion].label}</p>
                    <p className="text-xs text-black/60">{item.count} entries</p>
                  </div>
                  <div className="h-1 w-full bg-black/5 mt-1">
                    <div className="h-full bg-black" style={{ width: `${(item.count / totalEntries) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
