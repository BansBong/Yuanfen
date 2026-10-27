# Yuanfen

**Your bridge to China, guided by fate.** (缘分) · [yuanfenbridge.com](https://yuanfenbridge.com)

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · next-intl (EN / ID) · Supabase.

> Spelling rules: the company is **Yuanfen** (one n). The domain is **yuanfenbridge.com**. Never add a second "n".

---

## 1. What this project is

| Mode | What visitors see |
| --- | --- |
| `coming-soon` (default) | **Every** public URL shows the Coming Soon page (English or Indonesian, from the browser language). Only `/admin` and `/login` stay reachable, so the team can prepare. |
| `live` | The full website under `/en/...` and `/id/...`. The Coming Soon page is retired. |
| Vercel **preview** deployments | Always the full site, marked `noindex`, so the team can review it before launch. |

The mode is one environment variable: `NEXT_PUBLIC_SITE_MODE`.

## 2. Run it locally

```bash
npm install
cp .env.example .env.local      # then edit it
npm run dev                      # http://localhost:3000
```

- `NEXT_PUBLIC_SITE_MODE=coming-soon` → you see the Coming Soon page at `/`.
- `NEXT_PUBLIC_SITE_MODE=live` → you see the full site (`/` redirects to `/en` or `/id`). **Restart `npm run dev` after changing it.**
- Without Supabase variables the site still runs. Forms accept submissions and print them to the terminal (development only). `/admin` shows "not connected".

Useful scripts:

| Command | Does |
| --- | --- |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` · `npm run typecheck` | Checks |
| `npm run check:placeholders` | Lists every placeholder still in the project (see `PLACEHOLDERS.md`) |

## 3. Launch day: switching from Coming Soon to the full site (10 November 2026)

`NEXT_PUBLIC_*` variables are **baked in at build time**. Changing the value is not enough; you must **redeploy**.

1. **Before launch day:** run `npm run check:placeholders` and finish everything in `PLACEHOLDERS.md`. Make sure Supabase is set up (section 5) and you have submitted a test request on a preview deployment.
2. In Vercel open **Project → Settings → Environment Variables**.
3. Add or edit `NEXT_PUBLIC_SITE_MODE` = `live`, scope **Production** only. Leave Preview alone (previews always show the full site).
4. Open **Deployments**, choose the latest Production deployment, click **⋯ → Redeploy**. (Or push any commit to `main`.)
5. When the build finishes, check on `https://yuanfenbridge.com`:
   - `/` redirects to `/en` or `/id` and shows the full site.
   - View source: `<meta name="robots" content="index, follow">`.
   - `https://yuanfenbridge.com/robots.txt` and `/sitemap.xml` list the localized pages.
   - Submit one real test request and see it in `/admin`.
6. In Google Search Console, submit `https://yuanfenbridge.com/sitemap.xml`.
7. **Roll back** if needed: set `NEXT_PUBLIC_SITE_MODE` back to `coming-soon` and redeploy.

While in `coming-soon` mode, only the bare home URL is indexable; every other URL carries `X-Robots-Tag: noindex`. The full site is `noindex` everywhere until `live` on production.

## 4. Languages (English and Indonesian)

- URLs: `/en/...` and `/id/...`. The language comes from the saved choice, then the browser's `Accept-Language` (Indonesian → `id`), otherwise English.
- **All copy lives in `messages/<locale>/<namespace>.json`.** Form questions live in `src/data/forms.ts`, trips in `src/data/trips.ts`, destinations in `src/data/destinations.ts` (all bilingual).
- All copy is **draft** and needs review by a human (see `PLACEHOLDERS.md`). The Indonesian copy is written for Indonesians travelling to China; the English copy is written for international travelers (not a literal translation).
- SEO per page: localized title/description, canonical, `hreflang` alternates, Open Graph, JSON-LD `Organization` (home), localized sitemap.

## 5. Supabase (admin + saving requests)

Use a **fresh** Supabase project, separate from your other projects.

1. **Create the project** at supabase.com. Note the *Project URL*, the *anon public key* and the *service_role key* (Project Settings → API).
2. **Create the tables:** SQL Editor → New query → paste all of `supabase/schema.sql` → Run. It is safe to run again.
3. **Turn off public sign-up:** Authentication → Sign In / Providers → switch **Allow new users to sign up** to **off**. Only people you add can sign in.
4. **Create the 5 admin accounts:** Authentication → Users → **Add user → Create new user**. Enter email and a strong password and tick **Auto Confirm User**. Share the password through a secure channel. Each person can change it later on `/admin/profile`.
5. **Make them admins:** SQL Editor → run (replace the emails):

   ```sql
   update public.profiles
      set role = 'admin'
    where id in (select id from auth.users
                  where email in ('a@example.com','b@example.com','c@example.com','d@example.com','e@example.com'));
   ```

   A profile row is created automatically for each new user. Roles can only be changed in the SQL editor (a person cannot promote themselves).
6. **Environment variables** (Vercel → Settings → Environment Variables, and `.env.local` locally):

   | Variable | Where it comes from | Exposed to browser? |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SITE_MODE` | `coming-soon` or `live` | yes |
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL | yes |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key | yes |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role key | **never** (server only) |
   | `IP_HASH_SALT` | any random string (optional) | no |
   | `ADMIN_REQUIRE_MFA` | leave unset (MFA is required); `false` turns it off | no |

7. **First sign-in:** go to `/login`. After the password, each admin is sent to `/admin/security` to scan a QR code with an authenticator app (two-step sign-in). From then on every sign-in asks for the 6-digit code. Admin pages are unreachable without it.

How it is secured: Row Level Security is on for every table. Visitors can only **insert** requests (never read them). Admins can read requests and change only status, assignee and notes. The service-role key is used only in the server action that saves a request (`src/app/actions/submit-request.ts`) and is never sent to the browser. Spam protection on the forms: a hidden honeypot field, a minimum fill time, and a limit of 5 requests per IP per 10 minutes (the IP is stored only as a salted hash).

### Admin area (`/admin`)

Inbox with filters (type, status, assigned to, search by name/contact/reference code), request detail (status, assign to a teammate, internal notes), a **Places** page counting requests per place (for market research), and a profile page (name, photo, password). It works on a phone. Every change records who made it.

**Responses** (`/admin/insights`) is the Google-Forms-style view of the service inquiry questionnaire:

| Tab | What it shows |
| --- | --- |
| Summary | Charts for every question (bars and donuts), responses over time, status and language split, top destinations, group sizes, arrival months, and the latest free-text answers |
| Individual | One response at a time with Newer / Older buttons, every question in order, and links to update the status or message the person on WhatsApp |
| Table | A spreadsheet-style table of all answers (scrolls sideways, 50 per page) |

A date-range filter and a **Download CSV** button (opens in Excel / Google Sheets) sit above all three tabs.

### The service inquiry form (`/inquiry`)

One dedicated page with five sections (personal information, travel, type of assistance, additional requirements, budget). Every "Request a quote" button on the site opens it, with the service, trip or places the visitor picked already filled in (for example `/inquiry?service=tour&destinations=Guangzhou,Lijiang`). The questions live in `src/data/forms.ts` under `inquiry`. **If your database already exists, run the updated `supabase/schema.sql` again**: it adds the `inquiry` request type and updates the places view.

## 6. Deploying to Vercel

1. Push this repo to GitHub (`main`).
2. Vercel → **Add New → Project** → import the repo. **Framework Preset must be Next.js** (it is detected automatically). No build settings are needed.
3. Add the environment variables from section 5.
4. Project → Settings → Domains → add `yuanfenbridge.com` and `www.yuanfenbridge.com`, and set the DNS records Vercel shows at your registrar.
5. Every pull request gets a preview URL that shows the full site (noindex) so you can review it before launch day.

## 7. Where things live

```
messages/{en,id}/*.json     all copy, per language
src/data/placeholders.ts    fake contact values (replace these)
src/data/forms.ts           every form's questions (bilingual)
src/data/trips.ts           curated trips          src/data/destinations.ts  destinations + availability
src/data/nav.ts             site map               src/data/flags.ts          show guides / testimonials
src/proxy.ts                launch switch, language routing, admin session
src/app/[locale]/...        the full website       src/app/coming-soon/[locale]  the Coming Soon page
src/app/(internal)/...      /login and /admin      src/app/actions/submit-request.ts  saves requests
src/components/{site,ui,forms,admin,coming-soon}   components
supabase/schema.sql         database (single source of truth)
```

To add a page: create `src/app/[locale]/<name>/page.tsx`, add its strings to `messages/*/pages.json`, add the path to `ALL_PATHS` in `src/data/nav.ts` (sitemap) and a link in the nav arrays.

## 8. Assumptions made

- The Coming Soon page is the approved home page plus its sections; the old standalone `/about` page became the new About & FAQ page. In Coming Soon mode the header and footer no longer show the "About" link (it would only lead back to the same page).
- Page URLs use English slugs in both languages (`/id/services/jasa-titip`).
- Prices are never shown. Requests always go through the form first.
- The sticky WhatsApp button is shown on phones only; on desktop the header has a Contact button.
- A thank-you page (`/request/confirmation`) is excluded from search engines.
- Open Graph images are generated from live text plus the logo (`/og`), because the poster artwork has the old spelling baked in.
