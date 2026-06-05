import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        valid: false,
        error: "Token tidak ditemukan",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({
      valid: true,
      user: decoded,
    });
  } catch (error) {
    return res.status(401).json({
      valid: false,
      error: "Token tidak valid atau sudah expired",
    });
  }
}
