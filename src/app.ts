import express from "express";
import userRoutes from "../routes/users";
import bodyParser from "body-parser";
require("dotenv").config();

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("");
});

app.use("/users", userRoutes);

const port = process.env.APP_PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}...`);
});
