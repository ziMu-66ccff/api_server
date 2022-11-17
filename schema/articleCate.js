const joi = require("joi");

const name = joi.string().required();
const alias = joi.string().alphanum().required();
const id = joi.number().integer().min(1).required();

exports.add_article_cate_schema = {
  body: {
    name,
    alias,
  },
};

exports.delete_article_cate_schema = {
  params: {
    id,
  },
};

exports.get_article_cate_schema = {
  params: {
    id,
  },
};

exports.update_article_cate_schema = {
  body: {
    id,
    name,
    alias,
  },
};
