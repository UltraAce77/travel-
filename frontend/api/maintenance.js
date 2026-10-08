export default function handler(_request, response) {
  response.statusCode = 503;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Robots-Tag", "noindex, nofollow");
  response.end(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>503 — Service Unavailable</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; background: #f4f8fb; color: #12334a; font: 16px/1.5 Arial, sans-serif; text-align: center; }
    main { max-width: 480px; }
    h1 { margin: 0; color: #e72b4f; font-size: clamp(3.5rem, 14vw, 6rem); line-height: 1; }
    h2 { margin: 16px 0 8px; font-size: clamp(1.25rem, 5vw, 1.75rem); }
    p { margin: 0; color: #536b7b; }
  </style>
</head>
<body>
  <main>
    <h1>503</h1>
    <h2>Service Unavailable</h2>
    <p>This site is temporarily unavailable. Please try again later.</p>
  </main>
</body>
</html>`);
}
