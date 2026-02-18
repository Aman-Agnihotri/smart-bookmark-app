'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useMemo, useState } from 'react'
import { Database } from '@/types/supabase'

type Bookmark = Database['public']['Tables']['bookmarks']['Row']

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching bookmarks:', error)
      } else {
        setBookmarks(data || [])
      }
      setLoading(false)
    }

    fetchBookmarks()

    const channel = supabase
      .channel('realtime bookmarks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => {
              if (prev.some((b) => b.id === payload.new.id)) return prev
              return [payload.new as Bookmark, ...prev]
            })
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((prev) =>
              prev.map((bookmark) =>
                bookmark.id === payload.new.id ? (payload.new as Bookmark) : bookmark
              )
            )
          }
        }
      )
      .subscribe()

    const handleBookmarksRefresh = () => {
      fetchBookmarks()
    }

    window.addEventListener('bookmarks:refresh', handleBookmarksRefresh)

    return () => {
      window.removeEventListener('bookmarks:refresh', handleBookmarksRefresh)
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) return

    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id)
      if (error) throw error
    } catch (error) {
      console.error('Error deleting bookmark:', error)
      alert('Error deleting bookmark')
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="h-36 animate-pulse rounded-2xl border border-[rgba(23,32,45,0.08)] bg-white/70"
          />
        ))}
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[rgba(23,32,45,0.2)] bg-[rgba(255,255,255,0.5)] px-4 py-10 text-center sm:px-6 sm:py-12">
        <p className="text-lg font-semibold text-[#17202d]">No bookmarks yet</p>
        <p className="mt-1 text-sm text-[#556274]">Use the form above to add your first saved link.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {bookmarks.map((bookmark, index) => (
        <div
          key={bookmark.id}
          className="fade-slide flex min-h-44 flex-col justify-between rounded-2xl border border-[rgba(23,32,45,0.12)] bg-[rgba(255,255,255,0.9)] p-4 shadow-[0_10px_30px_rgba(48,56,67,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(48,56,67,0.14)] sm:p-5"
          style={{ animationDelay: `${index * 40}ms` }}
        >
          <div className="mb-4 space-y-2">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[#11728c]">Bookmark</p>
            <h3 className="truncate text-lg font-semibold text-[#17202d]" title={bookmark.title}>
              {bookmark.title}
            </h3>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="clamp-2 break-all text-sm text-[#1f5d80] hover:underline"
              title={bookmark.url}
            >
              {bookmark.url}
            </a>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-[rgba(23,32,45,0.08)] pt-3">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-btn rounded-lg border border-[rgba(17,114,140,0.2)] bg-[rgba(17,114,140,0.08)] px-3 py-1.5 text-xs font-semibold text-[#0f5f76] hover:bg-[rgba(17,114,140,0.16)]"
            >
              Visit
            </a>
            <button
              onClick={() => handleDelete(bookmark.id)}
              className="primary-btn rounded-lg border border-[rgba(185,71,39,0.2)] bg-[rgba(217,93,57,0.08)] px-3 py-1.5 text-xs font-semibold text-[#b94727] hover:bg-[rgba(217,93,57,0.16)]"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
