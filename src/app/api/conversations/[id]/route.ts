import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { requireUser, apiError } from '@/lib/supabase/guard'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { user, error: authErr } = await requireUser(supabase)
  if (authErr) return authErr

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

  if (error) return apiError(error, 'api/conversations/[id] PATCH')

  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { user, error: authErr } = await requireUser(supabase)
  if (authErr) return authErr

  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return apiError(error, 'api/conversations/[id] DELETE')

  return new Response(null, { status: 204 })
}
