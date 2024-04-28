const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const mongoose = require("mongoose");

const requestIp = require("request-ip");
//importing routes
const { router: Auth } = require("./routes/authApi");
const Budget = require("./routes/budgetApi");

//authentication
const { Authenticate } = require("./routes/authApi");

//connecting to database
mongoose.connect(
  "mongodb+srv://mohanvamsisajja21:Ytdm9HtQrDEuwYEW@cluster0.2tysuro.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);
const db = mongoose.connection;
db.on("error", (error) => {
  console.error("Connection error:", error);
});
db.once("open", () => {
  console.log("Connected to the database");
});

// parsing json
app.use(express.json());
app.use(requestIp.mw());
// parsing urlencoded data
app.use(express.urlencoded({ extended: false }));

// static files
// app.use('/', express.static(path.join(__dirname, 'public')));
app.get("/favicon.ico", (req, res) => {
  // You can send a default favicon or an empty response
  res.status(204).end();
});
app.get("/", (req, res) => {
  res.json({
    message: "Budget Api",
  });
});
//Test
app.get("/test", Authenticate, (req, res) => {
  res.send("Hello World!");
});

// routes
app.use("/auth", Auth);
app.use("/budget", Authenticate, Budget);

// error handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next();
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message,
  });
});

// server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
