const db = require("../db");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const result = await db.query("SELECT id, username, created_at FROM users ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO users(username, password) VALUES ($1, $2) RETURNING id, username, created_at",
      [username, password]
    );
    res.json({
      success: true,
      message: "User berhasil dibuat",
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  try {
    let result;
    if (password) {
      result = await db.query(
        "UPDATE users SET username = $1, password = $2 WHERE id = $3 RETURNING id, username, created_at",
        [username, password, id]
      );
    } else {
      result = await db.query(
        "UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, created_at",
        [username, id]
      );
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }
    res.json({
      success: true,
      affectedRows: result.rowCount,
      message: "User berhasil diupdate",
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM users WHERE id = $1 RETURNING id, username", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }
    res.json({
      success: true,
      message: "User berhasil dihapus"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
