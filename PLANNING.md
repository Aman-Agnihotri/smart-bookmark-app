# Project Planning: Smart Bookmark App

## 1. Objective

Build a modern, real-time bookmark manager that allows users to save, organize, and access their links securely. The application must be responsive, secure, and support real-time synchronization across devices.

## 2. Core Requirements Analysis

| Requirement | Solution Strategy |
| :--- | :--- |
| **Google Authentication** | Use Supabase Auth with Google OAuth provider. No email/password signup to simplify the flow. |
| **Add Bookmark** | Simple form taking URL and Title. |
| **Private Bookmarks** | Implement Row Level Security (RLS) in PostgreSQL (Supabase) to ensure data isolation. |
| **Real-time Updates** | Leverage Supabase Realtime (PostgreSQL replication) to push changes to clients instantly. |
| **Delete Bookmark** | Allow users to remove their own entries. |
| **Deployment** | Host the Next.js application on Vercel for seamless integration and performance. |

## 3. Tech Stack Selection

- **Frontend Framework**: **Next.js (App Router)**
  - *Why*: Provides server-side rendering (SSR) for performance and SEO, easy API routes for auth callbacks, and robust routing.
- **Backend / Database**: **Supabase**
  - *Why*: Offers a "Backend-as-a-Service" with built-in Auth, PostgreSQL database, and Real-time capabilities, perfectly matching the requirements.
- **Styling**: **Tailwind CSS**
  - *Why*: Utility-first class approach allows for rapid UI development and easy responsiveness.

## 4. Data Model Design

We need a single table `bookmarks` to store the data.

**Table: `bookmarks`**

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key, default `gen_random_uuid()` |
| `user_id` | UUID | Foreign Key to `auth.users`. Crucial for RLS. |
| `title` | Text | The display name of the bookmark. |
| `url` | Text | The actual link. |
| `created_at` | Timestamp | For sorting (newest first). |

## 5. Security Architecture (RLS)

Security is paramount. We will use PostgreSQL Row Level Security (RLS) to enforce privacy at the database engine level.

- **Policy 1 (SELECT)**: Users can only view rows where `user_id` matches their authenticated ID.
- **Policy 2 (INSERT)**: Users can only insert rows where `user_id` matches their authenticated ID.
- **Policy 3 (DELETE)**: Users can only delete rows where `user_id` matches their authenticated ID.

## 6. UI/UX Flow

1. **Landing / Login Page**:
    - Clean interface.
    - "Sign in with Google" button.
    - Redirects to Dashboard upon success.
2. **Dashboard (Protected Route)**:
    - **Header**: App title, User email, Sign Out button.
    - **Add Bookmark Section**: Input fields for Title and URL + "Add" button.
    - **Bookmark List**: Grid or list view of bookmarks.
        - Real-time updates (new items appear automatically).
        - Delete button on each card.

## 7. Implementation Roadmap

1. **Setup**: Initialize Next.js project and configure Tailwind.
2. **Supabase Init**: Create project, set up `bookmarks` table and RLS policies.
3. **Auth Implementation**: Configure Google OAuth and create Auth callback route.
4. **Core Features**:
    - Build `AddBookmarkForm` component.
    - Build `BookmarkList` component with data fetching.
5. **Real-time Integration**: Add Supabase Realtime subscription to `BookmarkList`.
6. **Refinement**: Styling, error handling, and loading states.
7. **Deployment**: Push to GitHub and deploy to Vercel.
