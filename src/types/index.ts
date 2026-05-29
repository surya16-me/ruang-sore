import type { UIMessage } from 'ai'

export type { UIMessage }

export type MessageRole = 'user' | 'assistant'

export interface ChatState {
  messages: UIMessage[]
  isLoading: boolean
  error: string | null
}

export interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
}
