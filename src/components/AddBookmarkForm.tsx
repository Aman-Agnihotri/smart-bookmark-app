'use client'

import { createClient } from '@/utils/supabase/client'
import { useMemo, useState } from 'react'

export default function AddBookmarkForm() {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !url) return

    setLoading(true)
    try {
      const { error } = await supabase.from('bookmarks').insert([{ title, url }])
      if (error) throw error

      window.dispatchEvent(new Event('bookmarks:refresh'))

      setTitle('')
      setUrl('')
    } catch (error) {
      console.error('Error adding bookmark:', error)
      alert('Error adding bookmark')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel fade-slide space-y-5 p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#17202d] sm:text-2xl">Add New Bookmark</h2>
          <p className="mt-1 text-sm text-[#556274]">Save a link and it appears instantly in your collection.</p>
        </div>
        <span className="pill">Quick Add</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-[#3f4955]">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-[rgba(23,32,45,0.15)] bg-white px-3.5 py-2.5 text-sm text-[#17202d] outline-none transition focus:border-[#11728c] focus:ring-2 focus:ring-[rgba(17,114,140,0.2)]"
            placeholder="e.g., Google"
            required
          />
        </div>

        <div className="md:col-span-1">
          <label className="mb-1.5 block text-sm font-medium text-[#3f4955]">URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-xl border border-[rgba(23,32,45,0.15)] bg-white px-3.5 py-2.5 text-sm text-[#17202d] outline-none transition focus:border-[#11728c] focus:ring-2 focus:ring-[rgba(17,114,140,0.2)]"
            placeholder="https://google.com"
            required
          />
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[#556274]">Tip: include full URL with `https://` for reliable opening.</p>
        <button
          type="submit"
          disabled={loading}
          className="primary-btn w-full bg-[#d95d39] px-5 py-2.5 text-white hover:bg-[#b94727] disabled:opacity-60 sm:w-auto"
        >
          {loading ? 'Adding...' : 'Add Bookmark'}
        </button>
      </div>
    </form>
  )
}
