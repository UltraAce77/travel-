# Travel Leaders — Redesigned Frontend

A fresh, modern frontend for the Travel Leaders platform, built from scratch with
**Vite + React + Tailwind CSS** in a dark "fintech" style (gold = trust, purple = tech).
It talks to the same Node/Express backend as the original app.

## Run it

```bash
# 1. Backend must be running first (see ../../Travel Leaders/SETUP.md)
#    -> http://localhost:8081  (CORS already allows :5173)

# 2. This app
npm install      # first time only
npm run dev      # -> http://localhost:5173
```

The API base URL defaults to `http://localhost:8081`. Override with a `.env`:
```
VITE_API_URL=http://localhost:8081
```

## Demo logins

| Role | Email | Password |
|---|---|---|
| Admin | `admin@gmail.com` | `admin123` |
| Manager | `manager@gmail.com` | `manager123` |
| User | `user@gmail.com` | `user123` |

The login screen also has one-click **quick demo login** buttons.

## Structure

```
src/
  lib/          api client (axios + envelope helper), utils
  context/      AuthContext (JWT in localStorage, role-based redirect)
  hooks/        useUserData (records + assigned treks)
  components/   AppShell (sidebar), Toast, Logo, ProtectedRoute, ui/*
  pages/
    AuthPage          login + register (referral code, role)
    user/             Dashboard, Treks (earn loop), Deposit, Withdraw, Wallet
    admin/            AdminDashboard, Funds (approve), Treks (CRUD), Users, Managers
    manager/          Dashboard (referral code, team)
```

## Awareness features (reproduced scam mechanics)

This is a security-expo demo, so the predatory mechanics from the original app are reproduced
faithfully — they're the educational payload. Each is tagged in the UI with a red "Red flag
(shown for awareness)" note via `components/AwarenessNote.jsx` (remove that component's usages
for a pure, un-annotated clone).

- **Withdrawal trap** (`pages/user/Withdraw.jsx`) — "available to withdraw" is hard-coded to
  **$0.00** even though the dashboard shows a balance + rewards; "processed within one hour";
  funds go to a fixed operator wallet; submit never pays out. Money flows in, never out.
- **Balance lockout** (`pages/user/Treks.jsx`) — when balance ≤ 0 every "Complete trek" button
  locks, demanding a deposit. Backend `approveTrek` drives the balance negative on a trek priced
  above it.
- **Rig treks** (`pages/admin/UserTreksModal.jsx`) — the operator secretly edits a victim's
  upcoming trek prices (commission auto = 20%) via `treks/updatePrice`, planting a high-priced
  trek to trigger the lockout. The current trek stays fixed so nothing looks wrong up front.
- **Admin Add Funds / Edit User** — operator can credit any account or change its details/password.
- **$10 deposit minimum**, referral-only signup, and the **travel-agency facade** (hero, "popular
  destinations", "trusted partners") that disguises the scheme.

## Notes

- Seeded treks have no images, so trek cards use deterministic gradient placeholders. Admin
  uploads (JPG) display normally.
- Design system: dark/OLED · gold `#F59E0B` + purple `#8B5CF6` on `#0F172A` · Orbitron
  (display) + Exo 2 (body).
