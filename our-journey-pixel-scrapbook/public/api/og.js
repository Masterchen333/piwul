export default function handler(req, res) {
  const rawName = req.query.name || "Guest";
  const guestName = String(rawName).replace(/-/g, " ");
  const guestId =
    "#" +
    guestName
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#92d9ff"/>
  <rect y="430" width="1200" height="200" fill="#79c96b"/>

  <rect x="120" y="80" width="960" height="470" fill="#fff8df" stroke="#4b2f23" stroke-width="14"/>
  <rect x="150" y="110" width="900" height="410" fill="#fff3cf" stroke="#8d5a35" stroke-width="8"/>

  <text x="600" y="175" text-anchor="middle" font-size="42" font-family="monospace" fill="#a7345d">
    VISITOR PASS
  </text>

  <text x="600" y="250" text-anchor="middle" font-size="58" font-family="monospace" fill="#4b2f23">
    ${escapeXML(guestName)}
  </text>

  <text x="600" y="315" text-anchor="middle" font-size="30" font-family="monospace" fill="#8d5a35">
    ${escapeXML(guestId)}
  </text>

  <rect x="370" y="360" width="460" height="70" fill="#ffecb7" stroke="#4b2f23" stroke-width="6"/>
  <text x="600" y="407" text-anchor="middle" font-size="28" font-family="monospace" fill="#4b2f23">
    WEDDING INVITATION
  </text>

  <text x="600" y="485" text-anchor="middle" font-size="34" font-family="monospace" fill="#a7345d">
    Pipit ♥ Wulan
  </text>

  <text x="600" y="525" text-anchor="middle" font-size="22" font-family="monospace" fill="#4b2f23">
    Open your special invitation
  </text>
</svg>
`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.end(svg);
}

function escapeXML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
