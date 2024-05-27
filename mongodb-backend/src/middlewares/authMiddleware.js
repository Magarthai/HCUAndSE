const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
  
        if (!user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
  
        req.user = user;
        console.log(user)
        next();
      } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
    } else {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  });
  

// if admin
const isAdmin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(401).json({ message: "You are not authorized" });
    }
  });
  
module.exports = { authMiddleware, isAdmin };
