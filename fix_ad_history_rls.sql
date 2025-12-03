CREATE OR REPLACE FUNCTION log_ad_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Only log if relevant fields changed (ignore updated_at only changes if possible, but for now log all updates)
    INSERT INTO ad_history (ad_id, title, description, price, category, condition, location, images, image_url, changed_at)
    VALUES (OLD.id, OLD.title, OLD.description, OLD.price, OLD.category, OLD.condition, OLD.location, OLD.images, OLD.image_url, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
