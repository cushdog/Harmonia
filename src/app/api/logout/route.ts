import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Database } from '@/types/types_db'

export async function POST() {
  const supabase = createRouteHandlerClient<Database>({ cookies })
  await supabase.auth.signOut()
  redirect('/')
}