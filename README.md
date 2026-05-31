# LinkBridge

> Connecting students, teachers, and industry professionals to collaborate on real-world projects, exchange ideas, and grow together.

<!-- Replace the badge placeholders below with your real values (license, build, etc.) -->

![Deployment](https://img.shields.io/badge/deployed%20on-Vercel-black?logo=vercel)
![Frontend](https://img.shields.io/badge/frontend-React%2018%20%2B%20Vite-61DAFB?logo=react)
![Backend](https://img.shields.io/badge/backend-Node.js%20%2B%20Express-339933?logo=node.js)
![Database](https://img.shields.io/badge/database-MongoDB-47A248?logo=mongodb)
![Realtime](https://img.shields.io/badge/realtime-Socket.IO-010101?logo=socket.io)
<!-- TODO: Confirm and update the license badge below (package.json currently declares "ISC", but no LICENSE file exists in the repo). -->
![License](https://img.shields.io/badge/license-ISC-blue)

---

## Overview

**LinkBridge** is a collaboration and mentorship platform that bridges the gap
between academia and industry. It brings three communities together on a single
platform:

- **Students** looking for mentorship, project supervision, paid opportunities, and feedback.
- **Teachers / University Lecturers** who supervise final-year projects and guide students.
- **Industry Professionals** who post real-world problems, fund work, and discover talent.

The platform solves a common problem in higher education: students often build
academic projects in isolation with little real-world input, while companies
struggle to access fresh talent and student innovators struggle to monetize their
skills. LinkBridge connects these groups so students can work on real industry
problems, get supervised and rated by teachers, incubate ideas, share knowledge,
and get paid for solving industry challenges — all in one place.

## Live Demo

**Frontend:** https://linkbridgeweb.vercel.app

<!-- TODO: These backend/socket URLs are inferred from the source (frontend points to the backend host below). Confirm/replace if different. -->
- **Backend API:** https://linkbridgebackend.vercel.app
- **Realtime (Socket.IO) server:** runs separately (see [Deployment](#deployment))

## Features

- **Authentication & Accounts** — Email/password sign-up & login with JWT, Google OAuth sign-in, password hashing (bcrypt), and email-based password reset (SendGrid / Nodemailer).
- **Role-based Profiles** — Distinct experiences for **Students**, **Teachers**, and **Industry Professionals**, each with editable profile and cover images (stored on Cloudinary).
- **Connections** — Send, accept, and reject connection requests to build a professional network.
- **Industry Problems** — Professionals post real-world problems with a budget and deadline; students apply with cover letters/proposals, and the poster assigns the work.
- **Payments (Stripe)** — Secure checkout and payouts for industry problems via Stripe, including Stripe Connect accounts for receiving funds.
- **Project Supervision & Progress Tracking** — Students create projects, request a teacher as supervisor (approve/reject flow), invite members, and track progress through staged milestones (requirements → system → UI → frontend → backend → testing → deployment) with a completion percentage, plus code & documentation uploads.
- **Idea Incubator** — Post and categorize ideas, and let the community rate them.
- **Knowledge Hub** — Share and download learning resources/documents.
- **Peer Showcase & Feedback** — Publish project posts with media, like and comment, and receive feedback. Sentiment analysis (`sentiment` / `compromise`) is used to help interpret feedback.
- **Real-time Messaging** — One-to-one chat powered by Socket.IO.
- **Notifications** — In-app alerts for connection requests, supervision requests, and other activity.

<!-- TODO: An AI key (VITE_AI_KEY) is referenced in the Idea Incubator. Confirm which AI provider/feature this powers and document it here. -->

## Tech Stack

**Frontend**
- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [React Router DOM](https://reactrouter.com/) for routing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) & [AOS](https://michalsnik.github.io/aos/) for animations
- [Socket.IO Client](https://socket.io/) for realtime features
- [Axios](https://axios-http.com/) for HTTP requests
- [Stripe.js](https://stripe.com/docs/js) + React Stripe.js for payments
- [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) for Google sign-in
- `react-toastify`, `react-select`, `react-circular-progressbar`, `sentiment`, `compromise`, `jwt-decode`, and more

**Backend**
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [JSON Web Tokens](https://jwt.io/) + [bcrypt](https://www.npmjs.com/package/bcrypt) for auth
- [Cloudinary](https://cloudinary.com/) + [Multer](https://www.npmjs.com/package/multer) for media uploads
- [Stripe](https://stripe.com/) for payments
- [SendGrid](https://sendgrid.com/) / [Nodemailer](https://nodemailer.com/) for transactional email

**Realtime**
- Standalone [Socket.IO](https://socket.io/) server for chat/presence

**Hosting**
- [Vercel](https://vercel.com/) (frontend, and serverless backend)

## Project Structure

This repository is a monorepo containing three independently runnable apps:

```text
LinkBridge/
├── frontend/              # React + Vite client (deployed to Vercel)
│   ├── src/
│   │   ├── assets/        # Images, logos, static data
│   │   ├── components/    # Reusable UI (Navbar, Sidebar, IdeaIncubator, KnowledgeHub, ...)
│   │   ├── context/       # React Context (UserContext: global user/state + API base URL)
│   │   ├── pages/         # Route pages (Home, Login, Signup, Chat, Payment, Profile, ...)
│   │   ├── App.jsx        # App routes
│   │   └── main.jsx       # App entry (Google OAuth provider, context provider)
│   └── package.json
│
├── backend/               # Express REST API (deployed to Vercel)
│   ├── config/            # DB connection & Cloudinary config
│   ├── controllers/       # Route handlers (auth, user, project, industry, payment, ...)
│   ├── middlewares/       # Auth middleware (JWT verification)
│   ├── models/            # Mongoose schemas (User, Project, Industry, Idea, Post, ...)
│   ├── routes/            # Express routers, mounted under /api/*
│   ├── uploads/           # Local upload artifacts
│   ├── app.js             # Express app entry
│   └── package.json
│
├── socket/                # Standalone Socket.IO server (realtime chat/presence)
│   ├── app.js             # Socket server entry (listens on port 9000)
│   └── package.json
│
├── vercel.json            # SPA rewrite config for the frontend
└── README.md
```

### Key API routes (backend)

Mounted in [`backend/app.js`](./backend/app.js):

| Base path | Purpose |
| --- | --- |
| `/api/auth` | Authentication (login, register, password reset) |
| `/api/user` | Users, profiles, connections |
| `/api/industry` | Industry problems |
| `/api/industry/payment` | Stripe payments for industry problems |
| `/api/idea` | Idea Incubator |
| `/api/resource` | Knowledge Hub resources |
| `/api/project` | Projects & supervision |
| `/api/progress` | Project progress tracking |
| `/api/post` | Peer posts / showcase |
| `/api/notification` | Notifications |
| `/api/conversation`, `/api/message` | Messaging |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (or yarn/pnpm)
- A [MongoDB](https://www.mongodb.com/) database (e.g. MongoDB Atlas)
- Accounts/API keys for [Cloudinary](https://cloudinary.com/), [Stripe](https://stripe.com/), and [SendGrid](https://sendgrid.com/)
- A [Google OAuth Client ID](https://console.cloud.google.com/apis/credentials)

### Installation

Clone the repository:

```bash
git clone https://github.com/mfurqanabbas20/LinkBridge.git
cd LinkBridge
```

Install dependencies for each app:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Realtime socket server
cd ../socket
npm install
```

### Environment Variables

Create a `.env` file in **`backend/`**:

```bash
# backend/.env
PORT=5000

# MongoDB connection string
# TODO: The connection string is currently hardcoded in backend/config/db.js.
#       Move it to this variable and load it via process.env (recommended for security).
MONGO_URI=your_mongodb_connection_string

# Auth
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

# Email (SendGrid)
API_KEY=your_sendgrid_api_key

# Stripe (secret key)
Secret_key=your_stripe_secret_key
```

Create a `.env` file in **`frontend/`**:

```bash
# frontend/.env
# Used by the Idea Incubator feature
VITE_AI_KEY=your_ai_api_key
```

> <!-- TODO: The following values are currently hardcoded in the frontend source and should ideally be moved to env vars:
>   - API base URL → frontend/src/context/UserContext.jsx (`url`)
>   - Google OAuth Client ID → frontend/src/main.jsx (`GoogleOAuthProvider clientId`)
>   - Stripe publishable key → frontend/src/pages/Payment.jsx (`loadStripe`)
> Consider switching these to VITE_API_URL, VITE_GOOGLE_CLIENT_ID, and VITE_STRIPE_PUBLISHABLE_KEY. -->

### Running Locally

Run each app in a separate terminal.

**1. Backend API** (default port `5000`):

```bash
cd backend
npm start
```

**2. Realtime socket server** (port `9000`):

```bash
cd socket
npm start
```

**3. Frontend** (Vite dev server, default port `5173`):

```bash
cd frontend
npm run dev
```

> **Note:** When developing locally, point the frontend at your local backend by
> updating the `url` value in [`frontend/src/context/UserContext.jsx`](./frontend/src/context/UserContext.jsx)
> (a commented-out `http://localhost:5000` line is already there), and update the
> CORS origin in [`backend/app.js`](./backend/app.js) to `http://localhost:5173`.

Then open [http://localhost:5173](http://localhost:5173).

## Deployment

The frontend (and backend) are deployed on **Vercel**.

### Frontend (Vercel)

1. Push the repository to GitHub.
2. In Vercel, **Import Project** and set the **Root Directory** to `frontend/`.
3. Framework preset: **Vite**. Build command: `npm run build`, Output directory: `dist`.
4. Add the frontend environment variables (e.g. `VITE_AI_KEY`).
5. The included [`vercel.json`](./vercel.json) rewrites all routes to `index.html` for SPA routing.
6. Deploy.

### Backend (Vercel)

1. Create a second Vercel project with the **Root Directory** set to `backend/`.
2. Add all backend environment variables (see above).
3. Deploy, then update the frontend's API base URL to the deployed backend URL.

<!-- TODO: Confirm the exact backend deployment setup. The current backend uses app.listen() and may need a vercel.json / serverless entrypoint for Vercel. Document any platform-specific config here. -->

### Socket server

<!-- TODO: The Socket.IO server (socket/) listens on a fixed port (9000) via a long-lived connection. Vercel's serverless model is not ideal for persistent WebSocket servers — confirm where this is hosted (e.g. Render, Railway, a VPS) and document it here. -->

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: add your feature"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request.

Please open an issue first to discuss any major changes.

## License

<!-- TODO: package.json declares "ISC" but there is no LICENSE file in the repo.
     Add a LICENSE file and update this section (e.g. MIT, ISC, or proprietary). -->
This project is currently declared under the **ISC** license in `package.json`.
Add a `LICENSE` file to formalize licensing terms.

## Authors & Contact

**LinkBridge** was created by:

- **Furqan Abbas** — Co-Founder
- **Amna Asif** — Co-Founder

<!-- TODO: Add contact details (email, LinkedIn, Twitter/X, etc.) for the authors. -->

Contact: <!-- TODO: add a contact email -->
GitHub: [@mfurqanabbas20](https://github.com/mfurqanabbas20)
