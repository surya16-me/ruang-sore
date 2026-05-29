import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ConversationSidebar } from '@/components/chat/conversation-sidebar'

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex h-full">
      <ConversationSidebar userEmail={user.email ?? ''} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
