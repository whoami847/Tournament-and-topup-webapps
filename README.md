# Full-OK Tournament Web Application

## ✨ Overview
Full-OK Tournament is a feature-richNext.js 15 web platform that allows gamers to create, join and manage online tournaments while handling payments, leaderboards and wallet operations.  It ships with a dedicated Admin panel, real-time updates through Firebase Firestore and a mobile shell powered by Capacitor.

---

## 🚀 Tech Stack

* **Framework** : Next.js 15 (App Router, Server/Client Components)
* **Styling**   : Tailwind CSS + Radix UI + Framer Motion
* **State**    : Zustand & Immer
* **Backend**   : Firebase (Cloud Firestore, Auth*)
* **Payments**  : SSLCOMMERZ + Manual Payment Workflow (IPN support)
* **AI**        : Google Generative AI via Genkit
* **Mobile**    : Capacitor (Android / iOS wrappers)
* **Tooling**   : Typescript, ESLint, Prettier, Husky, pnpm / npm

\*Authentication strategy can be swapped; by default Firestore is used for data.

---

## 🎮 End-User Features

1. **Game Catalogue** – Browse a curated list of competitive games.
2. **Tournament Discovery** – Filter & search live or upcoming tournaments.
3. **Join & Check-in** – One-click join with automatic bracket seeding.
4. **Payment Options**
   * Instant – SSLCOMMERZ hosted checkout (success, fail, cancel & IPN callbacks).
   * Manual – Upload payment proof; status verified server-side.
5. **Live Bracket Viewer** – Follow match progress in real-time.
6. **Leaderboard** – Global ranking generated from tournament results.
7. **Wallet**
   * Balance overview.
   * Top-Up requests & history.
   * Withdraw requests.
8. **Profile Management** – Avatar, bio, social links, favourite games.
9. **Theme Switcher** – Dark / Light using `next-themes`.
10. **Responsive PWA** – Optimised for desktop, tablet and mobile; installable icon.

---

## 🛡️ Admin-Only Features

| Module | Key Capabilities |
| ------ | --------------- |
| **Dashboard** | KPIs, revenue and active users snapshot |
| **Games** | CRUD operations with cover image & metadata |
| **Tournaments** | Create, edit, seed brackets, set prizes & rules |
| **Banners** | Promotional hero images and call-to-actions |
| **Gateways** | Toggle payment providers, configure credentials |
| **Payment Orders** | Inspect SSLCOMMERZ transactions & statuses |
| **Top-Up Settings** | Minimum / maximum amounts & fees |
| **Top-Up Requests** | Approve / reject user deposits |
| **Prize Approvals** | Mark tournament winners as paid |
| **Results Approval** | Validate manually submitted match results |
| **Withdraw Methods** | Configure bKash, Nagad, Bank, etc. |
| **Withdraw Requests** | Approve / decline user cash-outs |
| **Users** | Search, ban, assign roles |
| **Transactions** | Ledger of every wallet mutation |
| **Settings** | Global app & branding configuration |

---

## 💳 Payment Flow

1. **Frontend** sends create-order request → `/api/payment/initiate`.
2. **Server Route** signs request with secret key & redirects to SSLCOMMERZ.
3. **Gateway** returns user to **success** / **fail** / **cancel** pages.
4. **IPN Route** `/api/payment/ipn` receives asynchronous verification and updates Firestore records atomically.
5. **Manual Payment** can be selected; proof is uploaded and verified by admin via `/api/manual-payment/check-status`.

All sensitive keys are injected via environment variables – see `.env.example`.

---

## 🏗️ Local Development

```bash
# 1. Install deps
npm install

# 2. Copy env template and fill values
cp .env.example .env.local

# 3. Start dev server
npm run dev
```

The dev server runs on `http://localhost:9002`.

### Type-Safety & Linting

```bash
npm run typecheck   # static type analysis
npm run lint        # eslint & prettier
```

---

## 📦 Production Build & Deployment

```bash
# Build
npm run build

# Start
npm run start
```

The project now uses **standalone** output (see `next.config.ts`), making it friendly for Docker, traditional VPS or serverless deployments.

A pre-built static `out/` directory can also be exported if API routes are disabled.

---

## 📱 Mobile Shell

With Capacitor you can generate native wrappers:

```bash
npx cap add android
npx cap run android
```

---

## 🤖 AI & Genkit

Located under `src/ai`, simple Genkit pipelines integrate Google AI for future features like automated match predictions, chatbots or content moderation.

---

## 🧑‍💻 Contributing

1. Fork & create a new branch (`git checkout -b feat/awesome`)
2. Commit changes following **Conventional Commits**.
3. Ensure `npm run typecheck` & `npm run lint` pass.
4. Open a pull request and describe your changes.

---

## 📜 License

MIT © Full-OK Team
