const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes API
const articlesRouter = require("./routes/articles");
const tasksRouter = require("./routes/tasks");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

app.use("/api/articles", articlesRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/users", usersRouter);
app.use("/api", authRouter); // Mengarahkan ke /api/login

// Menyajikan file statik secara spesifik dan aman
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/images", express.static(path.join(__dirname, "images")));

// Route untuk service worker dan manifest untuk PWA
app.get("/service-worker.js", (req, res) => {
  res.sendFile(path.join(__dirname, "service-worker.js"));
});

app.get("/manifest.json", (req, res) => {
  res.sendFile(path.join(__dirname, "manifest.json"));
});

app.get("/vercel.json", (req, res) => {
  res.sendFile(path.join(__dirname, "vercel.json"));
});

// Mengarahkan route root ke index.html
app.use((req, res, next) => {
  // Lewati jika request diawali dengan /api
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("=================================");
    console.log(`Server berjalan di port ${PORT}`);
    console.log(`PWA: http://localhost:${PORT}`);
    console.log("=================================");
  });
}

module.exports = app;
