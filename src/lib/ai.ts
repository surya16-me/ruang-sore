import { createOpenAI } from '@ai-sdk/openai'

export const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
})

export const defaultModel = openrouter(
  process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o-mini'
)
