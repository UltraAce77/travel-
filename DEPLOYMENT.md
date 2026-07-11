# Deploying Travel Leaders (free tiers)

**Architecture:** Vercel (frontend) → Azure App Service (backend API) → MongoDB Atlas (database).

```
[ Browser ] → Vercel (React/Vite static site) → Azure App Service (Node/Express) → MongoDB Atlas
```

You keep everything on free plans: **Vercel Hobby**, **Azure for Students**, **Atlas M0**.

---

## 0. One-time prep
- Put the code on **GitHub**. Easiest: one repo with `frontend/` and `backend/` folders (this `trave-updated` layout).
- Have your **MongoDB Atlas** connection string ready (keep it secret).

---

## 1. Database — MongoDB Atlas (free M0)
1. Atlas → **Database Access** → add a DB user + password (these are in your connection URI).
2. Atlas → **Network Access** → Add IP → `0.0.0.0/0` (allow from anywhere). Simplest for a demo; Azure's outbound IPs aren't fixed on the free tier, so allow-all is the practical choice here.
3. Copy the **connection string** (looks like `mongodb+srv://user:pass@cluster.xxxx.mongodb.net/traveleaders`). This is your `MONGODB_URI`.

---

## 2. Backend — Azure App Service (free F1)
1. Azure Portal → **Create resource → Web App**:
   - Publish: **Code**, Runtime: **Node 20 LTS**, OS: **Linux**, Plan: **F1 (Free)**.
2. **Configuration → Application settings** (these become environment variables):
   - `MONGODB_URI` = your Atlas string
   - `ACCESS_TOKEN_SECRET` = a long random string
   - `CORS_ORIGIN` = your Vercel URL (fill in after step 3), e.g. `https://travel-leaders.vercel.app`
   - (Azure sets `PORT` automatically — the server reads `process.env.PORT`.)
3. **Deploy** (pick one):
   - **Deployment Center → GitHub** → choose repo/branch → Azure auto-builds on every push. (Set the app's project/root to the `backend` folder.)
   - or the **VS Code “Azure App Service” extension** → right-click the backend folder → *Deploy to Web App*.
   - or CLI: `az webapp up --name <app> --runtime "NODE:20-lts"`.
4. Make sure `backend/package.json` has `"start": "node server.js"` (not `nodemon`) for production.
5. Your API is now at `https://<your-app>.azurewebsites.net` — test `…/health`.

---

## 3. Frontend — Vercel (free Hobby)
1. Vercel → **New Project** → import your GitHub repo.
2. If it's a monorepo, set **Root Directory** = `frontend`.
3. Framework preset: **Vite** (Build: `npm run build`, Output: `dist`).
4. **Environment Variables**: `VITE_API_URL` = `https://<your-app>.azurewebsites.net`
5. Deploy → you get `https://<project>.vercel.app`.

---

## 4. Wire them together
- Backend `CORS_ORIGIN` = the Vercel URL → redeploy backend.
- Frontend `VITE_API_URL` = the Azure URL → redeploy frontend.

---

## 5. Gotchas
- **Azure F1 is small** — it sleeps and has limited CPU; first request after idle is slow. Fine for a demo.
- **Secrets** live only in Vercel/Azure env settings and local `.env` — never in the repo. `.env` is git-ignored.
- **Trek images** live in MongoDB (base64) — they travel with the data, nothing extra to host.
- **HTTPS everywhere** — both Vercel and Azure give you HTTPS automatically; make sure `VITE_API_URL` uses `https://`.

---

## Code changes required for the migration (I will make these)
1. Replace MySQL (`mysql2`) with **MongoDB (Mongoose)** — new models + rewritten controllers.
2. `server.js` → listen on `process.env.PORT || 8081`; CORS origin from `process.env.CORS_ORIGIN`.
3. A one-time **data migration script** (MySQL → Mongo) so your current 50 treks (with images) + accounts carry over.
4. `package.json` start script → `node server.js`.
