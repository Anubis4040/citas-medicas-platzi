import { Router } from "express";
import prisma from "../prismaClient.js";
import validateSaveTimeBlock from "../middlewares/save-time-block-validator.js";

export const adminRouter = Router();

// Endpoint para crear un bloque de tiempo
adminRouter.post(
  "/time-blocks",
  validateSaveTimeBlock,
  async (req, res, next) => {
    const timeBlock = req.body;
    try {
      const createdTimeBlock = await prisma.timeBlock.create({
        data: timeBlock,
      });
      res.status(201).json({
        success: true,
        message: "Time block created successfully",
        data: createdTimeBlock,
      });
    } catch (error) {
      next(error);
    }
  }
);


