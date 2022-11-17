const db = require("../db/index");
const { promisify } = require("../utils/promisify");
const bcrypt = require("bcryptjs");
const { result } = require("@hapi/joi/lib/base");

exports.getUserInfo = async (req, res) => {
  const sqlSelect =
    "select id, username, nickname, email, user_pic from ev_users where id = ? ";
  const query = promisify(db.query, db);
  const result = await query(sqlSelect, req.auth.id).catch((err) => {
    res.cc(err);
    return "end";
  });
  // 处理数据库查询出错
  if (result === "end") return;
  // 处理查询到的数据条数不为1
  if (result.length != 1) {
    return res.cc("获取用户信息失败");
  }
  res.send({
    status: 0,
    msg: "SUCCESS",
    data: result[0],
  });
};

exports.updataUserInfo = async (req, res) => {
  const sqlUpdate = "update ev_users set ? where id = ?";
  const query = promisify(db.query, db);
  const result = await query(sqlUpdate, [req.body, req.auth.id]).catch(
    (err) => {
      res.cc(err);
      return "end";
    }
  );
  // 处理数据库更新出错
  if (result === "end") return;
  // 处理数据库影响行数不为 1
  if (result.affectedRows != 1) {
    console.log(req.auth.id);
    return res.cc("修改用户信息失败");
  }
  res.send({
    status: 0,
    msg: "修改用户信息成功！",
  });
};

exports.updatePassword = async (req, res) => {
  const sqlSelect = "select * from ev_users where id = ?";
  const query = promisify(db.query, db);
  const resultSelect = await query(sqlSelect, req.auth.id).catch((err) => {
    res.cc(err);
    return "end";
  });
  // 处理数据库查询失败
  if (resultSelect === "end") return;
  // 处理数据库没有查询到数据
  if (resultSelect.length != 1) {
    return res.cc("用户不存在");
  }
  const resultCompare = bcrypt.compareSync(
    req.body.oldPassword,
    resultSelect[0].password
  );
  if (!resultCompare) {
    return res.cc("原密码错误！！！");
  }
  const sqlUpdate = "update ev_users set password = ? where id = ?";
  const resultUpdate = await query(sqlUpdate, [
    bcrypt.hashSync(req.body.newPassword),
    req.auth.id,
  ]).catch((err) => {
    res.cc(err);
    return "end";
  });
  // 处理数据库更新失败
  if (resultUpdate === "end") return;
  // 处理数据库插入操作影响的行数不为1
  if (resultUpdate.affectedRows != 1) {
    return res.cc("更新密码失败");
  }
  res.send({
    status: 0,
    msg: "密码更新成功！",
  });
};

exports.updateAvatar = async (req, res) => {
  const sqlUpdate = "update ev_users set user_pic = ? where id = ? ";
  const query = promisify(db.query, db);
  const resultUpdate = await query(sqlUpdate, [
    req.body.user_pic,
    req.auth.id,
  ]).catch((err) => {
    res.cc(err);
    return "end";
  });
  // 处理数据库插入失败
  if (resultUpdate === "end") return;
  // 处理数据库影响的数据条数不为1
  if (resultUpdate.affectedRows != 1) {
    return res.cc("头像更新失败！");
  }
  res.send({
    status: 0,
    msg: "头像更新成功！",
  });
};
