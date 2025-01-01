const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "jwt_secret123";

function generateToken(user) {
  const payload = {
    id: user._id,
    role: user.role,
  };

  const token = jwt.sign(payload, SECRET, { expiresIn: "3d" });

  return token;
}

const verifyToken = (token) => {
  
    if (!token) return null;

    const payload = jwt.verify(token, SECRET);

    return payload;
};

module.exports = {
  generateToken,
  verifyToken,
};
