const { promisify } = require("../utils/promisify");
const db = require("../db/index");
const path = require("path");

exports.addArticle = async (req, res) => {
  console.log(req.body); // 文本类型的数据
  console.log("--------分割线----------");
  console.log(req.file); // 文件类型的数据

  // 处理未传文件封面
  if (!req.file || req.file.fieldname !== "cover_img") {
    return res.cc("文章封面是必选参数！");
  }
  const articleInfo = {
    // 标题、内容、状态、所属的分类Id
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join("/uploads", req.file.filename),
    // 文章发布时间
    pub_date: new Date(),
    // 文章作者的Id
    author_id: req.auth.id,
  };
  const sql = `insert into ev_articles set ?`;
  const query = promisify(db.query, db);
  const result = query(sql, articleInfo).catch((err) => {
    res.cc(err);
    return "end";
  });
  // 处理插入失败
  if (result === "end") return;
  // 处理数据库插入操作影响的数据不为1条
  if (result.affectedRows != 1) {
    return res.cc("发表失败！");
  }
  res.send({
    status: 0,
    msg: "文章发布成功！",
  });
};
