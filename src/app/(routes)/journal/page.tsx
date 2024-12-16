import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/types_db'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import NewEntryForm from '@/Custom Components/New Entry Form/page'

export default async function JournalPage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const user = session.user
  const { data: entries, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching entries:', error)
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-2xl my-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Your Journal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <NewEntryForm />
          </CardContent>
        </Card>

        <Separator />
        
        <div className="space-y-4">
          {entries && entries.length > 0 ? (
            entries.map((entry) => (
              <Card key={entry.id} className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {format(new Date(entry.created_at), 'PPPp')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-gray-700">{entry.content}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500">No entries yet. Start writing above!</p>
          )}
        </div>
      </div>
    </main>
  )
}
