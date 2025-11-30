import app from "./middleware.js";

const port = process.env.app_port || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});