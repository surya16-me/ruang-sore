import type { UIMessage } from 'ai'

export const MAX_MESSAGES = 20

export function trimHistory(messages: UIMessage[]): UIMessage[] {
  if (messages.length <= MAX_MESSAGES) return messages
  return messages.slice(-MAX_MESSAGES)
}
