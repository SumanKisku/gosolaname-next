'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function logout() {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs

  await supabase.auth.signOut({ scope: 'local' })

  revalidatePath('/', 'layout')
  redirect('/')
}


