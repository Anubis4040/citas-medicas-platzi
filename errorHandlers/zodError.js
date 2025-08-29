// middlewares/zodErrorHandler.js
import { ZodError } from 'zod';

export default function handleZodError(err, res) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Invalid input',
      issues: err.issues.map(issue => ({
        path: issue.path,
        message: issue.message,
      })),
    });
  }
  return null;
}