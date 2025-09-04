import express from "express";
import dotenv from "dotenv";
import { adminRouter, appointmentRouter, authRouter, userRouter } from "./routes/index.js";
import { registerRequest } from "./middlewares/register.js";
import handleZodError from "./error-handlers/zodError.js";
import handlePrismaError from "./error-handlers/prismaError.js";
import authMiddleware from "./middlewares/auth.js";
import { requireRole } from "./middlewares/role.js";

const apiRouter = express.Router();

dotenv.config();
export const app = express();

// Para procesar JSON
app.use(express.json());
// Para procesar datos de formularios (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Define register middleware
app.use(registerRequest);

const PORT = process.env.PORT || 3000;

// Define routes
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", authMiddleware, userRouter);
apiRouter.use("/admin", authMiddleware, requireRole('ADMIN'), adminRouter);
apiRouter.use("/appointments", authMiddleware, appointmentRouter);

app.use("/api", apiRouter);

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, next) => {
  console.log(err.message, '--Error message--');
  if (handleZodError(err, res)) return;
  if (handlePrismaError(err, res)) return;
  res.status(500).json({ error: "Internal Server Error" });
};

app.use(errorHandler);

// Solo inicia el servidor si NO estamos en test
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
