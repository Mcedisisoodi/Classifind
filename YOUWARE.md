# ClassiFind Project Guide

## Overview
ClassiFind is a local classifieds web application allowing users to browse, search, and post ads for various categories (Cars, Phones, Property, etc.).

- **Current State**: Standalone HTML/JS application (`index.html`) bypassing the React/Vite build system in `src/`.
- **Stack**: HTML5, CSS3, Vanilla JavaScript (ES Modules), Supabase (via CDN).
- **Entry Point**: `index.html`

## Architecture
The application is contained primarily within `index.html`:
- **UI**: Custom CSS for styling, responsive grid layout.
- **Logic**: Vanilla JS handling DOM manipulation, event listeners, and Supabase interaction.
- **State**: Local state for filters (`ads` array) and Supabase for persistence.

## Backend (Supabase)
- **Project URL**: `https://vmgpyjpbxfvnttnjbpsa.supabase.co`
- **Client**: Initialized via `@supabase/supabase-js@2` from `esm.sh`.
- **Database**:
  - Table: `ads`
  - Columns: `id`, `title`, `description`, `category`, `price`, `location`, `province`, `seller_name`, `contact`, `image_url`, `created_at`.
- **Storage**:
  - Bucket: `ad-images`
  - Usage: Stores user-uploaded ad images.

## Development
- **Running**: Serve `index.html` using a local server (e.g., `vite` or `python -m http.server`).
- **Deployment**: The `index.html` can be deployed directly to any static host.

## Known Issues & Fixes
- **RLS Policies**: The `ads` table and `ad-images` bucket require Row-Level Security (RLS) policies to allow public read/write access. Use `supabase_setup.sql` to apply these policies.
- **Placeholder Images**: Uses a data URI SVG for missing images to avoid external dependency failures.

## Legacy/Template Code
The `src/` directory contains a React + TypeScript + Tailwind template ("Launch Suite") which is currently **unused** by the active `index.html` application.


