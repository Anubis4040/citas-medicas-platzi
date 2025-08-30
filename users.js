import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import validateSaveUser from "./middlewares/saveUserValidator.js";
import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();
export const router = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersFilePath = path.join(__dirname, "data.json");

console.log(usersFilePath, "usersFilePath");

router.get("/", async (_req, res, next) => {
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

router.post("/", validateSaveUser, async (req, res, next) => {
  try {
    const newUser = req.body;
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

router.put("/:id", validateSaveUser, async (req, res, next) => {
  const id = req.params.id;
  try {
    const newUser = req.body;
    const updatedUser = await prisma.user.update({
      where: { id },      // El id del usuario a actualizar
      data: {                     // Los campos que quieres modificar
        name: newUser.name,
        email: newUser.email
      }
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
