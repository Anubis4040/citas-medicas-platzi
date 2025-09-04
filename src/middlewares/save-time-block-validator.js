import { TimeBlock } from "../request-validators/time-block.js";

export default function validateSaveTimeBlock(req, _res, next) {
  try {
    TimeBlock.parse(req.body);
    next();
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
}
