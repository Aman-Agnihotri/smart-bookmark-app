import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BookmarkList from '@/components/BookmarkList'
import AddBookmarkForm from '@/components/AddBookmarkForm'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow-sm mb-8">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Smart Bookmark App</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:inline">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm font-medium transition">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 max-w-5xl">
        <div className="mb-8">
          <AddBookmarkForm />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Your Bookmarks</h2>
        <BookmarkList />
      </main>
    </div>
  )
}
