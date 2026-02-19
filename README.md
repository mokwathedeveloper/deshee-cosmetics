# MorganShop — Cosmetics E-commerce

A full-featured cosmetics e-commerce application built with **Next.js 14+**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, and **Supabase**.

## Features

### Storefront
- **Home** — Hero, trust badges, featured categories, best-selling products, newsletter
- **Shop** — Product grid with category filters, price range slider, sort options
- **Product Detail** — Image gallery, ratings, stock status, quantity selector, add-to-cart
- **Cart** — Quantity controls, order summary, checkout link
- **Checkout** — Shipping form, stock validation, order confirmation
- **Account** — Profile info, order history, order detail view

### Admin Portal (`/admin`)
- **Dashboard** — KPI cards (revenue, orders, products, low stock), recent orders
- **Products** — Search, paginated table, add/edit/delete products
- **Orders** — Search, status filter, order detail with status update
- **Categories** — Grid cards, create/edit via dialog, delete

### Auth
- Customer login & registration (`/auth/login`, `/auth/register`)
- Admin login with role validation (`/admin/login`)
- Middleware-based route protection

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Icons | Lucide React |
| Validation | Zod |
| Notifications | Sonner |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor to create tables, RLS policies, and storage
3. Run `supabase/seed.sql` to insert sample categories and products
4. Enable Email auth in **Authentication → Providers**

### 4. Create an admin user

1. Register a new account via `/auth/register`
2. In the Supabase dashboard, go to **Table Editor → profiles**
3. Find the user's row and change `role` from `customer` to `admin`
4. Sign in at `/admin/login`

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── actions/          # Server actions (auth, products, categories, orders)
├── app/
│   ├── (store)/      # Storefront pages (home, shop, product, cart, checkout, account)
│   ├── admin/        # Admin pages (dashboard, products, orders, categories)
│   └── auth/         # Auth pages (login, register)
├── components/
│   ├── admin/        # Admin-specific components
│   ├── store/        # Store-specific components
│   └── ui/           # Shared UI components (shadcn + custom)
├── config/           # Site configuration
├── hooks/            # Custom hooks (useCart, useDebounce)
├── lib/              # Utilities, Supabase clients, validations
└── types/            # TypeScript types
```

## License

MIT
