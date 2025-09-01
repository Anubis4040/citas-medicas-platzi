export default function handlePrismaError(err, res) {
  console.log(err.constructor.name, "error class name");
  if (err.constructor.name === "PrismaClientKnownRequestError") {
    return res.status(400).json({
      error: 'Prisma error',
      code: err.code,
      message: err.message,
      meta: err.meta
    });
  }
  if (err.constructor.name === "PrismaClientValidationError") {
    return res.status(400).json({
      error: 'Validation error',
      message: err.message
    });
  }
  return null;
}