# Co-Op Tracker

Co-Op Tracker is a shared list of multiplayer games that tracks the most recent patch notes. The project uses React, TypeScript, Vite, Tailwind and shadcn/ui on the frontend and Supabase Postgres with Edge Functions on the backend.

## Project structure

```
web/        # React app
functions/  # Supabase Edge Functions
supabase/   # Database schema and migrations
```

## Supabase setup

1. Create a Supabase project and retrieve the project URL and anon key.
2. Enable Row Level Security on all tables (handled in migrations).
3. Run the migration:
   ```sh
   supabase db push
   ```
4. Deploy Edge Functions:
   ```sh
   supabase functions deploy --project-ref <PROJECT_ID>
   ```
5. Generate the workspace and edit token by calling the `create_workspace_if_missing` function. The response returns both the read URL and the edit URL containing the token.

## Development

```sh
pnpm install
pnpm run dev
```

## Environment variables

Copy `.env.example` to `.env` and set the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Deployment

GitHub Actions are configured to build and deploy the frontend to GitHub Pages and the Edge Functions via the Supabase CLI. Provide `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT` as repository secrets.

## Limits

- Only one workspace is supported.
- Maximum of 50 games.
- Update refresh logic in functions is placeholder and should be extended to call Steam APIs.
