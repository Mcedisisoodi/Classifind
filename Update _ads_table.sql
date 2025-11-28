-- Run this script in your Supabase SQL Editor to add support for multiple images

-- Add 'images' column to 'ads' table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ads' AND column_name = 'images') THEN
        ALTER TABLE ads ADD COLUMN images JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;
