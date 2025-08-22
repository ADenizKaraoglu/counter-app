import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data } = await supabase.from("workspace").select().limit(1).single();
  if (!data) {
    const editToken = crypto.randomUUID();
    await supabase.from("workspace").insert({ edit_token: editToken });
    const url = new URL(req.url);
    return new Response(
      JSON.stringify({
        readUrl: url.origin,
        editUrl: `${url.origin}/#edit=${editToken}`
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  const url = new URL(req.url);
  return new Response(
    JSON.stringify({
      readUrl: url.origin,
      editUrl: `${url.origin}/#edit=${data.edit_token}`
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
