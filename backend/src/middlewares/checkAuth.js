import admin from "../config/firebase.js";
const checkAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
export default checkAuth;
