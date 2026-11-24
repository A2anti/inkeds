# INKED. — Next.js + Supabase

A responsive single-artist tattoo studio site based on the supplied INKED. HTML concept, rebuilt with Next.js App Router, TypeScript, Supabase, and a black / burnt-orange / warm-cream palette.

## Included

- Home page, styles & pricing, gallery, artist story, process and booking form
- Responsive layout and Unsplash photography
- Eight price packages with live total / 50% deposit calculation
- Supabase booking persistence and unique active appointment-slot constraint
- Admin login and protected booking dashboard
- Pending / confirmed / completed / cancelled booking statuses
- Optional booking notification email via Resend
- Supabase SQL schema, seed data, RLS policies and Vercel-ready configuration

## 1. Install and run

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 2. Create Supabase project

1. Create a project at https://supabase.com.
2. Open **SQL Editor**, paste and run `supabase/schema.sql`.
3. In **Project Settings → API**, copy the Project URL and anon/public key into `.env.local`.
4. Copy the `service_role` key into `SUPABASE_SERVICE_ROLE_KEY`. This key is server-only. Never prefix it with `NEXT_PUBLIC_` and never commit it.
5. In **Authentication → URL Configuration**, set the Site URL to your production domain and add `http://localhost:3000/**` plus your Vercel domain to Redirect URLs.

The public booking endpoint uses the service-role key on the server to write validated booking requests. Public visitors cannot query the bookings table. Admin dashboard reads are protected by Supabase Auth and row-level security.

## 3. Create the studio admin

1. In Supabase **Authentication → Users**, create/invite the artist account (email + password).
2. The database trigger creates a matching `profiles` row with the default `artist` role.
3. In SQL Editor, promote the account (replace the email):

```sql
update public.profiles
set role = 'admin'
where email = 'artist@example.com';
```

4. Visit `/admin/login` and sign in. The `/admin` dashboard is protected by middleware, a server-side role check, and RLS.

## 4. Optional email notifications

Create a Resend account and verify a sending domain. Set:

```env
RESEND_API_KEY=re_...
BOOKING_NOTIFICATION_EMAIL=studio@example.com
BOOKING_FROM_EMAIL=INKED. <bookings@your-verified-domain.com>
```

Email is best-effort: a mail provider outage will not discard a successfully stored booking.

## 5. Deploy to Vercel

1. Push this project to GitHub.
2. Import the repository in Vercel. Framework preset: **Next.js**. Root directory: the project root.
3. Add every required `.env.local` value in Vercel → Project → Settings → Environment Variables (Production, Preview and Development as appropriate).
4. Deploy. Redeploy after changing environment variables.
5. Add the final Vercel domain to Supabase Auth URL Configuration.

Build command and output are detected automatically (`next build`).

## Customize before launch

- **Artist details:** update Mara Reyes copy in `app/page.tsx`.
- **Prices and packages:** update `lib/data.ts` and the matching seed values in `supabase/schema.sql`. The booking API uses server-side prices from `lib/data.ts`; never accept client-supplied prices.
- **Currency:** the starter retains the source HTML's USD prices. Update `money()` in `lib/data.ts` and the display labels if your studio bills in another currency.
- **Studio schedule:** change the Tuesday–Saturday rule and time choices in `components/BookingForm.tsx` and `app/api/bookings/route.ts`, plus the SQL check constraint if changing supported times.
- **Photography:** the Unsplash photos are illustrative references. Replace with the artist's own work and ensure you have permission to publish every image. Update IDs in `lib/data.ts`.
- **Brand:** edit the CSS variables at the top of `app/globals.css`. Current orange is `#ff6b24`.
- **Admin:** create an auth user and promote its profile role as described above. Do not expose the service-role key in browser code.

## Booking behavior and production notes

- Submitting creates a **pending request**; it does not charge a card or instantly confirm a slot.
- The unique partial index prevents concurrent active bookings for the same date/time. A cancelled booking releases the slot.
- The UI currently offers three time choices (11:00, 14:00, 17:00) and the next 20 available Tuesday–Saturday dates. Availability is authoritatively checked by the database on submission.
- Deposits are calculated at 50%, but payment collection is not connected. Add a payment provider (e.g. Stripe or a local provider) only after confirming the studio's country, currency and payment workflow.
- Configure Supabase backups, email deliverability, privacy/consent copy, cancellation policy and legal pages before accepting real customer data.


## Checkout reference images and finalization update

The booking checkout supports up to five JPG, PNG, or WEBP reference images (5 MB each). Images are uploaded server-side into the private Supabase Storage bucket `booking-references`; their storage paths are saved on the booking record. Studio admins can open time-limited signed links to those images from `/admin`. The checkout also captures a preferred payment method and presents a copyable booking-finalization message after the booking request is saved. No payment is collected automatically.

### Apply the database update

Run the complete `supabase/schema.sql` in the Supabase SQL Editor. It creates the private `booking-references` bucket and adds `payment_method` and `reference_images` columns to `public.bookings` (the `ALTER TABLE ... IF NOT EXISTS` statements also upgrade an existing installation).

### Configure checkout contact links

Set these optional public variables in `.env.local` and in Vercel Project Settings → Environment Variables:

```env
NEXT_PUBLIC_BOOKING_EMAIL=studio@example.com
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/yourstudio
```

Replace the example values with the studio's real contact details. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only; it must never use a `NEXT_PUBLIC_` prefix.
