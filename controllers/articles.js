const db = require("../db");

// Get all articles
const getAllArticles = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM articles ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new article
const createArticle = async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO articles(title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    );
    res.json({
      success: true,
      message: "Artikel berhasil ditambahkan",
      article: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update an article
const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const result = await db.query(
      "UPDATE articles SET title = $1, content = $2 WHERE id = $3 RETURNING *",
      [title, content, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Artikel tidak ditemukan" });
    }
    res.json({
      success: true,
      affectedRows: result.rowCount,
      message: "Artikel berhasil diupdate",
      article: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete an article
const deleteArticle = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM articles WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Artikel tidak ditemukan" });
    }
    res.json({
      success: true,
      message: "Artikel berhasil dihapus"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle
};
