export default function handler(req, res) {
  const rawName = req.query.name || "Guest";
  const guestName = decodeURIComponent(String(rawName)).replace(/-/g, " ");
  const encodedName = encodeURIComponent(guestName);

  const baseUrl = "https://piwul.vercel.app";

  const version = req.query.v || Date.now();

  const ogImage = `${baseUrl}/og/${encodeURIComponent(rawName)}.png?v=${version}`;
  const inviteUrl = `${baseUrl}/invite/${encodeURIComponent(rawName)}?v=${version}`;
  const finalUrl = `${baseUrl}/?to=${encodedName}`;

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  res.end(`<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${escapeHTML(guestName)} • Wedding Invitation</title>
  <meta name="description" content="Pipit ♥ Wulan Wedding Invitation" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Piwul Wedding Invitation" />
  <meta property="og:title" content="🎫 Visitor Pass • ${escapeHTML(guestName)}" />
  <meta property="og:description" content="Pipit ♥ Wulan Wedding Invitation" />
  <meta property="og:url" content="${inviteUrl}" />

  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:secure_url" content="${ogImage}" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Visitor Pass for ${escapeHTML(guestName)}" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="🎫 Visitor Pass • ${escapeHTML(guestName)}" />
  <meta name="twitter:description" content="Pipit ♥ Wulan Wedding Invitation" />
  <meta name="twitter:image" content="${ogImage}" />

  <meta http-equiv="refresh" content="3;url=${finalUrl}" />

  <script>
    setTimeout(function () {
      window.location.replace("${finalUrl}");
    }, 3000);
  </script>
</head>

<body>
  <p>Opening invitation for ${escapeHTML(guestName)}...</p>
  <p>
    <a href="${finalUrl}">Open invitation</a>
  </p>
</body>
</html>`);
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
