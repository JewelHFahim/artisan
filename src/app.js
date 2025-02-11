require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const { ALLOWED_ORIGINS, PORT } = require("./config/env");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const {
  checkForAuthenticationToken,
} = require("./middlewares/auth.middleware");

const app = express();
const port = PORT || 5000;

// Database connection
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationToken("token"));

const allowedOrigins = ALLOWED_ORIGINS ? ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) : [];

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },

    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);


app.get("/", (req, res) => {
  res.send({ message: "Server Running..." });
});

app.use("/api", routes);

app.listen(port, () => {
  console.log("Server runningon port:", port);
});

module.exports = app;