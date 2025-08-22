import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function extractAppId(input: string): string {
  const match = input.match(/\/app\/(\d+)/);
  return match ? match[1] : input;
}

serve(async (req) => {
  const payload = await req.json().catch(() => null);
  if (!payload) return new Response("Invalid request", { status: 400 });

  const { url, appid, edit_token } = payload;
  const appId = extractAppId(url ?? appid);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: workspace } = await supabase
    .from("workspace")
    .select()
    .eq("edit_token", edit_token)
    .single();
  if (!workspace) return new Response("Forbidden", { status: 403 });

  // Placeholder: In real app, fetch Steam API for name and header image
  const { data, error } = await supabase
    .from("games")
    .insert({
      workspace_id: workspace.id,
      platform: "steam",
      app_id: appId,
      name: "Unknown",
      store_url: url ?? `https://store.steampowered.com/app/${appId}`
    })
    .select()
    .single();

  if (error) return new Response(error.message, { status: 500 });
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
});
