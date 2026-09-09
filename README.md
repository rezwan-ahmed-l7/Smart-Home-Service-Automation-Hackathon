# Smart Service

Smart Service is a hackathon-ready React application for requesting trusted home services. Customers can find a provider, book a time slot, track progress, attach a problem photo, and rate completed work. Providers get a focused dashboard for accepting and progressing jobs.

## Features

- Customer and provider demo workspaces with role-based navigation
- Service search and guided request form
- Frosted-glass date picker and dropdown controls
- Match scoring based on service, rating, distance, price, availability, and urgency
- Double-booking prevention for active provider time slots
- Provider request filters, urgency highlighting, and status workflow
- Live tracking, attached image preview, digital invoice, and one-time ratings
- LocalStorage persistence with no backend required

## How to run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Demo accounts

Customer: any name, any 11-digit phone number, any `@gmail.com` address, password `123456`.

Provider: select any provider profile, then use the same phone, Gmail, and password rules.

## Full user flow

### Customer

1. Sign in as Customer.
2. Search for and select a service.
3. Enter location, date, time, urgency, contact details, and optionally attach a photo.
4. Review ranked matches or choose **Auto Assign Best Provider**.
5. Track the request through each status.
6. After completion, review the invoice and submit a 1–5 star rating.

### Provider

1. Sign in as Provider and select a provider profile.
2. Open an incoming request in the dashboard.
3. Accept or reject it; active bookings cannot share the same date and time.
4. Progress the job through Accepted, On the Way, In Progress, and Completed.

## Tech stack

- React 19
- Vite
- React Router
- Tailwind CSS
- Lucide React icons
- Browser LocalStorage for demo persistence

## Matching algorithm

Providers must support the requested service. The score combines service fit, provider rating, distance, base price, and requested-time availability. Urgency adds 15 points for Emergency, 8 for Urgent, and 0 for Normal. Providers with an active booking at the requested date and time are excluded.

## Screenshots

The running application is the source of truth for the frosted-glass interface. Capture screenshots of the Login, Match Result, Provider Dashboard, and Tracking screens for a presentation deck.
