const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

module.exports = {
  PORT,
  MONGODB_URL,
  ALLOWED_ORIGINS,
};


// MONGODB_URL=mongodb://127.0.0.1:27017/artisan