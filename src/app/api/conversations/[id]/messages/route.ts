import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { requireUser, verifyConversationOwnership, apiError } from '@/lib/supabase/guard'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { user, error: authErr } = await requireUser(supabase)
  if (authErr) return authErr

  const { error: ownerErr } = await verifyConversationOwnership(supabase, id, user.id)
  if (ownerErr) return ownerErr

  const { data, error } = await supabase
    .from('messages')
    .select('id, role, content, created_at')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  if (error) return apiError(error, 'api/conversations/[id]/messages GET')

  return NextResponse.json(data)
}

export async function POST(req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { user, error: authErr } = await requireUser(supabase)
  if (authErr) return authErr

  const { error: ownerErr } = await verifyConversationOwnership(supabase, id, user.id)
  if (ownerErr) return ownerErr

  const body = await req.json() as { role: 'user' | 'assistant'; content: string }
  const { role, content } = body

  if (!role || !content) {
    return NextResponse.json({ error: 'Missing role or content' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: id, role, content })
    .select('id, role, content, created_at')
    .single()

  if (error) return apiError(error, 'api/conversations/[id]/messages POST')

  return NextResponse.json(data, { status: 201 })
}
