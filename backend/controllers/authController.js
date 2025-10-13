const CreateError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const people = require("../models/people");

const getAccessToken = async (req, res, next) => {
  try {
    const cookies =
      Object.keys(req.signedCookies).length > 0 ? req.signedCookies : {};

    const refreshToken = cookies[process.env.REFRESH_TOKEN_COOKIE_NAME];
    const accessToken = cookies[process.env.ACCESS_TOKEN_COOKIE_NAME];

    // No refresh token → cannot issue new access token
    if (!refreshToken) {
      return res.status(401).json({ message: "Session expired, please login" });
    }

    // Access token exists → return it along with userObject
    if (accessToken) {
      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_TOKEN_SECRET
      );
      return res.status(200).json({ accessToken, userObject: decoded });
    }

    // Access token missing but refresh token exists → generate new access token
    const decodedRefresh = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );

    const userObject = {
      userId: decodedRefresh.userId,
      username: decodedRefresh.username,
      email: decodedRefresh.email,
      role: decodedRefresh.role,
    };

    const newAccessToken = jwt.sign(
      userObject,
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY || "1d" }
    );

    // Set new access token cookie
    res.cookie(process.env.ACCESS_TOKEN_COOKIE_NAME, newAccessToken, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      signed: true,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({ accessToken: newAccessToken, userObject });
  } catch (err) {
    console.log(err.message + "get access token");
    return res.status(401).json({ message: "Session expired, please login" });
  }
};

const login = async (req, res, next) => {
  try {
    const user = req.user; // assuming Express Validator sets req.user after validation

    // Prepare JWT payload
    const userObject = {
      userId: user._id,
      username: user.name,
      email: user.email,
      role: user.role,
    };

    // ----------------------
    // Refresh Token (long-term, e.g., 30 days)
    // ----------------------
    const refreshToken = jwt.sign(
      userObject,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY || "30d" }
    );

    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      signed: true,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    // ----------------------
    // Access Token (short-term, e.g., 1 day)
    // ----------------------
    const accessToken = jwt.sign(
      userObject,
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY || "1d" }
    );

    res.cookie(process.env.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      signed: true,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    // Send response
    res.status(200).json({ userObject, accessToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
const logout = (req, res, next) => {
  try {
    res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME);
    res.clearCookie(process.env.ACCESS_TOKEN_COOKIE_NAME);
    res.status(200).json({ message: "logout successful", success: true });
  } catch (error) {
    res.status(500).json({ message: "logout failed", success: false });
  }
};

module.exports = {
  login,
  logout,
  getAccessToken,
};
