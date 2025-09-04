import * as z from "zod";

export const TimeBlock = z.object({
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime(),
});
