export default function handler(req, res) {
  const rawName = req.query.name || "Guest";
  const guestName = String(rawName).replace(/-/g, " ");
  const encodedName = encodeURIComponent(guestName);

  const baseUrl = "https://piwul.vercel.app";
  const ogImage = `${baseUrl}/og/${encodeURIComponent(rawName)}.png`;
  const finalUrl = `${baseUrl}/?to=${encodedName}`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  res.end(`
<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Wedding Invitation for ${escapeHTML(guestName)}</title>

  <meta property="og:title" content="Visitor Pass for ${escapeHTML(guestName)}" />
  <meta property="og:description" content="You are invited to Pipit & Wulan Wedding Invitation." />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:url" content="${baseUrl}/invite/${encodeURIComponent(rawName)}" />
  <meta property="og:type" content="website" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Visitor Pass for ${escapeHTML(guestName)}" />
  <meta name="twitter:description" content="You are invited to Pipit & Wulan Wedding Invitation." />
  <meta name="twitter:image" content="${ogImage}" />

  <meta http-equiv="refresh" content="0;url=${finalUrl}" />
</head>
<body>
  <script>
    window.location.href = "${finalUrl}";
  </script>
  <p>Opening invitation for ${escapeHTML(guestName)}...</p>
</body>
</html>
  `);
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
