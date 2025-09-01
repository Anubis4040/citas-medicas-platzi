import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const { userId, email, role } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId, email, role };
    console.log('Authorized');
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default authMiddleware;
