import { Router } from "express";
import loginValidator from "../middlewares/loginValidator.js";
import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";
import { verifyPassword } from "../helpers/verifyPassword.js";

export const authRouter = Router();

authRouter.post("/login", loginValidator, async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await prisma.user.findUnique({
    where: { email }
  });
  if (!foundUser || await verifyPassword(password, foundUser.password) === false) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = jwt.sign(
    { userId: foundUser.id, email: foundUser.email, role: foundUser.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ message: "Login successful",token });

});