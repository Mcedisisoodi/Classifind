import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function handler(event) {

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders
    };
  }

  try {
    // ============= GET: List ads =============
    if (event.httpMethod === "GET") {
      const params = event.queryStringParameters || {};
      const category = params.category || "";
      const location = params.location || "";
      const search = params.search || "";

      let query = supabase.from("ads").select("*").order("created_at", { ascending: false }).limit(200);

      if (category) query = query.eq("category", category);
      if (location) query = query.eq("location", location);
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ ads: data })
      };
    }

    // ============= POST: Create new ad =============
    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");

      const title       = (body.title || "").trim();
      const description = (body.description || "").trim();
      const category    = (body.category || "").trim();
      const price       = body.price || 0;
      const location    = (body.location || "").trim();
      const seller_name = (body.seller_name || "").trim();
      const contact     = (body.contact || "").trim();
      const image_url   = (body.image_url || "").trim();

      if (!title || !description || !category || !location) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Missing required fields" })
        };
      }

      const { data, error } = await supabase
        .from("ads")
        .insert({
          title,
          description,
          category,
          price,
          location,
          seller_name,
          contact,
          image_url
        })
        .select()
        .single();

      if (error) throw error;

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, ad: data })
      };
    }

    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" })
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Server error" })
    };
  }
}
