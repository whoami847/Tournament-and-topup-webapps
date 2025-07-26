# NextN Tournament Platform

## Overview
NextN is a full-featured tournament management platform built with Next.js, Firebase, and modern React libraries. It supports online gaming tournaments, user registration, manual and online payments, and admin management.

---

## Features

### 1. Tournament Management
- **Create, Edit, and List Tournaments**: Admins can create tournaments with custom rules, entry fees, and prize pools.
- **Team & Player Registration**: Players can join tournaments solo or as teams. Registration logs are maintained.
- **Bracket & Match Management**: Supports rounds, matches, and result submissions with approval workflows.

### 2. User Profiles & Teams
- **Player Profiles**: Each user has a profile with stats, balance, and team info.
- **Team Management**: Users can create and manage teams, invite members, and join tournaments as a team.

### 3. Payment System
- **Manual Payment (Bank/Bkash/Nagad, etc.)**:
  - Users can submit manual payment requests for tournament entry.
  - Admins review, approve, or reject requests.
  - Payment methods are managed by admins (add, edit, delete, activate/deactivate).
  - Users must provide transaction ID and select a payment method.
  - Payment status is checked via `/api/manual-payment/check-status`.
- **Online Payment Integration**:
  - Supports gateways like RupantorPay and SSLCommerz.
  - Handles payment callbacks, verification, and status updates.
  - Payment status is checked via `/api/payment/check-status`.
  - Handles payment success, failure, and cancellation with proper redirects.
- **Transaction History**: All deposits, withdrawals, and tournament fees are logged.

### 4. Admin Panel
- **Approve/Reject Manual Payments**: Admins can view and process manual payment requests.
- **Manage Payment Methods**: Add, edit, or remove payment options for users.
- **View All Transactions**: See all user transactions and payment logs.

### 5. Notifications
- **In-app Notifications**: Users receive notifications for payment status, tournament updates, and admin actions.

### 6. Security & Validation
- **Firebase Auth**: Secure authentication for users and admins.
- **Server-side Validation**: All sensitive actions are validated on the server.

---

## API Endpoints

### Manual Payment
- `POST /api/manual-payment/check-status` — Checks if a user has an approved manual payment for a tournament.
- `POST /api/manual-payment/submit` — Submits a manual payment request (with transaction ID, method, etc.).

### Online Payment
- `GET /api/payment/callback` — Handles payment gateway callback, verifies payment, updates order and transaction.
- `POST /api/payment/cancel/[tran_id]` — Cancels a payment and updates order status.
- `POST /api/payment/fail/[tran_id]` — Marks a payment as failed and updates order status.
- `GET /api/payment/check-status` — Checks if a user has a completed payment for a tournament.

---

## Data Models

### TopupRequest
```
interface TopupRequest {
  id: string;
  userId: string;
  userName: string;
  userGamerId: string;
  amount: number;
  method: string;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Timestamp | string;
  tournamentId?: string;
  tournamentName?: string;
  isForTournament?: boolean;
}
```

### ManualPaymentRequest
```
interface ManualPaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userGamerId: string;
  amount: number;
  method: string;
  transactionId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
  tournamentId: string;
  tournamentName: string;
  isForTournament: boolean;
}
```

---

## Setup & Development

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure Firebase:**
   - Update `src/lib/firebase.ts` with your Firebase project credentials.
3. **Run locally:**
   ```bash
   npm run dev
   ```
4. **Build for production:**
   - Remove or comment out `output: 'export'` in `next.config.ts` for dynamic API routes.
   ```bash
   npm run build
   npm start
   ```

---

## Notes
- **Static Export Limitation:** If you use `output: 'export'`, dynamic API routes (manual/online payment, Firestore) will NOT work. Remove this setting for full functionality.
- **Admin Access:** Admin features require users to have the appropriate role in Firebase Auth.
- **Payment Gateways:** Configure gateway credentials in Firestore as needed.

---

## Contact
For support or questions, contact the project maintainer.
