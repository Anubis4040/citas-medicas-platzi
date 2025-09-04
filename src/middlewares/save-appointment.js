import { Appointment } from "../request-validators/appointment.js";


export default function validateSaveAppointment(req, _res, next) {
  try {
    console.log(req.body, 'body');
    Appointment.parse(req.body);
    next();
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
}
