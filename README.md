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
  A smart home service automation platform that matches customers with trusted local providers, schedules jobs, tracks progress, and collects ratings — built for the GC BAUST CSE Fest 2026 Hackathon.
</p>

---

## About The Project

Smart Service solves a real everyday problem: arranging home services (AC repair, plumbing, electrical, cleaning, moving, etc.) usually requires multiple manual steps — finding providers, checking availability, comparing options, and following up.

This application automates that flow.

Customers select a service, provide details, and instantly receive ranked provider recommendations. Providers manage incoming jobs through a clean dashboard and update status in real time. Everything runs fully in the browser with LocalStorage — no backend required.

---

## Features

### Customer

- Browse & search service categories
- Guided request form (location, date, time, urgency, problem details, optional photo)
- Smart provider matching with visible Match Score
- Auto Assign Best Provider (one-click)
- Live status tracking (Requested → Accepted → On the Way → In Progress → Completed)
- Digital invoice after completion
- One-time star rating + review
- My Requests history

### Provider

- Role-based dashboard
- Incoming job filters (Active / History, Urgency, Sort)
- Accept or Reject jobs
- Full status workflow
- Customer rating overview
- Double-booking prevention on active time slots

### System

- Urgency-aware matching algorithm
- Frosted-glass UI components (date picker, selects)
- LocalStorage persistence
- Demo login (Customer & Provider)

---

## Matching Algorithm

Providers must support the requested service. The score is calculated from:

| Factor            | Contribution                         |
| ----------------- | ------------------------------------ |
| Service match     | Required (base 30 points)            |
| Provider rating   | Up to 20 points                      |
| Distance          | Closer = higher (up to 20 points)    |
| Price             | Lower base price = higher (up to 15) |
| Time availability | Exact slot match = 15 points         |
| Urgency bonus     | Emergency +15, Urgent +8, Normal +0  |

Providers who already have an active booking at the same date + time are excluded (double-booking prevention).

---

## Demo Accounts

| Role     | How to sign in                                                                           |
| -------- | ---------------------------------------------------------------------------------------- |
| Customer | Any username + any 11-digit phone + any `@gmail.com` email + password `123456`           |
| Provider | Select a provider profile (e.g. Rahim Electronics) + same phone / Gmail / password rules |

---

## Full User Flow

### Customer Path

1. Sign in as **Customer**
2. Search or select a service
3. Fill location, preferred date & time, urgency, contact details (optional photo)
4. Review ranked matches **or** click **Auto Assign Best Provider**
5. Track the request live
6. After completion → view invoice + submit rating

### Provider Path

1. Sign in as **Provider** and choose a profile
2. Open Provider Dashboard
3. Accept or reject incoming jobs
4. Progress status: Accepted → On the Way → In Progress → Completed
5. View customer ratings on completed jobs

---

## How to Run

### Prerequisites

- Node.js 18+
- npm

### Steps

```bash
git clone https://github.com/rezwan-ahmed-l7/Smart-Home-Service-Hackathon.git

cd Smart-Home-Service-Automation-Hackathon

npm install
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

---

## Tech Stack

| Technology   | Purpose                 |
| ------------ | ----------------------- |
| React 19     | UI library              |
| Vite         | Build tool & dev server |
| React Router | Client-side routing     |
| Tailwind CSS | Styling                 |
| Lucide React | Icons                   |
| LocalStorage | Demo data persistence   |

---

## Project Structure

```text
src/
├── components/          # Reusable UI (GlassSelect, GlassDatePicker)
├── context/             # AppContext (auth, requests, ratings)
├── data/                # Mock services & providers
├── pages/               # CustomerHome, MatchResult, Tracking, MyRequests, ProviderDashboard, Login
├── utils/               # Matching algorithm
├── App.jsx
└── main.jsx
```

---

## Hackathon Marks Alignment

| Criteria                     | Implementation                                                                |
| ---------------------------- | ----------------------------------------------------------------------------- |
| Functionality Completeness   | Full request → match → track → complete → rate flow                           |
| Code Structure & Readability | Clear folders, modular components, readable utils                             |
| UI/UX Design                 | Modern frosted-glass interface, responsive layout                             |
| Unique Features              | Match scoring, urgency boost, auto-assign, invoice, double-booking prevention |

---

## Team Members

| Name                                                                  | Role / Contribution                   |
| --------------------------------------------------------------------- | ------------------------------------- |
| **[Rezwan Ahmed](https://github.com/rezwan-ahmed-l7)** - Team Lead    | UI/UX, Core Development, Architecture |
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
