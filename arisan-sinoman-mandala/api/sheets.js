import { google } from "googleapis";

function parseNumber(value) {
  if (!value) return 0;

  return (
    Number(
      String(value)
        .replace(/[^\d,-]/g, "")
        .replace(",", "."),
    ) || 0
  );
}

function normalizeType(value) {
  const clean = String(value || "")
    .trim()
    .toLowerCase();

  if (
    clean === "in" ||
    clean === "masuk" ||
    clean === "pemasukan" ||
    clean === "income"
  ) {
    return "in";
  }

  return "out";
}

export default async function handler(req, res) {
  try {
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
      return res.status(500).json({
        error: "Environment Variable belum lengkap.",
      });
    }

    const auth = new google.auth.JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const [cash, savings, arisan, minutes, announcements] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Kas!A2:E",
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Tabungan!A2:B",
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Arisan!A2:D",
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Notulen!A2:C",
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Pengumuman!A2:C",
      }),
    ]);

    const cashData = (cash.data.values || [])
      .filter((row) => row.some((cell) => String(cell || "").trim()))
      .map(([date, month, title, type, amount]) => {
        const finalType = normalizeType(type);

        return {
          date: String(date || "").trim(),
          month: String(month || "").trim(),
          title: String(title || "").trim(),
          type: finalType,
          category: finalType === "in" ? "Pemasukan" : "Pengeluaran",
          amount: parseNumber(amount),
        };
      });

    const savingsData = (savings.data.values || [])
      .filter((row) => row.some((cell) => String(cell || "").trim()))
      .map(([name, amount]) => ({
        name: String(name || "").trim(),
        amount: parseNumber(amount),
      }));

    const arisanRows = (arisan.data.values || []).filter((row) =>
      row.some((cell) => String(cell || "").trim()),
    );

    const nextArisanRow = arisanRows[0] || [];

    const nextArisan = {
      date: String(nextArisanRow[0] || "-").trim(),
      host: String(nextArisanRow[1] || "-").trim(),
      winner: String(nextArisanRow[2] || "-").trim(),
      address: String(nextArisanRow[3] || "-").trim(),
    };

    const minutesData = (minutes.data.values || [])
      .filter((row) => row.some((cell) => String(cell || "").trim()))
      .map(([date, title, body]) => ({
        date: String(date || "").trim(),
        title: String(title || "").trim(),
        body: String(body || "").trim(),
      }));

    const announcementsData = (announcements.data.values || [])
      .filter((row) => row.some((cell) => String(cell || "").trim()))
      .map(([date, title, body]) => ({
        date: String(date || "").trim(),
        title: String(title || "").trim(),
        body: String(body || "").trim(),
      }));

    return res.status(200).json({
      nextArisan,
      cash: cashData,
      savings: savingsData,
      minutes: minutesData,
      announcements: announcementsData,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Gagal membaca Google Sheet",
      detail: error.message,
    });
  }
}
