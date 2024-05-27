const User = require("../models/User.model");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { Error } = require("mongoose");
const jwt = require("jsonwebtoken");
const { generateRefreshToken } = require("../config/refreshToken");

const createUser = async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {4
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User already exists");
  }
};
const loginUserCtrl = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const findUser = await User.findOne({ email: email });
  if (findUser) {
    const isPasswordMatched = await findUser.isPasswordMatched(password);
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser?._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    if (isPasswordMatched) {
      res.json({
        _id: findUser._id,
        fname: findUser.fname,
        lname: findUser.lname,
        email: findUser.email,
        phone: findUser.phone,
        age: findUser.age,
        token: generateToken(findUser?._id),
      });
      console.log("User logged in successfully");
    } else {
      throw new Error("Invalid password");
    }
  } else {
    throw new Error("User not found");
  }
});

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie.refreshToken) {
    throw new Error("Refresh token not found");
  }
  const refreshToken = cookie.refreshToken;
  console.log(refreshToken);
  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw new Error("User not found");
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decode) => {
    if (err || user.id !== decode.id) {
      throw new Error("Invalid refresh token");
    }
    const accessToken = generateToken(User?._id);
    res.json({ accessToken });
  });
});

// logout user

const logoutUserCtrl = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // No Content
  }

  await User.findByIdAndUpdate(user._id, { refreshToken: "" });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // No Content
});

// get all user
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUser = await User.find();
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

// get a single users

const getSingleUser = asyncHandler(async (req, res) => {
  const phone = req.params.phone;
  try {
    const getUser = await User.findOne({ phone: phone });
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

// delete single user

const deleteUser = asyncHandler(async (req, res) => {
  const phone = req.params.phone;
  try {
    const deleteUser = await User.findOneAndDelete({ phone: phone });
    res.json(deleteUser);
    console.log("User deleted successfully");
  } catch (error) {
    throw new Error(error);
  }
});

// update user details except password

const updateUser = asyncHandler(async (req, res) => {
  const phone = req.params.phone;
  try {
    const updateUser = await User.findOneAndUpdate(
      { phone: phone },
      {
        fname: req.body.fname,
        lname: req.body.lname,
        address: req.body.address,
        age: req.body.age,
        email: req.body.email,
        gender: req.body.gender,
      },
      {
        new: true,
      }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

const RedeemCode = require('../models/redeemCode.model');

const redeemCode = asyncHandler(async (req, res) => {
    try {
         const cookie = req.cookies;
        if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
        const refreshToken = cookie.refreshToken;
        const user = await User.findOne({ refreshToken });
        const { code } = req.body;

        // Logging: Print request headers and user data
        console.log('Request Headers:', req.headers);
        console.log('User Data:', req.user);

        // Check if the code exists and is not already redeemed
        const redeemCode = await RedeemCode.findOne({ code, isRedeemed: false });

        if (!redeemCode) {
            return res.status(404).json({ message: 'Invalid or already redeemed code' });
        }
        // Check if the user object exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const pointsToAdd = redeemCode.points || 0;
        user.points += pointsToAdd;
        user.updateRFMLevel();
        redeemCode.isRedeemed = true;
        redeemCode.redeemedBy = user._id;
        redeemCode.redeemedAt = new Date();
        await user.save();
        await redeemCode.save();

        return res.json({ message: 'Code redeemed successfully', user });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

  


module.exports = {
  createUser,
  loginUserCtrl,
  logoutUserCtrl,
  getAllUser,
  getSingleUser,
  deleteUser,
  updateUser,
  handleRefreshToken,
  redeemCode,
};
