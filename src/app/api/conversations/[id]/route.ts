import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

// PATCH /api/conversations/[id] — rename a conversation
export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as { title: string }
  if (!body.title) {
    return NextResponse.json({ error: 'Missing title' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('conversations')
    .update({ title: body.title })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, title, updated_at')
    .single()

  if (error) {
    console.error('[api/conversations/[id] PATCH]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE /api/conversations/[id] — delete a conversation and its messages
export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('[api/conversations/[id] DELETE]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }

  return new Response(null, { status: 204 })
}
