const mongoose = require("mongoose");
const bycrypt = require("bcrypt");
const { generateToken } = require("../services/auth.service");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    phone: { type: String, required: true, unique: true },

    address: { type: String, required: true },

    role: { type: String, default: "customer" },

    order_history: { type: Array, required: false },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = await bycrypt.genSalt(10);
  user.password = await bycrypt.hash(user.password, salt);

  next();
});

userSchema.static("findByCredentials", async function (email, password) {
  try {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");

    const isMatch = await bycrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Password is incorrect");

    const token = generateToken(user);

    return { token, id: user._id };
  } catch (error) {
    console.log("Failed to create user", error);
    throw error;
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
