'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/types_db'
import { revalidatePath } from 'next/cache'

export async function createJournalEntry(content: string) {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Not authenticated')
  }

  const user = session.user
  const { error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: user.id,
      content,
    })

  if (error) {
    console.error(error)
    throw new Error('Failed to create journal entry')
  }

  // Revalidate the page to show the new entry
  revalidatePath('/journal')
}
