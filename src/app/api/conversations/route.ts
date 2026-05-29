import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/conversations — list all conversations for the logged-in user
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('id, title, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('[api/conversations GET]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST /api/conversations — create a new conversation
export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as { title?: string }
  const title = body.title ?? 'Percakapan baru'

  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: user.id, title })
    .select('id, title, created_at, updated_at')
    .single()

  if (error) {
    console.error('[api/conversations POST]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
