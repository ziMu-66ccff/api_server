const db = require("../db/index");
const { promisify } = require("../utils/promisify");

exports.getArticleCate = async (req, res) => {
  const sqlSelect =
    "select * from ev_article_cate where is_delete = 0 order by id";
  const query = promisify(db.query, db);
  const resultSelect = await query(sqlSelect).catch((err) => {
    res.cc(err);
    return "end";
  });
  // 处理数据库查询失败
  if (resultSelect === "end") return;
  res.send({
    status: 0,
    msg: "获取文章分类成功",
    data: resultSelect,
  });
};

exports.addArticleCate = async (req, res) => {
  const sqlSelect = "select * from ev_article_cate where name = ? or alias = ?";
  const sqlInsert = "insert into ev_article_cate set ?";
  const query = promisify(db.query, db);
  const resultSelect = await query(sqlSelect, [
    req.body.name,
    req.body.alias,
  ]).catch((err) => {
    res.cc(err);
    return "end";
  });
  // 处理数据库查询失败
  if (resultSelect === "end") return;
  // 处理文章分类名和别名都被占用
  if (
    resultSelect.length === 2 ||
    (resultSelect.length === 1 &&
      resultSelect[0].name === req.body.name &&
      resultSelect[0].alias === req.body.alias)
  ) {
    return res.cc("文章名和别名全部被占用，请更换");
  }
  // 处理文章名被占用
  if (resultSelect.length === 1 && resultSelect[0].name === req.body.name) {
    return res.cc("文章名被占用");
  }
  // 处理文章别名被占用
  if (resultSelect.length === 1 && resultSelect[0].alias === req.body.alias) {
    return res.cc("别名被占用");
  }
  // 向数据库插入数据
  const resultInsert = await query(sqlInsert, req.body).catch((err) => {
    res.cc(err);
    return "end";
  });
  // 处理数据库插入失败
  if (resultInsert === "end") return;
  // 处理数据库插入影响的数据条数不为1
  if (resultInsert.affectedRows != 1) {
    return res.cc("文章类型增加失败");
  }
  res.send({
    status: 0,
    msg: "文章类型增加成功",
  });
};

exports.deleteArtcateById = async (req, res) => {
  const sqlDelete = "update ev_article_cate set is_delete = 1 where id = ? ";
  const query = promisify(db.query, db);
  const resultDelete = await query(sqlDelete, req.params.id).catch((err) => {
    res.cc(err);
    return "end";
  });
  // 处理数据库删除失败
  if (resultDelete === "end") return;
  // 处理数据库删除操作影响的数据条数不为1
  if (resultDelete.affectedRows != 1) {
    return res.cc("文章类型删除失败");
  }
  res.send({
    status: 0,
    msg: "文章类型成功删除",
  });
};

exports.getArtcateById = async (req, res) => {
  const sqlSelect = "select * from ev_article_cate where id = ?";
  const query = promisify(db.query, db);
  const resultSelect = await query(sqlSelect, req.params.id).catch((err) => {
    res.cc(err);
    return "end";
  });
  // 处理数据库查询失败
  if (resultSelect === "end") return;
  // 处理数据库查询得到的数据不为1
  if (resultSelect.length != 1) {
    return res.cc("获取文章分类数据失败");
  }
  res.send({
    status: 0,
    msg: "获取文章分类数据成功！",
    data: resultSelect[0],
  });
};

exports.updateArtcate = async (req, res) => {
  const sqlSelect1 = "select * from ev_article_cate where id = ?";
  const sqlSelect2 =
    "select * from ev_article_cate where name = ? or alias = ?";
  const sqlUpdate = "update ev_article_cate set ? where id = ?";

  // 判断id是否存在

  const query = promisify(db.query, db);
  const resultSelect1 = await query(sqlSelect1, req.body.id).catch((err) => {
    res.cc(err);
    return "end";
  });
  // 处理数据库查询失败
  if (resultSelect1 === "end") return;
  // 处理数据库没有查询到数据
  if (resultSelect1.length != 1) {
    return res.cc("id错误");
  }

  // 去重

  const resultSelect2 = await query(sqlSelect2, [
    req.body.name,
    req.body.alias,
  ]).catch((err) => {
    res.cc(err);
    return "end";
  });
  // 处理数据库查询失败
  if (resultSelect2 === "end") return;
  // 处理文章分类名和别名都被占用
  if (
    resultSelect2.length === 2 ||
    (resultSelect2.length === 1 &&
      resultSelect2[0].name === req.body.name &&
      resultSelect2[0].alias === req.body.alias)
  ) {
    return res.cc("文章名和别名全部被占用，请更换");
  }
  // 处理文章名被占用
  if (resultSelect2.length === 1 && resultSelect2[0].name === req.body.name) {
    return res.cc("文章名被占用");
  }
  // 处理文章别名被占用
  if (resultSelect2.length === 1 && resultSelect2[0].alias === req.body.alias) {
    return res.cc("别名被占用");
  }

  // 更新数据

  const resultUpdate = await query(sqlUpdate, [req.body, req.body.id]).catch(
    (err) => {
      res.cc(err);
      return "end";
    }
  );
  // 处理数据库更新失败
  if (resultUpdate === "end") return;
  // 处理数据库更新影响的数据条数不为1
  if (resultUpdate.affectedRows != 1) {
    return res.cc("文章类型更新失败");
  }
  res.send({
    status: 0,
    msg: "文章类型更新成功",
  });
};
