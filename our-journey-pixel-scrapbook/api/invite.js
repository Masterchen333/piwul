export default function handler(req, res) {
  const rawName = req.query.name || "Guest";

  const guestName = decodeURIComponent(String(rawName)).replace(/-/g, " ");
  const encodedName = encodeURIComponent(guestName);

  const baseUrl = "https://piwul.vercel.app";

  const version = req.query.v || "1";

  // Preview image (statis)
  const ogImage = `${baseUrl}/assets/sprites/wedpiwul.png?v=${version}`;

  const inviteUrl = `${baseUrl}/invite/${encodeURIComponent(rawName)}?v=${version}`;
  const finalUrl = `${baseUrl}/?to=${encodedName}`;

  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  res.end(`<!doctype html>
<html lang="id">

<head>

<meta charset="UTF-8" />

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
/>

<title>${escapeHTML(guestName)} • Wedding Invitation</title>

<meta
name="description"
content="You are invited to Pipit & Wulan Wedding."
/>

<meta
property="og:type"
content="website"
/>

<meta
property="og:site_name"
content="Piwul Wedding Invitation"
/>

<meta
property="og:title"
content="💌 Pipit & Wulan Wedding Invitation"
/>

<meta
property="og:description"
content="Kepada Yth. ${escapeHTML(guestName)}

You are invited to celebrate our wedding day ❤️"
/>

<meta
property="og:url"
content="${inviteUrl}"
/>

<meta
property="og:image"
content="${ogImage}"
/>

<meta
property="og:image:secure_url"
content="${ogImage}"
/>

<meta
property="og:image:type"
content="image/png"
/>

<meta
property="og:image:width"
content="1200"
/>

<meta
property="og:image:height"
content="630"
/>

<meta
property="og:image:alt"
content="Wedding Invitation"
/>

<meta
name="twitter:card"
content="summary_large_image"
/>

<meta
name="twitter:title"
content="💌 Pipit & Wulan Wedding Invitation"
/>

<meta
name="twitter:description"
content="Kepada Yth. ${escapeHTML(guestName)}

You are invited to celebrate our wedding day ❤️"
/>

<meta
name="twitter:image"
content="${ogImage}"
/>

<meta
http-equiv="refresh"
content="3;url=${finalUrl}"
/>

<script>
setTimeout(function () {
  window.location.replace("${finalUrl}");
}, 3000);
</script>

</head>

<body
style="
margin:0;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
background:#f8f3e6;
font-family:sans-serif;
"
>

<div style="text-align:center">

<img
src="${ogImage}"
alt="Wedding Invitation"
style="max-width:320px;width:90%;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.15)"
>

<h2>Opening Invitation...</h2>

<p>Redirecting to <strong>${escapeHTML(guestName)}</strong>'s invitation.</p>

<p>
<a href="${finalUrl}">
Click here if you are not redirected.
</a>
</p>

</div>

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
