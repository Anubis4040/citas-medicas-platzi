import { Login } from "../request-validators/login.js";


export default function loginValidator(req, _res, next) {
  try {
    Login.parse(req.body);
    next();
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
}
