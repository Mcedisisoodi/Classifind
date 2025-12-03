-- 1. Add 'hidden' column if it doesn't exist
ALTER TABLE ads ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE;

-- 2. Add 'sold' column
ALTER TABLE ads ADD COLUMN IF NOT EXISTS sold BOOLEAN DEFAULT FALSE;

-- 3. Add 'deleted' column (Soft Delete)
ALTER TABLE ads ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;

-- 4. Add 'updated_at' column
ALTER TABLE ads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 5. Enable Row Level Security (if not already enabled)
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- 6. Admin Policy (Compsody@gmail.com) - Full Access
DROP POLICY IF EXISTS "Admin Full Access" ON ads;
CREATE POLICY "Admin Full Access" ON ads
AS PERMISSIVE
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'Compsody@gmail.com' OR auth.jwt() ->> 'email' = 'compsody@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'Compsody@gmail.com' OR auth.jwt() ->> 'email' = 'compsody@gmail.com');

-- 7. Public Read Access (Non-Hidden AND Non-Sold AND Non-Deleted)
DROP POLICY IF EXISTS "Public View Non-Hidden" ON ads;
CREATE POLICY "Public View Non-Hidden" ON ads
AS PERMISSIVE
FOR SELECT
TO public
USING (hidden IS NOT TRUE AND sold IS NOT TRUE AND deleted IS NOT TRUE);

-- 8. User Policy: Update Own Ads (includes Soft Delete and Mark Sold)
DROP POLICY IF EXISTS "Users Update Own Ads" ON ads;
CREATE POLICY "Users Update Own Ads" ON ads
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (contact ILIKE '%' || (auth.jwt() ->> 'email') || '%')
WITH CHECK (contact ILIKE '%' || (auth.jwt() ->> 'email') || '%');

-- 9. User Policy: Delete Own Ads (Hard Delete - Optional, but we keep it)
DROP POLICY IF EXISTS "Users Delete Own Ads" ON ads;
CREATE POLICY "Users Delete Own Ads" ON ads
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (contact ILIKE '%' || (auth.jwt() ->> 'email') || '%');

-- 10. Allow Authenticated Users to Insert Ads
DROP POLICY IF EXISTS "Users Insert Ads" ON ads;
CREATE POLICY "Users Insert Ads" ON ads
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 11. Allow Users to View Own Hidden/Sold/Deleted Ads
DROP POLICY IF EXISTS "Users View Own Hidden Ads" ON ads;
CREATE POLICY "Users View Own Hidden Ads" ON ads
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (contact ILIKE '%' || (auth.jwt() ->> 'email') || '%');

-- 12. Create History Table (Fix: ad_id is BIGINT to match ads.id)
DROP TABLE IF EXISTS ad_history CASCADE;
CREATE TABLE IF NOT EXISTS ad_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ad_id BIGINT REFERENCES ads(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT,
    price NUMERIC,
    category TEXT,
    condition TEXT,
    location TEXT,
    images JSONB,
    image_url TEXT,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Enable RLS on History Table
ALTER TABLE ad_history ENABLE ROW LEVEL SECURITY;

-- 14. Admin Policy for History
DROP POLICY IF EXISTS "Admin Full Access History" ON ad_history;
CREATE POLICY "Admin Full Access History" ON ad_history
AS PERMISSIVE FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' = 'Compsody@gmail.com' OR auth.jwt() ->> 'email' = 'compsody@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'Compsody@gmail.com' OR auth.jwt() ->> 'email' = 'compsody@gmail.com');

-- 15. Trigger Function to Log Changes
CREATE OR REPLACE FUNCTION log_ad_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Only log if relevant fields changed (ignore updated_at only changes if possible, but for now log all updates)
    INSERT INTO ad_history (ad_id, title, description, price, category, condition, location, images, image_url, changed_at)
    VALUES (OLD.id, OLD.title, OLD.description, OLD.price, OLD.category, OLD.condition, OLD.location, OLD.images, OLD.image_url, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. Create Trigger
DROP TRIGGER IF EXISTS on_ad_update ON ads;
CREATE TRIGGER on_ad_update
BEFORE UPDATE ON ads
FOR EACH ROW
EXECUTE FUNCTION log_ad_changes();
