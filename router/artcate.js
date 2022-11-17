const express = require("express");
const articleCateHander = require("../router_hander/artcate");
const expressJoi = require("@escook/express-joi");
const {
  add_article_cate_schema,
  delete_article_cate_schema,
  get_article_cate_schema,
  update_article_cate_schema,
} = require("../schema/articleCate");

const router = express.Router();

router.get("/getArtcate", articleCateHander.getArticleCate);
router.post(
  "/addArtcate",
  expressJoi(add_article_cate_schema),
  articleCateHander.addArticleCate
);
router.get(
  "/deleteArtcate/:id",
  expressJoi(delete_article_cate_schema),
  articleCateHander.deleteArtcateById
);
router.get(
  "/getArtcate/:id",
  expressJoi(get_article_cate_schema),
  articleCateHander.getArtcateById
);
router.post(
  "/updateArtcate",
  expressJoi(update_article_cate_schema),
  articleCateHander.updateArtcate
);

module.exports = router;
