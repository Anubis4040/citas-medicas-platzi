import express from "express";
import dotenv from "dotenv";
import { authRouter, userRouter  } from "./routes/index.js";
import { registerRequest } from "./middlewares/register.js";
import handleZodError from './error-handlers/zodError.js';
import handlePrismaError from './error-handlers/prismaError.js';
import authMiddleware from "./middlewares/auth.js";

const apiRouter = express.Router();

dotenv.config();
const app = express();

// Para procesar JSON
app.use(express.json());
// Para procesar datos de formularios (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Define register middleware
app.use(registerRequest);

const PORT = process.env.PORT || 3000;

// Define routes
apiRouter.use("/users", authMiddleware, userRouter);
apiRouter.use("/auth", authRouter);

app.use('/api', apiRouter);

const errorHandler = (err, _req, res, _next) => {
  console.log(err.message);
  if (handleZodError(err, res)) return;
  if (handlePrismaError(err, res)) return;
  res.status(500).json({ error: 'Internal Server Error' });
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
  