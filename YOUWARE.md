# YOUWARE.md

This file provides guidance to YOUWARE Agent (youware.com) when working with code in this repository.

# Project Overview

HoneySweetpot is a local classifieds web application built with vanilla HTML, CSS, and JavaScript. It uses Supabase for backend services (authentication, database, and storage).

## Architecture

- **Frontend**: Static HTML pages served directly.
  - `index.html`: Homepage with ad listings, search, and filtering.
  - `post-ad.html`: Form to post new ads with dynamic category-specific fields.
  - `ad-details.html`: Detailed view of a single ad.
  - `my-account.html`: User account management (placeholder).
  - `checkout.html`: Checkout simulation.
  - `admin.html`: Admin panel for managing ads (restricted access).
- **Styling**: `styles.css` provides global styling.
- **Logic**:
  - `app.js`: Central module for Supabase initialization, authentication functions, and shared UI logic (like updating the header based on auth state).
  - Page-specific logic is contained within `<script type="module">` blocks in each HTML file.
- **Backend**: Supabase (BaaS).
  - **Database**: PostgreSQL via Supabase.
  - **Auth**: Supabase Auth (Email/Password).
  - **Storage**: Supabase Storage for ad images.

## Development

### Prerequisites
- A web server to serve the static files (e.g., `http-server`, `Live Server` in VS Code, or `netlify dev`).
- Supabase project credentials (configured in `app.js`).

### Commands
- **Run locally**: Serve the root directory.
  ```bash
  npx http-server .
  # or
  python3 -m http.server
  ```
- **Build**: No build step is required. The project consists of static files.

## Database Schema

### Table: `ads`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid | Primary Key |
| `title` | text | Ad title |
| `description` | text | Detailed description (includes dynamic fields data) |
| `price` | numeric | Price in ZAR |
| `category` | text | Category name (e.g., "Cars", "Phones") |
| `condition` | text | Item condition |
| `location` | text | City/Town |
| `verified` | boolean | Verified status |
| `image_url` | text | Primary image URL (legacy/fallback) |
| `images` | jsonb | Array of image URLs |
| `seller_name` | text | Name of the seller |
| `contact` | text | Contact info (email/phone) |
| `created_at` | timestamptz | Creation timestamp |
| `hidden` | boolean | Visibility status (true = hidden from public) |

### Storage Buckets
- `ad-images`: Stores user-uploaded images for ads.

## Key Conventions
- **Auth**: `app.js` exports `supabaseClient` and auth helpers. Pages should import `getSession` to check auth state.
- **Admin Access**: `admin.html` is restricted to `Compsody@gmail.com`. The "Admin Panel" link in the header is dynamically injected by `app.js` for this user.
- **Dynamic Fields**: `post-ad.html` uses `<template>` elements (copied from `index.html` logic or defined inline) to render category-specific fields.
- **Navigation**: Links are standard `<a>` tags. Auth protection is handled via click event interception (e.g., on "Post Ad" button).
- **Date Formatting**: Dates are displayed relatively ("Today", "Yesterday") or as YYYY-MM-DD. Both the "Posted:" label and the date itself are styled in dark blue (`#00008B`).
