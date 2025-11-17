Backend (Node/TypeScript + Express + Prisma)

Run locally (dev):

1) Install dependencies

```powershell
cd backend
npm install
```

2) Start Postgres (local or Supabase)

If you have Postgres installed locally, start it and ensure `DATABASE_URL` in `.env` points to your local DB. Alternatively, create a Supabase project and set `DATABASE_URL` to the Supabase Postgres connection string.

For local Postgres, example of a connection string in `.env`:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/recruitment
```

3) Configure `.env` from `.env.example` and set DATABASE_URL accordingly

4) Generate and migrate Prisma schema (after setting DATABASE_URL)

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

5) Start dev server

```powershell
npm run dev
```

APIs:
- GET /health
- POST /api/auth/company/signup
- POST /api/auth/candidate/signup
- POST /api/auth/login
- POST /api/jobs/
- GET /api/jobs/company/:companyId
- POST /api/applications/

Notes:
- This is a scaffold for the MVP and includes placeholder logic and simple endpoint flows. Add validation, auth middleware and file uploads.
