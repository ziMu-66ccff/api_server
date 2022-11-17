const express = require("express");
const userHander = require("../router_hander/user");
const expressJoi = require("@escook/express-joi"); // 验证表单数据
const { reg_login_schema } = require("../schema/user"); // 需要验证的表单对象

const router = express.Router();

router.post("/reguser", expressJoi(reg_login_schema), userHander.regUser);
router.post("/login", expressJoi(reg_login_schema), userHander.login);

module.exports = router;
