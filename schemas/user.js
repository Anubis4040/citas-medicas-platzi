import * as z from "zod";

export const User = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
});
