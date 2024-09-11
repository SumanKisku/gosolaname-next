import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import NavBar from '@/components/NavBar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Campaigns from '@/components/Campaings'

export default async function DashboardPage() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div>
      <NavBar initialUser={data.user} />
      <div className="flex justify-center items-center mt-3">
        <Link href='/dashboard/create-campaign'>
          <Button size="lg">
            Create Campaign
          </Button>
        </Link>
      </div>
      <div>
        <Campaigns />
      </div>
    </div>
  )
}
