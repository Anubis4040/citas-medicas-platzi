import * as z from "zod";

export const Appointment = z.object({
  date: z.iso.datetime(),
  userId: z.string(),
  timeBlockId: z.string(),
});
