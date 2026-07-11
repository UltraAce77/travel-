# Travel Leaders Frontend

Production Vite and React frontend for the Travel Leaders platform.

## Local development

```bash
npm install
npm run dev
```

Create a local `.env` file:

```text
VITE_API_URL=http://localhost:8081
VITE_TAWK_PROPERTY_ID=
VITE_TAWK_WIDGET_ID=
```

## Production

The frontend is deployed to Vercel from the `frontend` directory. Configure `VITE_API_URL` with the Azure App Service backend URL. Tawk.to widget IDs may be overridden through the two public Tawk environment variables.

```bash
npm run build
```

Do not commit local `.env` files or backend secrets.