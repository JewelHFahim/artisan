const mongoose = require("mongoose");
const { MONGODB_URL } = require("./env");

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Mongodb connect success");
  } catch (error) {
    console.log("Meongodb connection failed", error.message);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.log("Mongodb database disconnected");
  });
}

module.exports = connectDB;