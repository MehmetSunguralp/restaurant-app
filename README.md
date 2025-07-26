# Restaurant Ordering App

## Tech Stack

- Next.js (App Router, TypeScript)
- Prisma ORM + PostgreSQL
- Zustand (global state)
- SASS (SCSS modules)
- NextAuth.js (email/password auth)
- Express (Node.js) for payment (Iyzico placeholder)
- Nodemailer/Resend (email placeholder)

## Getting Started

### 1. Clone and Install

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials (PostgreSQL, NextAuth, email, payment).

### 3. Set Up Database

- Start PostgreSQL locally (or use a service like Supabase).
- Update `DATABASE_URL` in `.env`.
- Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

- Seed mock data:

```bash
npx tsx prisma/seed.ts
```

### 4. Run Next.js App

```bash
npm run dev
```

### 5. Run Express Payment Server

```bash
cd express-server
npm install
npm run dev
```

## Folder Structure

- `/app` - Next.js App Router pages (frontend & API)
- `/components` - React UI components
- `/lib` - Utilities (db, email, payment)
- `/store` - Zustand store(s)
- `/prisma` - Prisma schema, seed
- `/styles` - SCSS modules
- `/express-server` - Node.js Express payment API

## Features

- Product listing with categories
- Shopping cart (Zustand)
- Checkout & order submission
- Admin panel (order list)
- Confirmation email on order
- Responsive design
- Prisma cursor-based pagination
- Polling for new orders (admin)

---

## Example Environment Variables
```
DATABASE_URL=<PostgreSQL_URL>
NEXTAUTH_SECRET=<Secret_Key>
RESEND_API_KEY=<Resend_API_Key>
```

**Happy coding!**
