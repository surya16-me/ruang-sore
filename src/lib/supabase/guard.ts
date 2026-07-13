import { createClient } from './server'
import { NextResponse } from 'next/server'

export async function requireUser(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return { user: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { user, error: null }
}

export async function verifyConversationOwnership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  conversationId: string,
  userId: string
) {
  const { data: conv, error } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .eq('user_id', userId)
    .single()

  if (error || !conv) {
    return { conversation: null, error: NextResponse.json({ error: 'Not found' }, { status: 404 }) }
  }
  return { conversation: conv, error: null }
}

export function apiError(err: unknown, label: string) {
  console.error(`[${label}]`, err)
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
}
