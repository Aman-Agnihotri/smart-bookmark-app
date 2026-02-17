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
    <div className="app-shell pb-10 sm:pb-14">
      <div className="ambient-orb orb-one" />
      <div className="ambient-orb orb-two" />
      <div className="ambient-orb orb-three" />

      <header className="sticky top-0 z-20 border-b border-[rgba(23,32,45,0.08)] bg-[rgba(247,242,234,0.78)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="pill">Smart Bookmark</span>
            <span className="hidden text-xs uppercase tracking-[0.08em] text-[#556274] sm:inline">Realtime Sync</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden max-w-[16rem] truncate text-sm text-[#556274] md:inline">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button className="primary-btn border border-[rgba(23,32,45,0.15)] bg-white px-3 py-2 text-sm text-[#17202d] hover:bg-[#f7f3ee] sm:px-4">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto mt-7 w-full max-w-6xl px-4 sm:mt-10 sm:px-6">
        <section className="glass-panel fade-slide mb-6 overflow-hidden p-6 sm:mb-8 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill">Your Workspace</span>
            <span className="pill">Mobile Ready</span>
          </div>
          <h1 className="hero-title gradient-heading mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Organize links with style.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#4f5b68] sm:text-base">
            Capture useful pages in seconds, keep everything tidy, and access your bookmark stream from any device.
          </p>
        </section>

        <section className="mb-8">
          <AddBookmarkForm />
        </section>

        <section className="glass-panel p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-[rgba(23,32,45,0.08)] pb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#17202d]">Your Bookmarks</h2>
              <p className="mt-1 text-sm text-[#556274]">Newest links appear first and sync in real time.</p>
            </div>
          </div>
          <BookmarkList />
        </section>
      </main>
    </div>
  )
}
