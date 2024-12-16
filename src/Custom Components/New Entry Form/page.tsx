'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createJournalEntry } from '@/app/actions/journal/actions'

export default function NewEntryForm() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await createJournalEntry(content)
      setContent('')
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      console.error(err)
      setError('Failed to create entry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="space-y-2">
        <Label htmlFor="journal-entry">Write a new entry</Label>
        <Textarea
          id="journal-entry"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="resize-none"
          rows={5}
        />
      </div>
      <Button type="submit" disabled={loading || !content.trim()} className="w-full">
        {loading ? 'Saving...' : 'Add Entry'}
      </Button>
    </form>
  )
}
