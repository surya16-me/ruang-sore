import { streamText, convertToModelMessages } from 'ai'
import { readFileSync } from 'fs'
import { join } from 'path'
import { defaultModel } from '@/lib/ai'
import { trimHistory } from '@/lib/memory'
import type { UIMessage } from 'ai'

const systemPrompt = readFileSync(
  join(process.cwd(), 'prompts/AGENT.md'),
  'utf-8'
)

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json()
    const modelMessages = await convertToModelMessages(trimHistory(messages))
    const result = streamText({
      model: defaultModel,
      system: systemPrompt,
      messages: modelMessages,
    })
    return result.toUIMessageStreamResponse()
  } catch (err) {
    console.error('[chat/route]', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
