# YOUWARE.md

This file provides guidance to YOUWARE Agent (youware.com) when working with code in this repository.

# ClassiFind Project Guide

## Overview
ClassiFind is a local classifieds web application allowing users to browse, search, and post ads for various categories.

- **Stack**: HTML5, CSS3, Vanilla JavaScript (ES Modules), Supabase (via CDN).
- **Entry Point**: `index.html`

## Architecture
The application is split into pages sharing common logic and styles:
- **Pages**:
  - `index.html`: Home page for browsing, searching, and viewing ads.
  - `post-ad.html`: Dedicated page for creating new ads.
  - `ad-details.html`: Detailed view of a specific ad with buying options.
  - `checkout.html`: Secure checkout page with delivery address and payment options.
- **Shared Resources**:
  - `styles.css`: Global styles and responsive layout.
  - `app.js`: Supabase client initialization, Authentication logic, and shared UI helpers.

## Backend (Supabase)
- **Project URL**: `https://vmgpyjpbxfvnttnjbpsa.supabase.co`
- **Client**: Initialized via `@supabase/supabase-js@2` from `esm.sh`.
- **Database**:
  - Table: `ads`
  - Columns: `id`, `title`, `description`, `category`, `price`, `location`, `province`, `seller_name`, `contact`, `image_url`, `created_at`, `images` (JSONB), `condition` (TEXT), `verified` (BOOLEAN).
- **Storage**:
  - Bucket: `ad-images`
  - Usage: Stores user-uploaded ad images.
- **Authentication**:
  - Provider: Email/Password.
  - Logic: Handled in `app.js` (signUp, signIn, signOut, resetPassword).

## Development
- **Running**: Serve the root directory using a local server (e.g., `python3 -m http.server`).
- **Deployment**: Deploy the static files (`*.html`, `*.js`, `*.css`) to any static host.

## Key Features
- **Image Slideshow**: `ad-details.html` features a custom touch-friendly slideshow with zoom and pan capabilities.
- **Secure Checkout**: `checkout.html` simulates a checkout flow with address validation and payment method selection.
- **Filtering**: `index.html` supports filtering by category, price range, location, condition, and seller verification.

## Known Issues & Fixes
- **RLS Policies**: The `ads` table and `ad-images` bucket require Row-Level Security (RLS) policies.
- **Placeholder Images**: Uses a data URI SVG for missing images.
