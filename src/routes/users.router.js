import { Router } from "express";
import validateSaveUser from "../middlewares/saveUserValidator.js";
import prisma from "../prismaClient.js";
import hashPassword from "../helpers/hashPassword.js";

export const userRouter = Router();

// Get all users
userRouter.get("/", async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        appointments: true, // Esto incluye las citas relacionadas
      }
    });
    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    next(err);
  }
});

// Create a new user
userRouter.post("/", validateSaveUser, async (req, res, next) => {
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
userRouter.get("/:id", async (req, res, next) => {
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
userRouter.put("/:id", validateSaveUser, async (req, res, next) => {
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

// Get appointments for a specific user
userRouter.get("/:id/appointments", async (req, res, next) => {
  const id = req.params.id;
  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: id }
    });
    res.json({
      success: true,
      message: "Appointments retrieved successfully",
      data: appointments,
    });
  } catch (err) {
    next(err);
  }
});

// Delete a user by ID
userRouter.delete("/:id", async (req, res, next) => {
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
