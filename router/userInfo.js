const express = require("express");
const userInfoHander = require("../router_hander/userInfo");
const expressJoi = require("@escook/express-joi");
const {
  update_userInfo_schema,
  update_password_schema,
  update_avatar,
} = require("../schema/user");

const router = express.Router();

router.get("/getUserInfo", userInfoHander.getUserInfo);
router.post(
  "/updateUserInfo",
  expressJoi(update_userInfo_schema),
  userInfoHander.updataUserInfo
);
router.post(
  "/updatePassword",
  expressJoi(update_password_schema),
  userInfoHander.updatePassword
);
router.post(
  "/updateAvatar",
  expressJoi(update_avatar),
  userInfoHander.updateAvatar
);

module.exports = router;
