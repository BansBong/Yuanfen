# Placeholder checklist

Everything on this list is **draft or fake** and must be replaced (or consciously accepted) before launch.

- Run `npm run check:placeholders` any time to see what is still outstanding (it greps for the word `PLACEHOLDER`).
- Run `npm run check:placeholders -- --strict` to make the command fail while anything is left (useful as a final gate).
- When `NEXT_PUBLIC_SITE_MODE=live`, `npm run build` prints a loud warning if placeholders remain. It never blocks the build.
- Outside **production + live** mode, a small amber `PLACEHOLDER` badge appears next to draft content in the UI. It disappears on the real live site, so the check script, not the badge, is your safety net.
- The WhatsApp button never points at a real number until you set one. While `WHATSAPP_NUMBER` is a placeholder it opens WhatsApp's contact picker with the message filled in. The Coming Soon page behaves the same way.

When you replace a value, delete the word `PLACEHOLDER` from it (and from the `_PLACEHOLDER` marker keys in `messages/*/*.json`) so the checker stops listing it.

## 1. Contact details (`src/data/placeholders.ts`)

| Value | Currently | Replace with |
| --- | --- | --- |
| `WHATSAPP_NUMBER` | `000000000000` | Real number, digits only, with country code (no `+` or spaces), e.g. `62812xxxxxxx` |
| `INSTAGRAM_HANDLE` | `PLACEHOLDER_instagram` | Instagram username without `@` |
| `CONTACT_EMAIL` | `PLACEHOLDER@example.com` | Public contact email |
| `WECHAT_ID` | `PLACEHOLDER_wechat` | WeChat ID (the Contact page hides WeChat until this is real) |
| `TELEGRAM_HANDLE` | `PLACEHOLDER_telegram` | Telegram username (hidden until real) |
| `RESPONSE_TIME` | `PLACEHOLDER response time ...` | How fast you reply, in English and Indonesian, e.g. `24 hours` / `24 jam`. Shown on the confirmation page |

These feed the header/footer links, the sticky WhatsApp button, the Contact page, the Coming Soon buttons, and the WhatsApp message on the confirmation page.

## 2. Content data files

| File | What is a draft | What you must do |
| --- | --- | --- |
| `src/data/trips.ts` | All five trips: day counts, highlights, "who it is for" | Write the real itineraries. Set `status` to `"available"` / `"on-request"` |
| `src/data/destinations.ts` | One-line hooks (draft copy), photos, and availability | Review hooks. Set `status: "available"` for places you can really serve. Add `image` paths under `public/destinations/` |
| `src/data/forms.ts` | Every form's question list (all 8 forms) | Send me your real question lists, or edit here. Only this file changes. Never ask for passport numbers, payment details or medical records |
| `src/data/people.ts` + `src/data/flags.ts` | Guides and testimonials are **empty and hidden** | Add REAL entries only, then set `SHOW_GUIDES` / `SHOW_TESTIMONIALS` to `true` |

## 3. Copy in the language files (`messages/en/*.json`, `messages/id/*.json`)

All copy in both languages is **draft** and needs a human review (Indonesian by a native speaker). Specific spots that need real information:

| File | Keys | What is missing |
| --- | --- | --- |
| `faq.json` | `general`: response time, "is it safe to pay you" | Real answers |
| `faq.json` | `jastip`, `admission` answers marked `PLACEHOLDER` | Fee policy, receipts process, list of partner schools |
| `services.json` | `jastip.paymentText`, `feesText`, `trust` | Your real payment, receipt and fee policy (shown prominently on the Jasa Titip page) |
| `services.json` | `medical.*` | Have the medical wording reviewed by you (and a legal advisor if needed). It must keep the "no medical advice, do not send records" message |
| `services.json` | `admission.*` | Real programs, partner schools, requirements |
| `services.json` | `tour.hkmoText` | **Verify** the Hong Kong / Macau entry-rule note. It is deliberately generic |
| `pages.json` | `about.storyText` | The real story of the team and how Yuanfen started |
| `pages.json` | `privacy.*` (all sections, `updated`, retention) | **Legal/owner review required.** It is a draft, not legal advice. Fill the last-updated date and the retention period |
| `pages.json` | `partnership.*`, `becomeGuide.*`, `howItWorks.*` | Read and adjust to how you really work |
| `home.json`, `trips.json`, `comingSoon.json` | all | General copy review. The Coming Soon text keeps the wording you approved, with the name and launch date updated |

## 4. Artwork

| Item | Where | Note |
| --- | --- | --- |
| Poster / Instagram artwork with **YUANFENN** (double n) baked into the pixels | `design/poster/coming soon poster.png` (source only, not deployed) | I did not edit it. Please supply a corrected poster if you still want to use it |
| Old Open Graph / Twitter images made from that poster | were `src/app/opengraph-image.png`, `twitter-image.png` | **Removed.** Social previews now come from `/og` (live text + logo), so the spelling is always right. Drop in new poster-based artwork later if you prefer |
| Destination photos | `public/destinations/` (not created yet) | The picker shows "Photo placeholder" tiles until you set `image` in `destinations.ts` |
| Service card illustrations | `public/brand/card-*.jpg` | Reused from the poster scenes (they contain no text) |

## 5. Backend and hosting (not placeholders, but required)

See the README: create the Supabase project, run `supabase/schema.sql`, switch off public sign-ups, create the 5 admin accounts and set their role, set the environment variables on Vercel, then flip `NEXT_PUBLIC_SITE_MODE` on launch day.
