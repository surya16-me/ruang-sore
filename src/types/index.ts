import type { UIMessage } from 'ai'

export type { UIMessage }

export type MessageRole = 'user' | 'assistant'

export interface ChatState {
  messages: UIMessage[]
  isLoading: boolean
  error: string | null
}
