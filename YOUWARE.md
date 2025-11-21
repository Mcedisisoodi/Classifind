# ClassiFind Project Guide

## Overview
ClassiFind is a local classifieds web application allowing users to browse, search, and post ads for various categories.

- **Current State**: Multi-page HTML/JS application bypassing the React/Vite build system in `src/`.
- **Stack**: HTML5, CSS3, Vanilla JavaScript (ES Modules), Supabase (via CDN).
- **Entry Point**: `index.html`

## Architecture
The application is split into pages sharing common logic and styles:
- **Pages**:
  - `index.html`: Home page for browsing, searching, and viewing ads.
  - `post-ad.html`: Dedicated page for creating new ads.
  - `ad-details.html`: Detailed view of a specific ad with buying options.
- **Shared Resources**:
  - `styles.css`: Global styles and responsive layout.
  - `app.js`: Supabase client initialization, Authentication logic, and shared UI helpers.

## Backend (Supabase)
- **Project URL**: `https://vmgpyjpbxfvnttnjbpsa.supabase.co`
- **Client**: Initialized via `@supabase/supabase-js@2` from `esm.sh`.
- **Database**:
  - Table: `ads`
  - Columns: `id`, `title`, `description`, `category`, `price`, `location`, `province`, `seller_name`, `contact`, `image_url`, `created_at`.
- **Storage**:
  - Bucket: `ad-images`
  - Usage: Stores user-uploaded ad images.
- **Authentication**:
  - Provider: Email/Password.
  - Logic: Handled in `app.js` (signUp, signIn, signOut, resetPassword).
  - User Metadata: Stores Name, Surname, Address, Phone, Role (Buyer/Seller), Bank Details.

## Development
- **Running**: Serve the root directory using a local server (e.g., `vite` or `python -m http.server`).
- **Deployment**: Deploy the static files (`*.html`, `*.js`, `*.css`) to any static host.

## Known Issues & Fixes
- **RLS Policies**: The `ads` table and `ad-images` bucket require Row-Level Security (RLS) policies to allow public read/write access. Use `supabase_setup.sql` to apply these policies.
- **Placeholder Images**: Uses a data URI SVG for missing images to avoid external dependency failures.

## Legacy/Template Code
The `src/` directory contains a React + TypeScript + Tailwind template ("Launch Suite") which is currently **unused** by the active application.
