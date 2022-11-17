const express = require("express");
const cors = require("cors");
const userRouter = require("./router/user");
const userInfoRouter = require("./router/userInfo");
const artcateRouter = require("./router/artcate");
const articleRouter = require("./router/article");
const joi = require("joi");
const expressJwt = require("express-jwt");
const { jwtSecretKey } = require("./config");

const app = express();

app.use(cors()); // 通过cors解决跨域问题
app.use(express.urlencoded({ extended: false })); // 解析urllencoded格式的表单数据
app.use(express.json()); //解析json格式的数据

// 解析token
app.use(
  expressJwt
    .expressjwt({ secret: jwtSecretKey, algorithms: ["HS256"] })
    .unless({
      path: [/^\/api\//],
    })
);

// 配置一个便于响应数据的函数的中间件
app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    res.send({
      status,
      msg: err instanceof Error ? err.message : err,
    });
  };
  next();
});

app.use("/api", userRouter);
app.use("/my", userInfoRouter);
app.use("/my/article", artcateRouter);
app.use("my/article", articleRouter);

// 全局捕获错误的中间件
app.use((err, req, res, next) => {
  // 处理表单验证的错误
  if (err instanceof joi.ValidationError) {
    console.log(res.cc);
    return res.cc("数据不符合要求");
  }
  // 处理token验证失败的错误
  if (err.name === "UnauthorizedError") {
    return res.send({
      status: 1,
      msg: "身份验证失败",
    });
  }
  // 处理其他错误
  res.cc(err);
});

// 托管静态资源文件
app.use("/uploads", express.static("./uploads"));

app.listen(3007, () => {
  console.log("api server running in http://127.0.0.1:3007");
});
