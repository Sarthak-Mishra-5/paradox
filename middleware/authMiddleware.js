const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    console.log(token);

    if (!token) {
      throw new Error("Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new Error("Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    
    const statusCode = error instanceof Error && error.status ? error.status : 500;
    return res.status(statusCode).json({ message: error.message });
  }
};

module.exports = { verifyJWT };
