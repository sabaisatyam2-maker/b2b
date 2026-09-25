# BizSphere — Frontend

A React (Vite) frontend built to match your existing BizSphere backend
exactly — same auth flow, same roles, same endpoints.

## Pages included
- **Home** — hero, live categories (fetched from your backend, not hardcoded), how-it-works, CTA
- **Register / Login / Forgot Password / Reset Password**
- **Browse** — search + category filter + location filter, shows only approved listings
- **Listing Detail** — full listing info + enquiry form (login required, matches your backend rule)
- **Vendor Dashboard** — my listings, create listing (with image upload), view enquiries
- **Admin Dashboard** — approve/reject pending requests, add/remove categories

## How to run

```
cd bizsphere-frontend
npm install
npm run dev
```

Runs on **http://localhost:5173**. Make sure your backend is running on
**http://localhost:5000** at the same time (that URL is set in
`src/api/axios.js` — change it there if your backend runs elsewhere).

## Design notes
- Colors: ink navy (`#10142B`), electric indigo (`#3A4CE0`) as primary,
  amber (`#FFB020`) as accent — defined as CSS variables in `src/index.css`
- Fonts: Space Grotesk for headings, Inter for body text
- Categories are never hardcoded on the frontend — they're always fetched
  from `GET /api/listings/categories`, so anything your admin adds shows
  up automatically everywhere (home page, browse filters, listing form)

## Folder structure
```
src/
├── api/axios.js         — the one place the backend URL is set
├── context/AuthContext.jsx — login state, shared across the app
├── components/          — Navbar, Footer, Logo, ProtectedRoute
└── pages/                — one file per page
```

Every page is a single, fairly short file — meant to be easy to read
end to end rather than split into many tiny components.
