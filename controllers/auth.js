const db = require("../db");

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );
    if (result.rows.length > 0) {
      res.json({
        success: true,
        message: "Login berhasil!"
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Username atau password salah!"
      });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  login
};
