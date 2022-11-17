const joi = require("joi");

const username = joi.string().min(1).max(10).required();
const password = joi.string().alphanum().min(6).max(12).required();
const nickname = joi.string().required();
const email = joi.string().email().required();
const user_pic = joi.string().dataUri().required();

module.exports.reg_login_schema = {
  body: {
    username,
    password,
  },
};

module.exports.update_userInfo_schema = {
  body: {
    nickname,
    email,
  },
};

module.exports.update_password_schema = {
  body: {
    oldPassword: password,
    newPassword: joi.not(joi.ref("oldPassword")).concat(password),
  },
};

module.exports.update_avatar = {
  body: {
    user_pic,
  },
};
