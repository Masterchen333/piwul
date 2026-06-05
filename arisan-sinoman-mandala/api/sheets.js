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

    const sheets = google.sheets({
      version: "v4",
      auth,
    });

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
      .filter((row) => row.some((cell) => cell))
      .map(([date, month, title, type, amount]) => {
        const cleanType = String(type || "")
          .trim()
          .toLowerCase();

        const finalType =
          cleanType === "in" ||
          cleanType === "masuk" ||
          cleanType === "pemasukan"
            ? "in"
            : "out";

        return {
          date: date || "",
          month: String(month || "").trim(),
          title: title || "",
          type: finalType,
          category: finalType === "in" ? "Pemasukan" : "Pengeluaran",
          amount: parseNumber(amount),
        };
      });

    const savingsData = (savings.data.values || []).map(([name, amount]) => ({
      name: name || "",
      amount: parseNumber(amount),
    }));

    const arisanRows = arisan.data.values || [];

    const nextArisanRow = arisanRows[0] || [];

    const nextArisan = {
      date: nextArisanRow[0] || "-",
      host: nextArisanRow[1] || "-",
      winner: nextArisanRow[2] || "-",
      address: nextArisanRow[3] || "-",
    };

    const minutesData = (minutes.data.values || []).map(
      ([date, title, body]) => ({
        date: date || "",
        title: title || "",
        body: body || "",
      }),
    );

    const announcementsData = (announcements.data.values || []).map(
      ([date, title, body]) => ({
        date: date || "",
        title: title || "",
        body: body || "",
      }),
    );

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
