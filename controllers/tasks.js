const db = require("../db");

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tasks ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new task
const createTask = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO tasks(title, description, status) VALUES ($1, $2, $3) RETURNING *",
      [title, description, status || 'pending']
    );
    res.json({
      success: true,
      message: "Task berhasil ditambahkan",
      task: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const result = await db.query(
      "UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *",
      [title, description, status, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Task tidak ditemukan" });
    }
    res.json({
      success: true,
      affectedRows: result.rowCount,
      message: "Task berhasil diupdate",
      task: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Task tidak ditemukan" });
    }
    res.json({
      success: true,
      message: "Task berhasil dihapus"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
};
