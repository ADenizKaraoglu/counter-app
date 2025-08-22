import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: games } = await supabase
    .from("games")
    .select("id")
    .limit(50);

  for (const g of games ?? []) {
    const now = new Date().toISOString();
    await supabase.from("game_updates").insert({
      game_id: g.id,
      source: "unknown",
      title: "Refreshed",
      url: null,
      published_at: now
    });
    await supabase.from("game_latest_cache").upsert({
      game_id: g.id,
      last_update_at: now,
      last_update_title: "Refreshed",
      last_update_url: null,
      last_checked_at: now,
      source: "unknown"
    });
  }

  return new Response("ok");
});
