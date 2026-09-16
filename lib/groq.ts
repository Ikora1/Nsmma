import OpenAI from "openai"

export function getGroqClient(): OpenAI {
  const apiKey = process.env.GROQ_API_KEY || ""
  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  })
}

export const groq = getGroqClient()

