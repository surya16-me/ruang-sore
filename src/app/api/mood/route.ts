import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { requireUser, apiError } from '@/lib/supabase/guard'

export async function GET() {
  const supabase = await createClient()
  const { user, error: authErr } = await requireUser(supabase)
  if (authErr) return authErr

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data, error } = await supabase
    .from('mood_entries')
    .select('mood, created_at')
    .eq('user_id', user.id)
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  if (error) return apiError(error, 'api/mood GET')

  const grouped: Record<string, number> = {}
  for (const entry of data) {
    const date = new Date(entry.created_at).toISOString().slice(0, 10)
    grouped[date] = entry.mood
  }

  const result = Object.entries(grouped).map(([date, mood]) => ({ date, mood }))
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { user, error: authErr } = await requireUser(supabase)
  if (authErr) return authErr

  const body = await req.json() as { mood: number }
  const { mood } = body

  if (!mood || mood < 1 || mood > 4) {
    return NextResponse.json({ error: 'Invalid mood value (1-4)' }, { status: 400 })
  }

  const { error } = await supabase
    .from('mood_entries')
    .insert({ user_id: user.id, mood })

  if (error) return apiError(error, 'api/mood POST')

  return NextResponse.json({ success: true }, { status: 201 })
}
