import type { Emotion } from "./types"

// Local fallback emotion analysis function
function analyzeEmotionLocally(text: string): Emotion {
  text = text.toLowerCase()

  // Simple keyword matching for emotions
  const keywords = {
    calm: ["calm", "peaceful", "quiet", "serene", "tranquil", "relaxed", "gentle"],
    energized: ["energized", "excited", "energetic", "motivated", "active", "enthusiastic", "powerful"],
    sad: ["sad", "unhappy", "depressed", "down", "blue", "gloomy", "melancholy"],
    angry: ["angry", "frustrated", "annoyed", "irritated", "mad", "upset", "furious"],
    reflective: ["reflective", "thoughtful", "thinking", "contemplative", "pondering", "wondering", "considering"],
    grateful: ["grateful", "thankful", "appreciative", "blessed", "fortunate", "appreciate", "thanks"],
  }

  // Count occurrences of emotion keywords
  const counts: Record<Emotion, number> = {
    calm: 0,
    energized: 0,
    sad: 0,
    angry: 0,
    reflective: 0,
    grateful: 0,
  }

  // Count keyword matches
  Object.entries(keywords).forEach(([emotion, words]) => {
    words.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi")
      const matches = text.match(regex)
      if (matches) {
        counts[emotion as Emotion] += matches.length
      }
    })
  })

  // Find the emotion with the highest count
  let maxEmotion: Emotion = "reflective" // Default
  let maxCount = 0

  Object.entries(counts).forEach(([emotion, count]) => {
    if (count > maxCount) {
      maxCount = count
      maxEmotion = emotion as Emotion
    }
  })

  // If no strong emotion detected, use a heuristic based on text length and content
  if (maxCount === 0) {
    const words = text.split(/\s+/).filter((w) => w.length > 0)
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / (words.length || 1)

    // Heuristic rules
    if (text.includes("?")) return "reflective"
    if (text.includes("!")) return "energized"
    if (avgWordLength > 6) return "reflective" // Longer words often indicate thoughtfulness
    if (words.length < 10) return "calm" // Short entries might indicate calmness
    if (text.includes("i feel") || text.includes("i am")) return "reflective"
  }

  return maxEmotion
}

// Retry logic with exponential backoff
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  let retries = 0

  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options)

      // If rate limited, wait and retry
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After")
        const waitTime = retryAfter ? Number.parseInt(retryAfter) * 1000 : Math.pow(2, retries) * 1000

        console.log(`Rate limited. Retrying after ${waitTime}ms`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        retries++
        continue
      }

      return response
    } catch (error) {
      retries++
      if (retries >= maxRetries) throw error

      // Exponential backoff
      const waitTime = Math.pow(2, retries) * 1000
      console.log(`API request failed. Retrying after ${waitTime}ms`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }

  throw new Error("Max retries exceeded")
}

export async function analyzeEmotionWithAI(text: string): Promise<Emotion> {
  if (!text || text.trim().length === 0) {
    return "reflective" // Default emotion for empty text
  }

  try {
    const prompt = `
      Analyze the emotional tone of the following journal entry and categorize it into exactly one of these emotions:
      - calm (peaceful, serene, tranquil)
      - energized (powerful, dynamic, excited)
      - sad (heavy, melancholic, down)
      - angry (frustrated, intense, annoyed)
      - reflective (thoughtful, contemplative, introspective)
      - grateful (inspired, appreciative, thankful)

      Only respond with one of these exact emotion words: "calm", "energized", "sad", "angry", "reflective", or "grateful".

      Journal entry: "${text.substring(0, 1000)}"
    `

    // Try to use the OpenAI API with retry logic
    try {
      const response = await fetchWithRetry(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are an emotion analysis assistant that only responds with a single emotion word.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: 10,
            temperature: 0.3,
          }),
        },
        2, // Max retries
      )

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      const result = data.choices[0]?.message?.content || ""

      // Clean up and validate the response
      const cleanResult = result.trim().toLowerCase()

      if (cleanResult.includes("calm")) return "calm"
      if (cleanResult.includes("energized")) return "energized"
      if (cleanResult.includes("sad")) return "sad"
      if (cleanResult.includes("angry")) return "angry"
      if (cleanResult.includes("reflective")) return "reflective"
      if (cleanResult.includes("grateful")) return "grateful"

      // If OpenAI returned something unexpected, fall back to local analysis
      return analyzeEmotionLocally(text)
    } catch (apiError) {
      console.error("OpenAI API error, falling back to local analysis:", apiError)
      // Fall back to local analysis if API fails
      return analyzeEmotionLocally(text)
    }
  } catch (error) {
    console.error("Error analyzing emotion:", error)
    // Ultimate fallback
    return "reflective"
  }
}
