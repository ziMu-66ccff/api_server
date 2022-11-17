const db = require("../db/index"); // 数据库
const bcrypt = require("bcryptjs"); // 加密密码
const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../config");
const { promisify } = require("../utils/promisify");

exports.regUser = async (req, res) => {
  const userInfo = req.body;
  const sqlSelect = "select * from ev_users where username = ?";
  const sqlInsert = "insert into ev_users set ? ";
  const query = promisify(db.query, db);
  const resultSelect = await query(sqlSelect, userInfo.username).catch(
    (err) => {
      res.cc(err);
      return "end";
    }
  );
  // 处理数据库查询异常
  if (resultSelect === "end") return;
  // 处理用户名被占用
  if (resultSelect.length > 0) {
    res.cc("当前用户名已经被使用，请重新输入");
    return;
  }
  // 加密密码
  userInfo.password = bcrypt.hashSync(userInfo.password, 10);
  // 向数据库中插入用户数据
  const resultInsert = await query(sqlInsert, {
    username: userInfo.username,
    password: userInfo.password,
  }).catch((err) => {
    res.cc(err);
    return "end";
  });
  // 处理数据库插入数据异常
  if (resultInsert === "end") return;
  if (resultInsert.affectedRows != 1) {
    res.cc("当前系统正忙，请稍后再试");
    return;
  }
  res.send({
    status: 0,
    msg: "恭喜你注册成功！",
  });
};
exports.login = async (req, res) => {
  const userInfo = req.body;
  const sqlSelect = "select * from ev_users where username = ?";
  const query = promisify(db.query, db);
  // 从数据库中查询用户名
  const result = await query(sqlSelect, userInfo.username).catch((err) => {
    res.cc(err);
    return "end";
  });
  // 处理数据库查询异常
  if (result === "end") return;
  // 处理用户名错误
  if (result.length === 0) {
    res.cc("用户名不存在，请检查用户名是否正确");
    return;
  }
  console.log(result);
  console.log(result[0].password);
  // 判断密码是否匹配
  const resultCompare = bcrypt.compareSync(
    userInfo.password,
    result[0].password
  );
  // 处理密码错误
  if (!resultCompare) {
    res.cc("密码错误，请重新输入");
    return;
  }
  // 生成token
  const token = jwt.sign(
    { ...result[0], password: "", user_pic: "" },
    jwtSecretKey,
    { expiresIn: "24h" }
  );
  // 响应数据
  res.send({
    status: 0,
    msg: "恭喜你登陆成功！",
    token: `Bearer${token}`,
  });
};
