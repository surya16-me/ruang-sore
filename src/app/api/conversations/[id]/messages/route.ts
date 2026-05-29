import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

// GET /api/conversations/[id]/messages — load messages for a conversation
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify ownership via RLS (conversation must belong to user)
  const { data: conv } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!conv) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('messages')
    .select('id, role, content, created_at')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[api/conversations/[id]/messages GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/conversations/[id]/messages — persist messages after AI responds
export async function POST(req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify ownership
  const { data: conv } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!conv) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

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

  if (error) {
    console.error('[api/conversations/[id]/messages POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
