# Smart Home Service Automation

<p align="center">
  <a href="https://www.baust.edu.bd" target="_blank">
    <img src="https://img.shields.io/badge/BAUST , SAIDPUR-059669?style=for-the-badge&logo=google-scholar&logoColor=white" alt="BAUST" />
  </a>
  <img src="https://img.shields.io/badge/HACKATHON-000000?style=for-the-badge&logo=devdotto&logoColor=white" alt="Hackathon" />
  <a href="https://baustcsefest2026.lovable.app/" target="_blank">
    <img src="https://img.shields.io/badge/CSE%20FEST%202026-4285F4?style=for-the-badge&logo=rocket&logoColor=white" alt="CSE Fest" />
  </a>
</p>

<p align="center">
  A React-based smart home service platform that matches customers with local providers, tracks jobs live, and handles invoicing and ratings — built for the GC BAUST CSE Fest 2026 Hackathon.
</p>

<!--
  Add a screenshot or short GIF here before sharing this repo with recruiters —
  a visual preview is often the first thing people look at.
  Example: ![App preview](./docs/preview.png)
-->

---

## About The Project

Arranging home services (AC repair, plumbing, electrical, cleaning, moving, etc.) usually means several manual steps — finding providers, checking availability, comparing options, and following up.

**Smart Home Service** automates that flow end-to-end: customers describe what they need and get ranked provider matches instantly; providers manage incoming jobs through a real-time dashboard.

Runs fully client-side with LocalStorage — no backend required to try it out.

---

## Features

### Customer
- Browse & search service categories
- Guided request form (location, date, time, urgency, problem details, optional photo)
- Smart provider matching with a visible Match Score
- One-click **Auto Assign Best Provider**
- Live status tracking (Requested → Accepted → On the Way → In Progress → Completed)
- Digital invoice after completion
- One-time star rating + review
- Request history ("My Requests")

### Provider
- Role-based dashboard
- Incoming job filters (Active / History, Urgency, Sort)
- Accept or reject jobs
- Full status workflow
- Customer rating overview
- Double-booking prevention on active time slots

### System
- Urgency-aware matching algorithm
- Frosted-glass UI components (custom date picker, selects)
- LocalStorage persistence

---

## Matching Algorithm

Providers must support the requested service. The score is calculated from:

| Factor             | Contribution                          |
| ------------------ | -------------------------------------|
| Expertise match    | Required (base 30 points)             |
| Time availability  | Exact slot match = 25 points          |
| Distance           | Closer = higher (up to 15 points)     |
| Provider rating    | Up to 15 points                       |
| Price              | Lower base price = higher (up to 10)  |
| Urgency bonus      | Emergency +5, Urgent +3, Normal +0    |

Providers with an active booking at the same date + time are excluded (double-booking prevention).

---

## Quick Start

```bash
git clone https://github.com/rezwan-ahmed-l7/Smart-Home-Service-Hackathon.git
cd Smart-Home-Service-Hackathon
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

**No backend, no seed data** — everything lives in your browser's LocalStorage:

| Role     | To get started                                                                                     |
| -------- | --------------------------------------------------------------------------------------------------- |
| Customer | **Sign Up** → choose **Customer** → username, 11-digit phone, `@gmail.com` email, password (6+ chars) |
| Provider | **Sign Up** → choose **Provider** → pick a provider profile (e.g. Rahim Electronics) → fill the rest |

Use the same details on **Sign In** to log back in later.

---

## Full User Flow

### Customer Path
1. Sign up / sign in as **Customer**
2. Search or select a service
3. Fill location, preferred date & time, urgency, contact details (optional photo)
4. Review ranked matches **or** click **Auto Assign Best Provider**
5. Track the request live
6. After completion → view invoice + submit rating

### Provider Path
1. Sign up / sign in as **Provider** and choose a profile
2. Open Provider Dashboard
3. Accept or reject incoming jobs
4. Progress status: Accepted → On the Way → In Progress → Completed
5. View customer ratings on completed jobs

---

## Tech Stack

| Technology   | Purpose                 |
| ------------ | ----------------------- |
| React 19     | UI library              |
| Vite         | Build tool & dev server |
| React Router | Client-side routing     |
| Tailwind CSS | Styling                 |
| Lucide React | Icons                   |
| LocalStorage | Client-side persistence |

---

## Project Structure

```text
src/
├── components/          # Reusable UI (GlassSelect, GlassDatePicker, PaymentPanel)
├── context/              # AppContext (auth, requests, ratings)
├── data/                 # Mock services & providers
├── pages/                # CustomerHome, MatchResult, Tracking, MyRequests, ProviderDashboard, Login, Signup
├── utils/                # Matching algorithm
├── App.jsx
└── main.jsx
```

---

## Known Limitations / Roadmap

Built as a hackathon MVP within a tight timeframe — next steps if this were taken further:

- Replace LocalStorage with a real backend (auth, database, persistence across devices)
- Real payment gateway integration (currently a demo checkout flow)
- Automated tests for the matching algorithm and booking flow
- Prevent duplicate accounts from claiming the same provider profile

---

## Team Members

| Name                                                                  | Role / Contribution                   |
| --------------------------------------------------------------------- | ------------------------------------- |
| **[Rezwan Ahmed](https://github.com/rezwan-ahmed-l7)** — Team Lead    | UI/UX, Core Development, Architecture |
| **[Mahathir Mohammad](https://github.com/mahathirmohammad842-coder)** | UI/UX, Frontend Components            |
| **[Mubasser Akhuku](https://github.com/Mubasserakhuku)**              | Features, Testing, Documentation      |

---

## Author

**Rezwan Ahmed**
B.Sc. Engg. in CSE Student | Aspiring Software Engineer & Learner

---

## License

> [!NOTE]
> This project was built for the GC BAUST CSE Fest 2026 Hackathon.