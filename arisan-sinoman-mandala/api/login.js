import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method tidak diizinkan",
    });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username dan password wajib diisi",
      });
    }

    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(401).json({
        error: "Username atau password salah",
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH,
    );

    if (!isValidPassword) {
      return res.status(401).json({
        error: "Username atau password salah",
      });
    }

    const token = jwt.sign(
      {
        username,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );

    return res.status(200).json({
      message: "Login berhasil",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Gagal login",
      detail: error.message,
    });
  }
}
