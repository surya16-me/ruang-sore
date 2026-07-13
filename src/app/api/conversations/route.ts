import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { requireUser, apiError } from '@/lib/supabase/guard'
import { rateLimit } from '@/lib/rate-limit'

export async function GET() {
  const supabase = await createClient()
  const { user, error: authErr } = await requireUser(supabase)
  if (authErr) return authErr

  const { data, error } = await supabase
    .from('conversations')
    .select('id, title, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) return apiError(error, 'api/conversations GET')

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { user, error: authErr } = await requireUser(supabase)
  if (authErr) return authErr

  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const { allowed } = rateLimit(`conv:${user.id}:${ip}`, 10, 60000)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await req.json() as { title?: string }
  const title = body.title ?? 'Percakapan baru'

  const { data, error } = await supabase
    .from('conversations')
    .insert({ user_id: user.id, title })
    .select('id, title, created_at, updated_at')
    .single()

  if (error) return apiError(error, 'api/conversations POST')

  return NextResponse.json(data, { status: 201 })
}
