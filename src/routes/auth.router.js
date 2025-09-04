import { Router } from "express";
import loginValidator from "../middlewares/loginValidator.js";
import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";
import { verifyPassword } from "../helpers/verifyPassword.js";
import hashPassword from "../helpers/hashPassword.js";
import validateSaveUser from "../middlewares/saveUserValidator.js";

export const authRouter = Router();

// Login route
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
  res.json({ message: "Login successful", token });

});

// Register route
authRouter.post("/register", validateSaveUser, async (req, res, next) => {
  try {
    const newUser = req.body;
    newUser.password = await hashPassword(newUser.password);
    const result = await prisma.user.create({ data: newUser });
    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPassword } = result; // Exclude password from response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userWithoutPassword,
    });
  } catch (err) {
    next(err);
  }
});