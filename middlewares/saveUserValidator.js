import { User } from "../schemas/user.js";

export default function validateSaveUser(req, res, next) {
  try {
    User.parse(req.body);
    next();
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
}
