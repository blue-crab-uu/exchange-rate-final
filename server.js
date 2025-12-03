import app from "./middleware.js";

// 适配Vercel无服务器函数
export default async (req, res) => {
  return app(req, res);
};

// 本地开发时仍然可以启动服务器
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}