# Placeholder images — replace before launch

Every image on the site currently comes from a **free public placeholder host**, not
from Charotar Education Society. None of it is real CES photography and none of it
should ship to production.

All URLs live in a single file:

> **`src/app/shared/placeholder-images.ts`**

Components never hardcode an image path — they read from that file. To swap in a real
photo, drop the file under `public/assets/images/…` and change the one URL. No template
or component edits are needed.

## Hosts in use

| Host | Used for | Notes |
| --- | --- | --- |
| `picsum.photos` | Scenes (campus, news, stories) | Deterministic — the same `seed` always returns the same photo |
| `i.pravatar.cc` | Portraits (chairman, alumni) | Deterministic by `img` id |

> ⚠️ These are **external requests at runtime**. Besides being wrong content, they add
> third-party dependencies and hurt LCP. Replacing them with local assets is required,
> not optional.

## Inventory

| Key in `placeholder-images.ts` | Where it appears | Suggested size | What it should become |
| --- | --- | --- | --- |
| `heroCampus` | Hero banner background — `pages/home/hero` | 1600×900 | Wide campus/heritage-building shot; keep the left third uncluttered so the headline stays readable |
| `institutes.schools` | Institutes carousel card 1 | 600×400 | A CES school building |
| `institutes.colleges` | Institutes carousel card 2 | 600×400 | A CES college building |
| `institutes.professional` | Institutes carousel card 3 | 600×400 | A professional institute building |
| `institutes.hostels` | Institutes carousel card 4 | 600×400 | A hostel building |
| `institutes.others` | Institutes carousel card 5 | 600×400 | Any remaining institute |
| `chairman` | "From the Chairman" — `pages/home/leadership` | 300×380 portrait | Portrait of **Shri Virusbhai Patel** |
| `successStories[0..3]` | Success Stories gallery | 400×300 | Student/event photography |
| `alumni[0..3]` | "Our Alumni, Our Pride" | 300×300 square | Portraits of the four named alumni |
| `news.classes` | News card 1 | 800×500 | Classroom photo |
| `news.examTips` | News card 2 | 800×500 | Study/exam photo |
| `news.annualDay` | News list item 1 | 300×220 | Annual Day photo |
| `news.research` | News list item 2 | 300×220 | Research/lab photo |
| `news.achievements` | News list item 3 | 300×220 | Prize-giving photo |

## Real imagery already in place

| Area | Location | Notes |
| --- | --- | --- |
| Management / leadership portraits | `public/assets/images/directors/` | **Real CES photos**, not placeholders. Wired directly in `pages/management/key-leaders` and `pages/management/management-members` — deliberately *not* routed through this file. Filenames with spaces are URL-encoded (`Chirag%20bhayo.png`). |

Three files in that folder are currently **unused**: `Ajaydeep_Dave.jpg`, `D_S_Raj.png`,
`Dr_J_D_Patel.png` — they don't correspond to any of the 15 names in the Management
design. Add them to `management-members.ts` if those people belong on the page.

## Not placeholders — but still unresolved

These are **not** in `placeholder-images.ts` and need separate attention:

| Item | Where | Status |
| --- | --- | --- |
| Global Partnerships logos | `pages/home/leadership` | Rendered as **text** (Google for Education, Microsoft, IBM, NPTEL, Coursera). Real logos are third-party trademarks — obtain permission and add as local SVGs before using them. |
| The CES Network map | `pages/home/legacy` | A generic halftone blob with 12 gold pins. Should become a real Gujarat outline with pins at true campus locations. Pin coordinates are in `legacy.ts` → `pins`. |
| Footer backdrop | `layouts/footer` | Wired to `/assets/images/bg/footer-bg.png` (a real asset), currently commented out in `footer.html`. |
| Hero "Play Video" buttons | `pages/home/hero` | Both the circular button and the pill are **inert** — no video URL or player is attached yet. |

## Copy is placeholder too

Beyond images, the following was transcribed from the design mock and has **no verified
source**. Check it against real CES records before launch:

- Every statistic — 110+ years, 31+ institutes, 50+ courses, 25K+ students, 1000+ faculty
- Impact & Research figures — 120+ projects, 15+ patents, ₹25 Cr+ funding, 160+ publications
- The chairman's quote
- All four alumni names and their employers
- All news, event and announcement entries
