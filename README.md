# ZarklyX Website

Angular 21 · Tailwind CSS v4 · SSR · TypeScript

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | v22.22.3+ or v24+ |
| npm | v10+ |
| Angular CLI | v21 |

Install Angular CLI globally (once):
```bash
npm install -g @angular/cli
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (default port 4300)
npm start
# or
ng serve

# 3. Open in browser
http://localhost:4300
```

---

## Run on a Different Port

```bash
ng serve --port 4500
```

Or update the default port permanently in `angular.json`:
```json
"serve": {
  "options": {
    "port": 4300
  }
}
```

---

## Build

```bash
# Development build
ng build --configuration development

# Production build
ng build
# Output → dist/charotar-education-society-v2/
```

---

## Folder Structure

```
src/
├── app/
│   ├── core/                      # Singleton services, guards, interceptors
│   │   ├── guards/
│   │   │   ├── auth.guard.ts      # Redirects to /login if not authenticated
│   │   │   └── guest.guard.ts     # Redirects logged-in users to their dashboard
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts   # Attaches Bearer token to every request
│   │   │   └── error.interceptor.ts  # Handles 401 / 500 globally
│   │   ├── services/
│   │   │   ├── api.service.ts     # All API endpoint constants
│   │   │   ├── auth.service.ts    # Login, logout, session, role helpers
│   │   │   └── client.service.ts
│   │   ├── helpers/               # Legacy class-based interceptors (keep for reference)
│   │   ├── interfaces/            # TypeScript interfaces (e.g. security.interface.ts)
│   │   └── utils/                 # Pure utility functions
│   │
│   ├── layouts/                   # Shell components (header, footer, sidebar)
│   │   ├── header/
│   │   └── footer/
│   │
│   ├── pages/                     # Feature pages (routed)
│   │   ├── home/
│   │   │   └── index/
│   │   ├── about-us/
│   │   │   └── index/
│   │   └── error/
│   │       ├── error.component.ts # Parent layout for error pages
│   │       ├── error404/
│   │       └── error500/
│   │
│   ├── shared/                    # Reusable across features
│   │   ├── models/models.ts       # Shared interfaces (ApiResponse, etc.)
│   │   └── routes/routes.ts       # APP_ROUTES constants
│   │
│   ├── environments/              # (legacy location — use src/environments/ instead)
│   │
│   ├── app.ts                     # Root component
│   ├── app.config.ts              # Bootstrap providers (router, http, interceptors)
│   └── app.routes.ts              # Top-level route definitions
│
├── environments/
│   ├── environment.ts             # Local dev config
│   └── environment.prod.ts        # Production config
│
├── tailwind.css                   # @import "tailwindcss" (processed as plain CSS)
├── styles.scss                    # Global SCSS (custom styles, variables)
└── index.html                     # App shell
```

---

## Generate Code with Angular CLI

```bash
# Component  (auto-creates .ts, .html, .scss, .spec.ts)
ng generate component pages/my-page/index
# shorthand
ng g c pages/my-page/index

# Service
ng g s core/services/my-feature

# Guard
ng g guard core/guards/my-guard

# Pipe
ng g pipe shared/pipes/my-pipe

# Interface
ng g interface core/interfaces/my-model
```

> **Naming convention:** Angular 21 generates `my-page.ts` (no `.component` suffix) by default. Keep this style — do **not** rename to `my-page.component.ts`.

---

## Adding a New Page

1. Generate the component:
   ```bash
   ng g c pages/contact/index
   ```

2. Add a route in [src/app/app.routes.ts](src/app/app.routes.ts):
   ```typescript
   {
     path: 'contact',
     loadComponent: () => import('./pages/contact/index/index').then(m => m.Index)
   }
   ```

3. Done — the page is lazy-loaded automatically.

---

## Adding a New API Endpoint

Open [src/app/core/services/api.service.ts](src/app/core/services/api.service.ts) and add a static constant:
```typescript
public static GetContactFormsURL: string = ApiService.HOST_URL + '/contact/forms';
```

---

## Environment Config

| File | Used when |
|------|-----------|
| `src/environments/environment.ts` | `ng serve` / `ng build --configuration development` |
| `src/environments/environment.prod.ts` | `ng build` (production) |

Wire a production file replacement in `angular.json` under `configurations.production`:
```json
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.prod.ts"
  }
]
```

---

## Styling

This project uses **Tailwind CSS v4**. Use utility classes directly in templates:
```html
<div class="flex items-center gap-4 p-6 bg-blue-500 text-white rounded-xl">
```

Global SCSS (variables, mixins, custom classes) → [src/styles.scss](src/styles.scss)

---

## Tech Stack

| | |
|---|---|
| Framework | Angular 21 (standalone components) |
| Styling | Tailwind CSS v4 |
| HTTP | Angular `HttpClient` with functional interceptors |
| Routing | Angular Router (lazy-loaded routes) |
| SSR | Angular SSR (`@angular/ssr`) |
| Testing | Vitest |
| Build | `@angular/build` (Vite-based) |
