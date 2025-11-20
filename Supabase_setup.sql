-- SQL to fix Row-Level Security (RLS) issues for ClassiFind

-- 1. Setup Storage Bucket 'ad-images'
-- We attempt to insert the bucket configuration. If it exists, we do nothing.
INSERT INTO storage.buckets (id, name, public)
VALUES ('ad-images', 'ad-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies for 'ad-images'
-- Allow anyone (public) to VIEW images
DROP POLICY IF EXISTS "Public View ad-images" ON storage.objects;
CREATE POLICY "Public View ad-images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'ad-images' );

-- Allow anyone (public) to UPLOAD images
DROP POLICY IF EXISTS "Public Upload ad-images" ON storage.objects;
CREATE POLICY "Public Upload ad-images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'ad-images' );

-- 3. Database Policies for 'ads' table
-- Ensure RLS is enabled
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to READ ads
DROP POLICY IF EXISTS "Public Read Ads" ON ads;
CREATE POLICY "Public Read Ads"
ON ads FOR SELECT
USING ( true );

-- Allow anyone to INSERT (Post) ads
DROP POLICY IF EXISTS "Public Insert Ads" ON ads;
CREATE POLICY "Public Insert Ads"
ON ads FOR INSERT
WITH CHECK ( true );
