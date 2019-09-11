const express = require("express");
const connectDB = require("./config/db");
const app = express();

connectDB();

app.get("/", (req, res) => {
  res.send("Test api runs");
});

const PORT = process.env.port || 5000;

app.listen(PORT, () => console.log("Server is running"));
