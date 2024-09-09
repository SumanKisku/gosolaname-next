import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { logout } from '../(authentication)/logout/actions'

export default async function DashboardPage() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div>
      <p>Hello {data.user.email}</p>
      <form action={logout}>
        <button>Sign out</button>
      </form>
    </div>
  )
}
