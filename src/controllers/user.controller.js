const User = require("../models/user.model");

// Create a new user
async function handleCreateUser(req, res, next) {
  try {
    const { fullName, email, phone, password, address, order_history, role } =
      req.body;

    if (!fullName || !email || !phone || !password || !address) {
      return res.status(400).send("Please provide all required fields");
    }

    const existsUser = await User.findOne({ phone });
    if (existsUser)
      return res
        .status(400)
        .send({ status: false, message: "Phone number already exists" });

    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      address,
      role,
      order_history,
    });

    if (!user) {
      return res.status(500).send({
        status: false,
        message: "An error occurred while creating the user",
      });
    }

    return res
      .status(201)
      .send({ status: true, message: "User created", data: user });
  } catch (error) {
    console.log("Failed to create user", error);
    res.status(500).send("Failed to create user");
    next();
  }
}

// Login
async function handleLoginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).send({ status: false, message: "Please provide email and password" });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).send({ status: false, message: "User not found" });
    }

    // Authenticate user
    try {
      const { token, id } = await User.findByCredentials(email, password);
      return res.cookie("token", token).status(200).send({ status: true, message: "Login successful", token });
    } catch (authError) {
      if (authError.message === "Password is incorrect") {
        return res.status(401).send({ status: false, message: "Password is incorrect" });
      }
      throw authError;
    }
  } catch (error) {
    console.log("Failed to login user:", error.message);
   return res.status(500).send({ status: false, message: "Failed to login user" });
    
  }
}

// Update a user
async function handleUpdateUser(req, res, next) {
  try {
    const userId = req.params.id;
    const { fullName, email, phone, address, role } = req.body;

    if (!userId) {
      return res.status(400).send("User ID is required");
    }

    const user = await User.findByIdAndUpdate(userId, {
      fullName,
      email,
      phone,
      address,
      role,
    });

    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "User update failed" });
    }

    return res
      .status(201)
      .send({ status: true, message: "User updated", data: user });
  } catch (error) {
    console.log("Failed to update user", error);
    res.status(500).send("Failed to update user");
    next();
  }
}

// Get all users
async function handleGetUsers(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);

    if (!users) {
      return res.status(500).send({ status: false, message: "No users found" });
    }

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).send({
      status: true,
      message: "Users found",
      data: users,
      pagination: { currentPage: page, totalUsers, totalPages, limit },
    });
  } catch (error) {
    console.log("Failed to create user", error);
    res.status(500).send("Failed to create user");
    next();
  }
}

// Get a single user
async function handleGetSingleUser(req, res, next) {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).send({ status: false, message: "User ID is required" });
    }

    // Use `.select` to exclude the password field from the query result
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).send({ status: false, message: "User not found" });
    }

    return res.status(200).send({ status: true, message: "User found", data: user});
  } catch (error) {
    console.error("Failed to get user:", error);
    res.status(500).send({ status: false, message: "Failed to get user" });
    next(error);
  }
}

// Delete a user
async function handleDeleteUser(req, res, next) {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).send("User ID is required");
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res
      .status(200)
      .send({ status: true, message: "User deleted", _id: user._id });
  } catch (error) {
    console.log("Failed to delete user", error);
    res.status(500).send("Failed to delete user");
    next();
  }
}

// Logout a user
async function handleLogoutUser(req, res, next) {
  try {
    res.clearCookie("token");
    return res.status(200).json({ status: true, message: "Logout successfully" });
  } catch (error) {
    console.log("Failed to logout user", error);
    res.status(500).send("Failed to logout user");
    next();
  }
}

module.exports = {
  handleCreateUser,
  handleGetUsers,
  handleGetSingleUser,
  handleDeleteUser,
  handleUpdateUser,
  handleLoginUser,
  handleLogoutUser,
};
