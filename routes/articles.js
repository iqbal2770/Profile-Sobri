const express = require("express");
const router = express.Router();
const articlesController = require("../controllers/articles");

router.get("/", articlesController.getAllArticles);
router.post("/", articlesController.createArticle);
router.put("/:id", articlesController.updateArticle);
router.delete("/:id", articlesController.deleteArticle);

module.exports = router;
