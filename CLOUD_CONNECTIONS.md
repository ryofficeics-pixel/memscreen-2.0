# CLOUD CONNECTIONS

Date checked: 2026-05-30  
Repository: `https://github.com/ryofficeics-pixel/memscreen-2.0`

## GitHub

Status: connected

- Local remote: `origin`
- Fetch URL: `https://github.com/ryofficeics-pixel/memscreen-2.0.git`
- Push URL: `https://github.com/ryofficeics-pixel/memscreen-2.0.git`
- Branch: `main`
- Local branch tracks: `origin/main`

Use this repo as the source of truth when moving computers or deploying to a server.

## Supabase

Status: account/project found, app not wired to Supabase yet

Connected Supabase organization:

- Organization name: `ryofficeics-pixel's Org`
- Organization ID: `frmcynuupbdbjypqumxi`

Available Supabase project:

- Project name: `ryofficeics-pixel's Project`
- Project ref: `crrtfddcnnqstxyoeoek`
- Region: `ap-southeast-1`
- Database host: `db.crrtfddcnnqstxyoeoek.supabase.co`
- Status: `ACTIVE_HEALTHY`
- Edge Functions: none

Current local app state:

- The app currently uses SQLite through `DATABASE_URL=./data/screener.db`.
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are available in the env schema but are not set locally.
- No `PostgresRepository` is implemented yet.

To actually use Supabase as the runtime database, implement a Postgres repository matching the existing repository interface, then set production database credentials in `.env` or the deployment provider.

Required private values to store outside git:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Postgres connection string if using direct database access

Security note:

- Supabase advisor reported leaked password protection is disabled for Supabase Auth.
- This project does not currently use Supabase Auth, but enable leaked password protection before adding user accounts.

## Vercel

Status: Vercel team found, no matching Vercel project linked to this repo yet

Connected Vercel team:

- Team name: `Estora v1`
- Team slug: `estora-v1`
- Team ID: `team_K09Ysw8cGS8K4P73TmuIqDpN`

Existing Vercel projects checked:

| Project | Project ID | Match |
|---|---|---|
| `ics-tools-hub` | `prj_qKKPgqfb1vfUEeAlbtxW71aoM8Zt` | no |
| `ics-office-tools` | `prj_5ntYDsBVKIQfkMpe3MAgMClO7Y3g` | no |
| `roi-simulator-by-hunios` | `prj_q6dMSMWFPP68T1NJA67eOqCVRpt6` | no |
| `ops-ics-v1` | `prj_xRTDwKkVMx0HxdSyMKhp6JnSap9U` | no |

Current local app state:

- No `.vercel/project.json` exists.
- No `vercel.json` exists.
- This repo is not linked to a Vercel project locally.
- The app is currently designed as a long-running Fastify server with SQLite, which fits VPS/PM2 better than Vercel serverless without adaptation.

Recommended Vercel path:

1. Create a new Vercel project named `memscreen-2-0` or `memscreen-2`.
2. Import from GitHub repo `ryofficeics-pixel/memscreen-2.0`.
3. Decide whether Vercel is only for the dashboard/API preview or production.
4. If using Vercel for production, replace local SQLite persistence with hosted Postgres/Supabase and adapt the server entrypoint for Vercel.

Required Vercel values if linked later:

- Vercel team: `team_K09Ysw8cGS8K4P73TmuIqDpN`
- Vercel project ID, after project creation
- Runtime env vars from `.env.production.example`

## Current Recommendation

For the current project phase, use:

- GitHub for source control and computer handoff
- VPS/PM2 for 24/7 screener runtime
- Supabase only after adding the Postgres repository
- Vercel only after deciding whether to adapt this Fastify/SQLite app for serverless deployment

