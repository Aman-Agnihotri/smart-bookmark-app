# Smart Bookmark App

A simple bookmark manager built with Next.js (App Router), Supabase, and Tailwind CSS.

## Features

- **Google Authentication**: Sign up and log in using Google (Supabase Auth).
- **Private Bookmarks**: Bookmarks are private to each user.
- **Real-time Updates**: The bookmark list updates instantly across tabs/devices (Supabase Realtime).
- **CRUD Operations**: Add and delete bookmarks.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Backend/Database**: Supabase (PostgreSQL, Auth, Realtime)
- **Styling**: Tailwind CSS

## Setup Instructions

### 1. Prerequisites

- Node.js installed.
- A Supabase account.

### 2. Installation

1. Clone the repository (or navigate to the project directory).
2. Install dependencies:

    ```bash
    npm install
    ```

### 3. Supabase Configuration

1. **Create a Project**: Go to [database.new](https://database.new) and create a new project.
2. **Database Setup**:
    - Go to the **SQL Editor** in your Supabase dashboard.
    - Copy the contents of `supabase_schema.sql` (included in this repo) and run it. This creates the `bookmarks` table, enables RLS, and sets up Realtime.
3. **Authentication**:
    - Go to **Authentication** -> **Providers**.
    - Enable **Google**.
    - You will need to set up a Google Cloud Project to get the Client ID and Secret. (Follow Supabase docs for detailed steps).
    - **Important**: Add your Vercel deployment URL (and `http://localhost:3000` for development) to the **Redirect URLs** in Supabase Auth settings.
4. **Environment Variables**:
    - Rename `example.env.local` to `.env.local`.
    - Fill in your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` from Supabase Project Settings -> API.

### 4. Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

This project is ready to be deployed on Vercel.

1. Push the code to a GitHub repository.
2. Import the project in Vercel.
3. Add the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`) in the Vercel project settings.
4. Deploy.

## Problems Encountered & Solutions

### 1. Supabase SSR in App Router

**Problem**: Next.js App Router differentiates between Server Components (RSC) and Client Components. Managing the Supabase session and cookies consistently across both was challenging.
**Solution**: Used `@supabase/ssr` package. Implemented two client creators:

- `createClient` in `utils/supabase/server.ts` for Server Components/Actions (accessing cookies directly).
- `createClient` in `utils/supabase/client.ts` for Client Components (using browser cookies).
- Added a Middleware to refresh the auth session on every request, ensuring cookies are kept up-to-date.

### 2. Real-time Updates with RLS

**Problem**: By default, Supabase Realtime might broadcast all changes or none if not configured correctly with Row Level Security (RLS). We needed users to only receive updates for _their_ bookmarks.
**Solution**:

- Enabled RLS on the `bookmarks` table.
- Added the table to the `supabase_realtime` publication (`alter publication supabase_realtime add table bookmarks;`).
- In the frontend `BookmarkList` component, subscribed to the channel. The Supabase client automatically handles passing the user's auth token, so the Realtime service respects the RLS policies (broadcasting only matching rows).

### 3. Handling Duplicate Updates

**Problem**: When a user adds a bookmark, the app fetches the updated list immediately. At the same time, the Realtime subscription receives an `INSERT` event. This race condition caused the new bookmark to appear twice in the list (once from the fetch, once from the Realtime event).
**Solution**: Modified the Realtime `INSERT` handler in `BookmarkList.tsx` to check if the incoming bookmark ID already exists in the state before adding it. This ensures that even if both updates arrive, the UI remains consistent without duplicates.
