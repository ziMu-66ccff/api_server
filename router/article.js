const express = require("express");
const articleHander = require("../router_hander/article");
const path = require("path");
const multer = require("multer");
const expressJoi = require("@escook/express-joi");
const { add_article_schema } = require("../schema/article");

const upload = multer({ dest: path.join(__dirname, "../uploads") });

const router = express.Router();

router.post(
  "/add",
  upload.single("cover_img"),
  expressJoi(add_article_schema),
  articleHander.addArticle
);

module.exports = router;
