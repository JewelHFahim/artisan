const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

MAILTRAP_HOST = process.env.MAILTRAP_HOST;
MAILTRAP_PORT = process.env.MAILTRAP_PORT;
MAILTRAP_USER = process.env.MAILTRAP_USER;
MAILTRAP_PASS = process.env.MAILTRAP_PASS;
RESET_TOKEN_EXPIRY = process.env.RESET_TOKEN_EXPIRY;
SECRET = process.env.JWT_SECRET

module.exports = {
  PORT,
  MONGODB_URL,
  ALLOWED_ORIGINS,
  MAILTRAP_HOST,
  MAILTRAP_PORT,
  MAILTRAP_USER,
  MAILTRAP_PASS,
  RESET_TOKEN_EXPIRY,
  SECRET
};

// MONGODB_URL=mongodb+srv://artisanEcom:artisanEcom123@cluster0.d0tal.mongodb.net/artisan?retryWrites=true&w=majority&appName=Cluster0


// MONGODB_URL=mongodb://127.0.0.1:27017/artisan