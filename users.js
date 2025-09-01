import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import validateSaveUser from "./middlewares/saveUserValidator.js";
import prisma from "./prismaClient.js";
import hashPassword from "./helpers/hashPassword.js";
export const router = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersFilePath = path.join(__dirname, "data.json");

console.log(usersFilePath, "usersFilePath");

// Get all users
router.get("/", async (_req, res, next) => {
  console.log(_req.user, "_req.user");
  try {
    const users = await prisma.user.findMany();
    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    next(err);
  }
});

// Create a new user
router.post("/", validateSaveUser, async (req, res, next) => {
  try {
    const newUser = req.body;
    newUser.password = await hashPassword(newUser.password);
    const result = await prisma.user.create({ data: newUser });
    console.log(result, "result");
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

// Get a user by ID
router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      res.json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({ success: 'false', error: "User not found" });
    }
  } catch (err) {
    next(err);
  }
});

// Update a user by ID
router.put("/:id", validateSaveUser, async (req, res, next) => {
  const id = req.params.id;
  try {
    const newUser = req.body;
    newUser.password = await hashPassword(newUser.password);
    const updatedUser = await prisma.user.update({
      where: { id },      // El id del usuario a actualizar
      data: newUser
    });
    console.log(updatedUser, "updatedUser");
    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
});

// Delete a user by ID
router.delete("/:id", async (req, res, next) => {
  const userId = req.params.id;
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId }
    });
    res.json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (err) {
    next(err)
  }
});
