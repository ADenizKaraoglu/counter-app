import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const payload = await req.json().catch(() => null);
  const game_id = payload?.game_id;
  if (!game_id) return new Response("Invalid request", { status: 400 });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Placeholder: In real app fetch Steam news
  const now = new Date().toISOString();
  await supabase.from("game_updates").insert({
    game_id,
    source: "unknown",
    title: "Refreshed",
    url: null,
    published_at: now
  });

  await supabase.from("game_latest_cache").upsert({
    game_id,
    last_update_at: now,
    last_update_title: "Refreshed",
    last_update_url: null,
    last_checked_at: now,
    source: "unknown"
  });

  return new Response("ok");
});
