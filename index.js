import express from "express";
import dotenv from "dotenv";
import { router as usersRouter } from "./users.js";
import { registerRequest } from "./middlewares/register.js";
import handleZodError from './errorHandlers/zodError.js';
import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient()

dotenv.config();
const app = express();
export const mainRotuer = express.Router();

// Para procesar JSON
app.use(express.json());
// Para procesar datos de formularios (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Define register middleware
app.use(registerRequest);

const PORT = process.env.PORT || 3000;

// Routes
mainRotuer.get("/prisma-test", async (req, res, next) => {
  try {
    // Intenta obtener la fecha y hora actual de la base de datos
    const users = await prisma.user.findMany();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

// Define routes
app.use("/api", mainRotuer);
app.use("/api/users", usersRouter);

const errorHandler = (err, req, res, next) => {
  console.log(err.message);
  if (handleZodError(err, res)) return;
  res.status(500).json({ error: 'Internal Server Error' });
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
  