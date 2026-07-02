const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Verifikasi koneksi ke database saat startup
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database PostgreSQL gagal terhubung:", err.message);
  } else {
    console.log("Database PostgreSQL berhasil terhubung pada:", res.rows[0].now);
  }
});

module.exports = pool;
