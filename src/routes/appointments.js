import { Router } from "express";
import prisma from "../prismaClient.js";
import validateSaveAppointment from "../middlewares/save-appointment.js";

export const appointmentRouter = Router();

// Endpoint para crear una cita
appointmentRouter.post("/", validateSaveAppointment, async (req, res, next) => {
  const appointment = req.body;
  try {
    const createdAppointment = await prisma.appointment.create({
      data: appointment,
    });
    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: createdAppointment,
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint para obtener todas las citas
appointmentRouter.get("/", async (_req, res, next) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: { user: true, timeBlock: true },
    });
    res.status(200).json({
      success: true,
      message: "Appointments retrieved successfully",
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint para obtener una cita por ID
appointmentRouter.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { user: true, timeBlock: true },
    });
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Appointment retrieved successfully",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint para actualizar una cita por ID
appointmentRouter.put(
  "/:id",
  validateSaveAppointment,
  async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
      const updatedAppointment = await prisma.appointment.update({
        where: { id },
        data: updatedData,
      });
      res.status(200).json({
        success: true,
        message: "Appointment updated successfully",
        data: updatedAppointment,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Endpoint para eliminar una cita por ID
appointmentRouter.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.appointment.delete({
      where: { id },
    });
    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});
